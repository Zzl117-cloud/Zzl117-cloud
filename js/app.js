/* =========================================================
   C 语言阶梯课堂 · 交互逻辑（原生 JS，无依赖）
   ---------------------------------------------------------
   结构：
   1. 状态与本地存储      2. 工具函数与代码高亮
   3. 侧边栏与章节渲染    4. 测试引擎（判分/评分/进度）
   5. 综合测试、事件绑定与启动
   ========================================================= */
(function () {
  "use strict";

  /* 通过线：测试得分 >= 60 分算通过本章 */
  var PASS = 60;
  var KEY = "clearn.v1";
  var COURSE = window.COURSE || { chapters: [], examExtra: [] };
  var CHAPTERS = COURSE.chapters;

  /* ---------------- 1. 状态与本地存储 ---------------- */
  var DEFAULT_STATE = { theme: "light", chapters: {}, notes: "" };
  var state = readState();

  function readState() {
    var base = JSON.parse(JSON.stringify(DEFAULT_STATE));
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        if (saved && typeof saved === "object") {
          base.theme = saved.theme || base.theme;
          base.notes = saved.notes || "";
          base.chapters = saved.chapters || {};
        }
      }
    } catch (e) { /* 存储不可用时静默降级为内存状态 */ }
    return base;
  }
  function writeState() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function ch(id) {
    if (!state.chapters[id]) {
      state.chapters[id] = { best: -1, practice: [], tab: "summary" };
    }
    return state.chapters[id];
  }
  function bestOf(id) {
    var c = state.chapters[id];
    return c && typeof c.best === "number" ? c.best : -1;
  }
  function isDone(id) { return bestOf(id) >= PASS; }

  /* ---------------- 2. 工具函数 ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function stripTags(html) {
    var d = document.createElement("div");
    d.innerHTML = html || "";
    return (d.textContent || "").replace(/\s+/g, " ");
  }
  var toastTimer = null;
  function toast(msg) {
    var box = $("#toast");
    if (!box) return;
    box.textContent = msg;
    box.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.classList.remove("show"); }, 2200);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast("已复制到剪贴板");
      }, function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); toast("已复制到剪贴板"); }
    catch (e) { toast("复制失败，请手动选择复制"); }
    document.body.removeChild(ta);
  }

  /* ---------------- 2b. C 代码语法高亮 ---------------- */
  var KEYWORDS = "auto|break|case|char|const|continue|default|do|double|else|enum|extern|" +
    "float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|" +
    "struct|switch|typedef|union|unsigned|void|volatile|while|NULL|EOF|stdin|stdout|stderr|" +
    "FILE|size_t|bool|true|false";
  /* 分组顺序很重要：注释 → 字符串 → 预处理 → 关键字 → 数字 → 函数名 */
  var HL_RE = new RegExp(
    "(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)" +                 /* 1 注释 */
    "|(\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*')" + /* 2 字符/字符串 */
    "|(^[ \\t]*#[^\\n]*)" +                                     /* 3 预处理指令 */
    "|\\b(" + KEYWORDS + ")\\b" +                               /* 4 关键字 */
    "|\\b(\\d+(?:\\.\\d+)?)\\b" +                               /* 5 数字 */
    "|\\b([A-Za-z_]\\w*)(?=\\s*\\()",                           /* 6 函数调用 */
    "gm"
  );
  function highlight(code) {
    var out = "", last = 0, m;
    HL_RE.lastIndex = 0;
    while ((m = HL_RE.exec(code)) !== null) {
      if (m.index > last) out += esc(code.slice(last, m.index));
      var cls = m[1] ? "tok-com" : m[2] ? "tok-str" : m[3] ? "tok-pre"
        : m[4] ? "tok-key" : m[5] ? "tok-num" : "tok-fn";
      out += '<span class="' + cls + '">' + esc(m[0]) + "</span>";
      last = m.index + m[0].length;
      if (m[0] === "") HL_RE.lastIndex++;   /* 防止空匹配死循环 */
    }
    out += esc(code.slice(last));
    return out;
  }

  /* ---------------- 2c. 代码块与调用框 ---------------- */
  function codeBlock(name, code) {
    return '<div class="code-block">' +
      '<div class="code-head"><span class="dots"><i></i><i></i><i></i></span>' +
      '<span class="name">' + esc(name || "code.c") + "</span>" +
      '<button class="copy-btn" type="button">复制</button></div>' +
      "<pre><code>" + highlight(code) + "</code></pre></div>";
  }
  function outBlock(text) {
    return '<p class="code-note">运行结果：</p><div class="out-block">' + esc(text) + "</div>";
  }
  function callout(kind, icon, html) {
    return '<div class="callout ' + kind + '"><span class="ico">' + icon +
      '</span><div class="body">' + html + "</div></div>";
  }

  /* ---------------- 3. 侧边栏与进度 ---------------- */
  var current = null;          /* { id, tab }：当前浏览位置 */
  var searchKeyword = "";

  function findChapter(id) {
    for (var i = 0; i < CHAPTERS.length; i++) {
      if (CHAPTERS[i].id === id) return CHAPTERS[i];
    }
    return null;
  }
  function orderNo(c) {
    return c.id === "appendix" ? "附" : String(CHAPTERS.indexOf(c) + 1);
  }
  function chapterMeta(c) {
    var parts = [];
    if (c.level) parts.push(c.level);
    if (c.minutes) parts.push("约 " + c.minutes + " 分钟");
    if (c.tags && c.tags.length) parts.push(c.tags.slice(0, 2).join(" / "));
    return parts.join(" · ");
  }

  function renderSidebar() {
    var list = $("#chapterList");
    if (!list) return;
    var kw = searchKeyword.trim().toLowerCase();
    var html = "", lastGroup = "";

    CHAPTERS.forEach(function (c) {
      var hay = [c.title, c.lead, (c.tags || []).join(" "), c.group, stripTags(c.summary)]
        .join(" ").toLowerCase();
      if (kw && hay.indexOf(kw) === -1) return;

      if (c.group && c.group !== lastGroup) {
        html += '<div class="list-group-title">' + esc(c.group) + "</div>";
        lastGroup = c.group;
      }
      var done = isDone(c.id);
      var active = (current && current.id === c.id) ? " active" : "";
      html += '<button type="button" class="chapter-item' + (done ? " done" : "") + active +
        '" data-ch="' + esc(c.id) + '">' +
        '<span class="num">' + esc(done ? "✓" : orderNo(c)) + "</span>" +
        '<span class="item-body">' +
        '<span class="item-title">' + esc(c.emoji || "") + " " + esc(c.title) + "</span>" +
        '<span class="item-meta">' + esc(chapterMeta(c)) + "</span>" +
        "</span></button>";
    });

    if (!html) html = '<div class="list-group-title">没有匹配的章节</div>';
    list.innerHTML = html;
  }

  function updateProgress() {
    var learn = CHAPTERS.filter(function (c) { return c.id !== "appendix"; });
    var done = learn.filter(function (c) { return isDone(c.id); }).length;
    var pct = learn.length ? Math.round(done * 100 / learn.length) : 0;
    var fill = $("#topProgressFill"), text = $("#topProgressText");
    if (fill) fill.style.width = pct + "%";
    if (text) text.textContent = done + " / " + learn.length + " 章已通过（" + pct + "%）";
  }

  /* ---------------- 4a. 知识总结页 ---------------- */
  function summaryHTML(c) {
    var html = '<div class="prose">' + (c.summary || "") + "</div>";
    (c.examples || []).forEach(function (ex, i) {
      html += '<h2 class="example-title">示例 ' + (i + 1) + "：" + esc(ex.name || "") + "</h2>";
      if (ex.note) html += "<p>" + ex.note + "</p>";
      html += codeBlock(ex.name, ex.code || "");
      if (ex.output) html += outBlock(ex.output);
    });
    return html;
  }

  /* ---------------- 4b. 动手实践页 ---------------- */
  function practiceHTML(c) {
    var items = c.practice || [];
    if (!items.length) {
      return callout("info", "💡", "<p>本页是速查附录，没有配套练习。到前面章节的「动手实践」里练习吧。</p>");
    }
    var st = ch(c.id);
    var html = '<p class="lead">先自己动手写，卡住了再看提示，最后对照参考答案。写过的题点一下「标记已完成」。</p>';

    items.forEach(function (p, i) {
      var doneP = st.practice.indexOf(i) !== -1;
      html += '<div class="practice-card" data-pi="' + i + '">' +
        '<div class="pc-head"><span class="pc-no">练习 ' + (i + 1) + "</span>" +
        '<div class="item-body"><h3>' + esc(p.title) + "</h3>" +
        '<div class="pc-req">' + (p.req || "") + "</div></div></div>";

      if (p.sample) {
        html += '<p>运行效果示例：</p><div class="sample-run">' + esc(p.sample) + "</div>";
      }

      html += '<div class="pc-actions">' +
        '<button type="button" class="detail-toggle" data-show="hint">💡 看提示</button>' +
        '<button type="button" class="detail-toggle" data-show="solution">🔑 参考答案</button>' +
        '<button type="button" class="detail-toggle' + (doneP ? " on" : "") + '" data-mark="1">' +
        (doneP ? "✓ 已完成" : "标记已完成") + "</button></div>";

      html += '<div class="detail-body" data-body="hint" hidden><h4>思路提示</h4><ul>' +
        (p.hint || []).map(function (h) { return "<li>" + h + "</li>"; }).join("") +
        "</ul></div>";

      html += '<div class="detail-body" data-body="solution" hidden><h4>参考答案</h4>' +
        codeBlock("solution.c", p.solution || "") +
        (p.solutionNote ? "<p>" + p.solutionNote + "</p>" : "") + "</div>";

      html += "</div>";
    });
    return html;
  }

  /* ---------------- 4c. 章节页面框架 ---------------- */
  function renderChapter(id, tab) {
    var c = findChapter(id);
    if (!c) { renderHome(); return; }

    current = { id: id, tab: tab || (ch(id).tab || "summary") };
    ch(id).tab = current.tab;
    writeState();

    var quizCount = (c.quiz || []).length;
    var best = bestOf(c.id);
    var tabs = [
      { k: "summary", label: "📘 知识总结", badge: "" },
      { k: "practice", label: "🛠 动手实践", badge: (c.practice || []).length ? (c.practice || []).length + " 题" : "" },
      { k: "quiz", label: "✅ 随堂测试", badge: quizCount ? quizCount + " 题" + (best >= 0 ? " · 最高 " + best : "") : "无" }
    ].map(function (t) {
      return '<button type="button" class="tab' + (current.tab === t.k ? " active" : "") +
        '" data-tab="' + t.k + '">' + t.label +
        (t.badge ? '<span class="tab-badge">' + esc(t.badge) + "</span>" : "") + "</button>";
    }).join("");

    var chips = '<div class="chip-row">' +
      '<span class="chip gray">' + esc(c.level || "基础") + "</span>" +
      '<span class="chip gray">约 ' + esc(String(c.minutes || 20)) + " 分钟</span>" +
      (best >= 0
        ? '<span class="chip ' + (best >= PASS ? "ok" : "warn") + '">测试最高 ' + best + " 分</span>"
        : '<span class="chip">尚未测试</span>') +
      (isDone(c.id) ? '<span class="chip ok">✓ 已通过</span>' : "") +
      "</div>";

    var head = '<header class="page-head">' +
      '<div class="crumb">' + esc(c.group || "") + " · 第 " + esc(orderNo(c)) + " 部分</div>" +
      "<h1>" + esc(c.emoji || "") + " " + esc(c.title) + "</h1>" +
      '<p class="lead">' + esc(c.lead || "") + "</p>" +
      '<div class="chip-row">' + (c.tags || []).map(function (t) {
        return '<span class="chip">' + esc(t) + "</span>";
      }).join("") + "</div>" + chips + "</header>";

    var body;
    if (current.tab === "practice") body = practiceHTML(c);
    else if (current.tab === "quiz") body = '<div data-quiz-container="' + esc(c.id) + '"></div>';
    else body = summaryHTML(c);

    $("#page").innerHTML = head + '<div class="tabs">' + tabs + "</div>" + body;

    if (current.tab === "quiz") setupQuiz($("[data-quiz-container]"), c.quiz || [], c.id, null);
    renderPager(c);
    renderSidebar();
    updateProgress();
    window.scrollTo(0, 0);
  }

  function renderPager(c) {
    var i = CHAPTERS.indexOf(c);
    var prev = i > 0 ? CHAPTERS[i - 1] : null;
    var next = i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : null;
    var html = "";
    html += prev
      ? '<a href="#' + prev.id + '/summary"><small>← 上一章</small><strong>' + esc(prev.title) + "</strong></a>"
      : '<a href="#" class="disabled"><small>已是第一章</small><strong>开始学习吧</strong></a>';
    html += next
      ? '<a href="#' + next.id + '/summary" class="next"><small>下一章 →</small><strong>' + esc(next.title) + "</strong></a>"
      : '<a href="#" class="next disabled"><small>全部学完</small><strong>试试综合测试 🎓</strong></a>';
    $("#pager").innerHTML = html;
  }

  /* ---------------- 5. 测试引擎 ---------------- */
  var LETTERS = "ABCDEFGH";

  function setupQuiz(container, questions, id, opts) {
    if (!container) return;
    opts = opts || {};
    if (!questions.length) {
      container.innerHTML = callout("info", "💡", "<p>这一章暂时没有测试题。</p>");
      return;
    }

    var st = ch(id);                       /* id = "exam" 时也能复用同一套存储 */
    var selected = {};                     /* 题号 -> 选项序号 */
    var submitted = false;

    container.innerHTML =
      '<div class="quiz-top"><h3>' + esc(opts.title || "随堂测试") + " · 共 " + questions.length + " 题</h3>" +
      '<div class="quiz-meter"><span data-meter-text>已作答 0/' + questions.length + "</span>" +
      '<div class="bar"><span data-meter-fill></span></div></div></div>' +
      '<div class="result-box" data-result></div>' +
      '<div class="q-list">' + questions.map(function (q, i) {
        return '<div class="q-item" data-qi="' + i + '">' +
          '<p class="q-text"><span class="qn">' + (i + 1) + ".</span>" + esc(q.q) + "</p>" +
          '<div class="q-opts">' + (q.opts || []).map(function (o, j) {
            return '<label class="q-opt" data-opt="' + j + '">' +
              '<input type="radio" name="' + id + "-q" + i + '" value="' + j + '">' +
              '<span class="k">' + LETTERS[j] + ".</span><span>" + esc(o) + "</span></label>";
          }).join("") + "</div>" +
          '<div class="q-explain" hidden></div></div>';
      }).join("") + "</div>" +
      '<div class="quiz-actions">' +
      '<button type="button" class="primary-btn" data-submit>提交并判分</button>' +
      '<button type="button" class="detail-toggle" data-retry>重做</button>' +
      '<span class="tab-badge" data-best>' + (st.best >= 0 ? "历史最高：" + st.best + " 分" : "还没有测试记录") + "</span></div>";

    var meterText = $("[data-meter-text]", container);
    var meterFill = $("[data-meter-fill]", container);
    var resultBox = $("[data-result]", container);

    function refreshMeter() {
      var n = Object.keys(selected).length;
      meterText.textContent = "已作答 " + n + "/" + questions.length;
      meterFill.style.width = Math.round(n * 100 / questions.length) + "%";
    }

    container.addEventListener("change", function (e) {
      if (submitted) return;
      var input = e.target;
      if (input.type !== "radio") return;
      var item = input.closest(".q-item");
      selected[Number(item.dataset.qi)] = Number(input.value);
      refreshMeter();
    });

    $("[data-submit]", container).addEventListener("click", function () {
      if (submitted) return;
      if (Object.keys(selected).length < questions.length) {
        toast("还有 " + (questions.length - Object.keys(selected).length) + " 题没有作答");
        return;
      }
      submitted = true;
      grade();
    });

    $("[data-retry]", container).addEventListener("click", function () {
      submitted = false;
      selected = {};
      $$(".q-item", container).forEach(function (item) {
        $$(".q-opt", item).forEach(function (lb) {
          lb.classList.remove("correct", "wrong", "locked");
          var input = $("input", lb);
          input.disabled = false;
          input.checked = false;
        });
        var expl = $(".q-explain", item);
        expl.hidden = true;
        expl.innerHTML = "";
      });
      resultBox.className = "result-box";
      resultBox.innerHTML = "";
      refreshMeter();
      toast("已重置，再试一次吧");
    });

    function grade() {
      var right = 0;
      questions.forEach(function (q, i) {
        var item = $('.q-item[data-qi="' + i + '"]', container);
        $$(".q-opt", item).forEach(function (lb, j) {
          lb.classList.add("locked");
          $("input", lb).disabled = true;
          if (j === q.answer) lb.classList.add("correct");
          else if (selected[i] === j) lb.classList.add("wrong");
        });
        if (selected[i] === q.answer) right++;
        var expl = $(".q-explain", item);
        expl.hidden = false;
        expl.innerHTML = "正确答案：" + LETTERS[q.answer] + "。" + esc(q.explain || "");
      });

      var score = Math.round(right * 100 / questions.length);
      var pass = score >= (opts.passLine || PASS);
      var prevBest = st.best;
      if (score > prevBest) { st.best = score; writeState(); }

      resultBox.className = "result-box show " + (pass ? "pass" : "fail");
      resultBox.innerHTML = '<span class="score">' + score + " 分</span>（答对 " + right + "/" +
        questions.length + " 题）" + (pass
          ? "<br>🎉 通过！" + (opts.passTip || "这一章的基础已经打牢，可以进入下一章了。")
          : "<br>还没到 " + (opts.passLine || PASS) + " 分。建议回到「知识总结」把错题的解析对照再读一遍，然后点「重做」再测一次。")
        + (prevBest >= 0 && score <= prevBest ? "<br>历史最高分：" + prevBest + " 分。" : "");

      $("[data-best]", container).textContent = st.best >= 0 ? "历史最高：" + st.best + " 分" : "";

      updateProgress();
      renderSidebar();
      updateQuizTabBadge(id, st.best);
      toast(pass ? "通过！得分 " + score : "得分 " + score + "，再练一次会更好");
    }

    refreshMeter();
  }

  /* 判分后同步更新「随堂测试」标签上的最高分，不用整页重绘 */
  function updateQuizTabBadge(id, best) {
    if (!current || current.id !== id || best < 0) return;
    var c = findChapter(id);
    if (!c) return;                      /* 综合测试没有对应章节，直接跳过 */
    var tab = $('#page .tab[data-tab="quiz"] .tab-badge');
    if (tab) tab.textContent = (c.quiz || []).length + " 题 · 最高 " + best;
  }

  /* ---------------- 6. 综合测试 ---------------- */
  function examPage() {
    var pool = [];
    CHAPTERS.forEach(function (c) {
      (c.quiz || []).forEach(function (q) { pool.push(q); });
    });
    (COURSE.examExtra || []).forEach(function (q) { pool.push(q); });

    current = null;

    if (!pool.length) {
      $("#page").innerHTML = '<header class="page-head"><h1>🎓 综合测试</h1></header>' +
        callout("warn", "⚠️", "<p>题库为空，请先在课程文件中添加测试题。</p>");
      renderSidebar();
      return;
    }

    for (var i = pool.length - 1; i > 0; i--) {            /* Fisher-Yates 洗牌 */
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    var picked = pool.slice(0, Math.min(15, pool.length));
    current = { id: "exam", tab: "quiz" };

    var st = ch("exam");
    var learn = CHAPTERS.filter(function (c) { return c.id !== "appendix"; });
    var doneCount = learn.filter(function (c) { return isDone(c.id); }).length;

    var head = '<header class="page-head">' +
      '<div class="crumb">综合测试 · 全部章节随机抽题</div>' +
      "<h1>🎓 综合测试</h1>" +
      '<p class="lead">从全书题库随机抽取 ' + picked.length +
      " 道题，60 分及格。每次进入都会重新随机——先回去把各章测试做通过再来吧。</p>" +
      '<div class="chip-row"><span class="chip gray">共 ' + picked.length + " 题</span>" +
      '<span class="chip gray">及格线 60 分</span>' +
      '<span class="chip ' + (doneCount === learn.length ? "ok" : "warn") + '">已通过 ' +
      doneCount + "/" + learn.length + " 章</span>" +
      (st.best >= 0 ? '<span class="chip ok">综合最高 ' + st.best + " 分</span>" : "") +
      "</div></header>";

    $("#page").innerHTML = head + '<div class="quiz-wrap" data-quiz-container="exam"></div>';

    setupQuiz($("[data-quiz-container]"), picked, "exam", {
      title: "综合测试",
      passTip: "全书主要内容你都掌握了，可以去挑战动态内存、链表和算法题了！"
    });

    var back = CHAPTERS.length >= 2 ? CHAPTERS[CHAPTERS.length - 2] : CHAPTERS[0];
    $("#pager").innerHTML =
      '<a href="#ch1/summary"><small>← 回到课程</small><strong>继续按章学习</strong></a>' +
      '<a href="#' + back.id + '/quiz" class="next"><small>想要针对性练习</small><strong>' +
      esc(back.title) + "</strong></a>";

    renderSidebar();
    window.scrollTo(0, 0);
  }

  /* ---------------- 7. 页面交互 ---------------- */
  function toggleDetail(btn) {
    var card = btn.closest(".practice-card");
    var body = $('[data-body="' + btn.dataset.show + '"]', card);
    if (!body) return;
    var open = body.hidden;
    body.hidden = !open;
    btn.classList.toggle("on", open);
    if (btn.dataset.show === "hint") btn.textContent = open ? "💡 收起提示" : "💡 看提示";
    else btn.textContent = open ? "🔑 收起答案" : "🔑 参考答案";
  }

  function togglePracticeDone(btn) {
    if (!current) return;
    var card = btn.closest(".practice-card");
    var pi = Number(card.dataset.pi);
    var st = ch(current.id);
    var pos = st.practice.indexOf(pi);
    if (pos === -1) {
      st.practice.push(pi);
      btn.classList.add("on");
      btn.textContent = "✓ 已完成";
      toast("已标记完成，加油！");
    } else {
      st.practice.splice(pos, 1);
      btn.classList.remove("on");
      btn.textContent = "标记已完成";
    }
    writeState();
  }

  function onPageClick(e) {
    var t = e.target;
    if (!t.closest) return;

    var copyBtn = t.closest(".copy-btn");
    if (copyBtn) {
      var pre = $("pre", copyBtn.closest(".code-block"));
      if (pre) copyText(pre.innerText);
      return;
    }

    var tabBtn = t.closest(".tab");
    if (tabBtn && current && current.id !== "exam") {
      location.hash = "#" + current.id + "/" + tabBtn.dataset.tab;
      return;
    }

    var show = t.closest("[data-show]");
    if (show) { toggleDetail(show); return; }

    var mark = t.closest("[data-mark]");
    if (mark) { togglePracticeDone(mark); return; }
  }

  /* ---------------- 8. 主题、侧边栏、重置 ---------------- */
  function applyTheme() {
    document.body.setAttribute("data-theme", state.theme === "dark" ? "dark" : "light");
    var btn = $("#themeBtn");
    if (btn) btn.textContent = state.theme === "dark" ? "☀️" : "🌙";
  }
  function openSidebar() {
    $("#sidebar").classList.add("open");
    $("#backdrop").classList.add("show");
  }
  function closeSidebar() {
    $("#sidebar").classList.remove("open");
    $("#backdrop").classList.remove("show");
  }
  function resetAll() {
    if (!window.confirm("确定要清空全部学习记录吗？（测试得分、练习进度、草稿本内容都会删除）")) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    applyTheme();
    var box = $("#notepadArea");
    if (box) box.value = "";
    renderChapter(CHAPTERS[0] ? CHAPTERS[0].id : "ch1", "summary");
    toast("已清空记录，从头开始吧");
  }

  /* ---------------- 9. 路由与启动 ---------------- */
  function lastVisited() {
    for (var i = 0; i < CHAPTERS.length; i++) {
      if (CHAPTERS[i].id !== "appendix" && !isDone(CHAPTERS[i].id)) return CHAPTERS[i].id;
    }
    return CHAPTERS.length ? CHAPTERS[0].id : "ch1";
  }

  function route() {
    var hash = "";
    try { hash = decodeURIComponent(location.hash.replace(/^#/, "")); } catch (e) { hash = ""; }

    if (hash === "exam") { examPage(); return; }

    var parts = hash.split("/");
    var id = parts[0];
    var tab = ["summary", "practice", "quiz"].indexOf(parts[1]) !== -1 ? parts[1] : "summary";

    if (!findChapter(id)) {
      location.hash = "#" + lastVisited() + "/summary";
      return;
    }
    renderChapter(id, tab);
  }

  function wireEvents() {
    $("#chapterList").addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".chapter-item") : null;
      if (!btn) return;
      location.hash = "#" + btn.dataset.ch + "/summary";
      closeSidebar();
    });

    $("#searchInput").addEventListener("input", function (e) {
      searchKeyword = e.target.value;
      renderSidebar();
    });

    $("#page").addEventListener("click", onPageClick);

    $("#themeBtn").addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      writeState();
      applyTheme();
    });

    $("#examBtn").addEventListener("click", function () { location.hash = "exam"; });
    $("#resetBtn").addEventListener("click", resetAll);
    $("#menuBtn").addEventListener("click", openSidebar);
    $("#backdrop").addEventListener("click", closeSidebar);

    /* 草稿本：内容自动保存在本地 */
    var area = $("#notepadArea");
    var timer = null;
    area.value = state.notes || "";
    function saveNotes() {
      state.notes = area.value;
      writeState();
    }
    area.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(saveNotes, 400);
    });
    $("#notepadToggle").addEventListener("click", function () {
      var box = $("#notepad");
      box.hidden = !box.hidden;
      if (!box.hidden) area.focus();
    });
    $("#notepadClose").addEventListener("click", function () { $("#notepad").hidden = true; });
    $("#notepadCopy").addEventListener("click", function () { copyText(area.value); });
    $("#notepadClear").addEventListener("click", function () {
      if (!area.value || window.confirm("清空草稿本内容？")) {
        area.value = "";
        saveNotes();
        toast("草稿本已清空");
      }
    });

    window.addEventListener("hashchange", route);
  }

  function init() {
    applyTheme();
    wireEvents();
    if (!location.hash) location.hash = "#" + lastVisited() + "/summary";
    route();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
