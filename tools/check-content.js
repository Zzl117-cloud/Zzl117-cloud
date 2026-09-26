/**
 * 课程内容自检脚本
 * 用法：node tools/check-content.js
 *
 * 校验 js/ch*.js 中每个章节的数据结构是否完整：
 *   - 章节：id / 标题 / 难度 / 知识总结
 *   - 示例：文件名 + 代码
 *   - 练习：题目 + 提示 + 参考答案
 *   - 测试：题干 + 选项 + 正确选项下标 + 解析
 * 有问题的条目会打印行号级别的提示，全部通过则输出统计信息并以 0 退出。
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const jsDir = path.join(__dirname, "..", "js");
const files = fs.readdirSync(jsDir).filter((f) => /^ch\d+.*\.js$/i.test(f)).sort();
const problems = [];

/* ---------- 1. 在沙箱里加载所有课程文件 ---------- */
/* 浏览器里 window 就是全局对象，这里把沙箱的全局对象同时当作 window，
   这样课程文件里的 window.COURSE 和裸写的 COURSE 都能正确解析。 */
const ctx = {};
vm.createContext(ctx);
ctx.window = ctx;

files.forEach((file) => {
  try {
    vm.runInContext(fs.readFileSync(path.join(jsDir, file), "utf8"), ctx, { filename: file });
  } catch (err) {
    problems.push(`${file} 无法执行（语法错误？）：${err.message}`);
  }
});

const COURSE = ctx.COURSE;
if (!COURSE || !Array.isArray(COURSE.chapters) || !COURSE.chapters.length) {
  console.error("✗ 没有取到 window.COURSE.chapters，请检查课程文件。");
  problems.forEach((p) => console.error("  ✗ " + p));
  process.exit(1);
}

/* ---------- 2. 断言小工具 ---------- */
function check(cond, msg) {
  if (!cond) problems.push(msg);
  return !!cond;
}

/* ---------- 3. 逐项校验 ---------- */
let quizTotal = 0, exampleTotal = 0, practiceTotal = 0, summaryChars = 0;
const seenIds = new Set();

COURSE.chapters.forEach((c, i) => {
  const tag = `第 ${i + 1} 个章节（${c && c.id ? c.id : "缺少 id"}）`;

  if (!check(c && typeof c === "object", `${tag}：不是一个对象`)) return;
  check(!!c.id, `${tag}：缺少 id`);
  if (c.id && seenIds.has(c.id)) problems.push(`${tag}：id 重复（${c.id}）`);
  seenIds.add(c.id);

  check(!!c.title, `${tag}：缺少 title`);
  check(!!c.lead, `${c.id}：缺少 lead（导语）`);
  check(!!c.level, `${c.id}：缺少 level（难度）`);
  check(!!c.group, `${c.id}：缺少 group（所属阶段）`);
  check(!!c.tags && Array.isArray(c.tags) && c.tags.length > 0, `${c.id}：缺少 tags`);

  const sum = c.summary || "";
  summaryChars += sum.length;
  check(sum.length >= 200, `${c.id}：summary 太短（${sum.length} 字），可能没写完`);
  check(!/<p>[\s\u00a0]*<\/p>/.test(sum), `${c.id}：summary 里疑似有空段落`);
  check(!/\*\*[^*]+\*\*/.test(sum), `${c.id}：summary 里出现了 Markdown 的 ** 粗体，HTML 中请用 <strong>`);

  /* 示例 */
  check(Array.isArray(c.examples), `${c.id}：examples 必须是数组`);
  (c.examples || []).forEach((ex, k) => {
    exampleTotal++;
    check(!!ex.name, `${c.id} 示例 ${k + 1}：缺少 name`);
    check((ex.code || "").length > 20, `${c.id} 示例 ${k + 1}：代码内容过短`);
    check(/main\s*\(/.test(ex.code || "") || k > 0 || c.id === "ch13" || c.id === "appendix",
      `${c.id} 示例 ${k + 1}：代码里没有看到 main 函数，确认是否完整`);
  });

  /* 练习 */
  check(Array.isArray(c.practice), `${c.id}：practice 必须是数组`);
  (c.practice || []).forEach((p, k) => {
    practiceTotal++;
    check(!!p.title, `${c.id} 练习 ${k + 1}：缺少 title`);
    check(!!p.req, `${c.id} 练习 ${k + 1}：缺少 req（题目要求）`);
    check(Array.isArray(p.hint) && p.hint.length >= 1, `${c.id} 练习 ${k + 1}：缺少 hint（至少 1 条提示）`);
    check((p.solution || "").length > 20, `${c.id} 练习 ${k + 1}：缺少 solution（参考答案）`);
  });

  /* 测试题 */
  check(Array.isArray(c.quiz), `${c.id}：quiz 必须是数组`);
  (c.quiz || []).forEach((q, k) => {
    quizTotal++;
    const qt = `${c.id} 测试 ${k + 1}`;
    check(!!q.q, `${qt}：缺少题干 q`);
    check(Array.isArray(q.opts) && q.opts.length >= 2, `${qt}：选项至少 2 个`);
    check(Number.isInteger(q.answer), `${qt}：answer 必须是整数`);
    if (Array.isArray(q.opts) && Number.isInteger(q.answer)) {
      check(q.answer >= 0 && q.answer < q.opts.length, `${qt}：answer=${q.answer} 超出选项范围`);
    }
    check(!!q.explain, `${qt}：缺少 explain（答案解析）`);
    const dup = new Set(q.opts || []);
    check(dup.size === (q.opts || []).length, `${qt}：存在重复选项`);
  });
});

/* 综合测试题库 */
(COURSE.examExtra || []).forEach((q, k) => {
  quizTotal++;
  const qt = `综合题库 第 ${k + 1} 题`;
  check(!!q.q, `${qt}：缺少题干`);
  check(Array.isArray(q.opts) && q.opts.length >= 2, `${qt}：选项至少 2 个`);
  check(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < (q.opts || []).length,
    `${qt}：answer 不合法`);
  check(!!q.explain, `${qt}：缺少解析`);
});

/* ---------- 4. 输出报告 ---------- */
console.log("=== C 语言阶梯课堂 · 内容自检 ===");
console.log(`课程文件：${files.length} 个（${files.join(", ")}）`);
console.log(`章节数量：${COURSE.chapters.length} 章`);
console.log(`代码示例：${exampleTotal} 段`);
console.log(`动手练习：${practiceTotal} 题`);
console.log(`测试题目：${quizTotal} 题（含综合题库 ${(COURSE.examExtra || []).length} 题）`);
console.log(`知识总结：共 ${summaryChars} 字`);

if (problems.length) {
  console.log(`\n发现 ${problems.length} 个问题：`);
  problems.forEach((p) => console.log("  ✗ " + p));
  process.exit(1);
}
console.log("\n✓ 全部内容检查通过。");
