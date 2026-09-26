/* 附录：速查表 + 综合题库（examExtra 用于「综合测试」抽题） */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

window.COURSE.examExtra = [
  {
    q: "表达式 7 / 2 * 2 的值是？",
    opts: ["7", "6", "7.0", "3"],
    answer: 1,
    explain: "先算 7 / 2 = 3（整数除法截断），再算 3 * 2 = 6。"
  },
  {
    q: "for (int i = 0; i <= 5; i += 2) 的循环体执行几次？",
    opts: ["2 次", "3 次", "4 次", "5 次"],
    answer: 1,
    explain: "i 依次取 0、2、4，共 3 次；下一次 i = 6 时条件不成立。"
  },
  {
    q: "int a[3] = {1, 2, 3}; 则 *(a + 1) 的值是？",
    opts: ["1", "2", "3", "a[1] 的地址"],
    answer: 1,
    explain: "*(a + i) 等价于 a[i]，所以 *(a + 1) 就是 2。"
  },
  {
    q: '函数声明 int f(void); 表示？',
    opts: ["接收任意参数", "不接收参数，返回 int", "返回 void", "参数为 1 个 void 变量"],
    answer: 1,
    explain: "(void) 明确表示不接收参数，与旧式的 int f() 含义不同。"
  },
  {
    q: '字符串 "abc" 在内存中占用的字节数是？',
    opts: ["3", "4", "6", "不确定"],
    answer: 1,
    explain: "3 个字符加上结尾的 '\\0' 共 4 字节。"
  },
  {
    q: "switch 语句中，case 后面必须是什么？",
    opts: ["变量", "整型常量表达式", "浮点数", "任意表达式"],
    answer: 1,
    explain: "case 后必须是编译期可确定的整型/字符常量，不能是变量或浮点数。"
  }
];

COURSE.chapters.push({
  id: "appendix",
  group: "附录",
  level: "速查",
  emoji: "📌",
  title: "速查表：类型、格式符、报错、命令",
  lead: "写代码时最常回头查的东西都在这里：占位符、优先级、gcc 命令、报错含义、学习路线。",
  tags: ["速查", "报错对照", "gcc"],
  minutes: 15,
  summary: `
<h2>1. 数据类型与格式化对照表</h2>
<table>
  <tr><th>类型</th><th>字节</th><th>范围 / 精度</th><th>printf</th><th>scanf</th></tr>
  <tr><td><code>char</code></td><td>1</td><td>-128 ~ 127（或字符）</td><td>%c</td><td>%c</td></tr>
  <tr><td><code>short</code></td><td>2</td><td>-32768 ~ 32767</td><td>%hd</td><td>%hd</td></tr>
  <tr><td><code>int</code></td><td>4</td><td>约 ±21 亿</td><td>%d</td><td>%d</td></tr>
  <tr><td><code>unsigned int</code></td><td>4</td><td>0 ~ 约 42 亿</td><td>%u</td><td>%u</td></tr>
  <tr><td><code>long long</code></td><td>8</td><td>约 ±9.2 × 10^18</td><td>%lld</td><td>%lld</td></tr>
  <tr><td><code>float</code></td><td>4</td><td>约 7 位有效数字</td><td>%f</td><td>%f</td></tr>
  <tr><td><code>double</code></td><td>8</td><td>约 15 位有效数字</td><td>%f</td><td><strong>%lf</strong>（易错！）</td></tr>
</table>
<p>宽度与精度：<code>%5d</code> 宽 5 右对齐、<code>%-5d</code> 左对齐、<code>%05d</code> 前补零、<code>%.2f</code> 保留 2 位小数、<code>%8.3f</code> 宽 8 且 3 位小数、<code>%s</code> 字符串、<code>%p</code> 地址、<code>%%</code> 百分号本身。</p>

<h2>2. 转义字符</h2>
<table>
  <tr><th>写法</th><th>含义</th><th>写法</th><th>含义</th></tr>
  <tr><td><code>\\n</code></td><td>换行</td><td><code>\\t</code></td><td>制表符</td></tr>
  <tr><td><code>\\\\</code></td><td>反斜杠本身</td><td><code>\\"</code></td><td>双引号</td></tr>
  <tr><td><code>\\'</code></td><td>单引号</td><td><code>\\0</code></td><td>空字符（字符串结束标志）</td></tr>
</table>

<h2>3. 运算符优先级（常用，由高到低）</h2>
<table>
  <tr><td>1</td><td><code>()</code> <code>[]</code> <code>-&gt;</code> <code>.</code></td></tr>
  <tr><td>2</td><td><code>!</code> <code>~</code> <code>++</code> <code>--</code> <code>(类型)</code> <code>*</code> <code>&amp;</code> <code>sizeof</code></td></tr>
  <tr><td>3</td><td><code>*</code> <code>/</code> <code>%</code></td></tr>
  <tr><td>4</td><td><code>+</code> <code>-</code></td></tr>
  <tr><td>5</td><td><code>&lt;&lt;</code> <code>&gt;&gt;</code></td></tr>
  <tr><td>6</td><td><code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code></td></tr>
  <tr><td>7</td><td><code>==</code> <code>!=</code></td></tr>
  <tr><td>8</td><td><code>&amp;</code> → <code>^</code> → <code>|</code>（位运算）</td></tr>
  <tr><td>9</td><td><code>&amp;&amp;</code> → <code>||</code></td></tr>
  <tr><td>10</td><td><code>? :</code>、赋值运算符（<code>= += -=</code> …）</td></tr>
</table>

<h2>4. gcc 常用命令</h2>
<pre>gcc main.c -o app                 编译成 app
gcc -Wall -Wextra main.c -o app   打开所有警告（强烈推荐）
gcc -g main.c -o app              带调试信息，配合 gdb
gcc main.c utils.c -o app         多个源文件一起编译
gcc main.c -lm -o app             用到 math.h 时链接数学库</pre>

<h2>5. 常见报错速查表</h2>
<table>
  <tr><th>报错 / 现象</th><th>常见原因</th></tr>
  <tr><td>expected ';' before '}' token</td><td>上一行漏了分号</td></tr>
  <tr><td>stray '\\241' in program</td><td>代码里混进了中文标点或全角空格</td></tr>
  <tr><td>undefined reference to 'main'</td><td>main 拼写错误，或源文件没有 main 函数</td></tr>
  <tr><td>implicit declaration of function 'printf'</td><td>忘记 <code>#include &lt;stdio.h&gt;</code></td></tr>
  <tr><td>'x' undeclared / unused variable</td><td>变量未声明、拼错，或声明了没用</td></tr>
  <tr><td>format '%d' expects 'int' but argument has 'double'</td><td>占位符与类型不匹配，输出会变成垃圾值</td></tr>
  <tr><td>expected declaration or statement at end of input</td><td>大括号不配对，通常是少了 <code>}</code></td></tr>
  <tr><td>undefined reference to 'sqrt'</td><td>用了 math.h，编译时要加 <code>-lm</code></td></tr>
  <tr><td>Segmentation fault（段错误）</td><td>野指针、解引用 NULL、数组越界、scanf 忘 &amp;</td></tr>
  <tr><td>输出的中文是乱码</td><td>源文件不是 UTF-8；Windows 控制台可试 <code>chcp 65001</code></td></tr>
  <tr><td>程序窗口一闪而过</td><td>程序正常结束了，用 IDE 的「运行」或在末尾加 <code>getchar();</code></td></tr>
</table>

<h2>6. 常用标准库一览</h2>
<table>
  <tr><th>头文件</th><th>常用函数</th></tr>
  <tr><td><code>stdio.h</code></td><td>printf scanf puts fgets fopen fclose fprintf fscanf fgetc fputc</td></tr>
  <tr><td><code>string.h</code></td><td>strlen strcpy strncpy strcat strcmp strchr strstr strtok memset</td></tr>
  <tr><td><code>math.h</code></td><td>sqrt pow fabs ceil floor（编译加 -lm）</td></tr>
  <tr><td><code>stdlib.h</code></td><td>malloc free exit atoi atof rand srand qsort</td></tr>
  <tr><td><code>ctype.h</code></td><td>isalpha isdigit isspace toupper tolower</td></tr>
  <tr><td><code>time.h</code></td><td>time clock（做随机数种子、计时）</td></tr>
</table>

<h2>7. 后面该学什么</h2>
<ol>
  <li><strong>动态内存</strong>：<code>malloc / free</code>，运行时决定数组大小（学链表的前提）。</li>
  <li><strong>数据结构</strong>：链表、栈、队列、二叉树，用 C 手动实现一遍。</li>
  <li><strong>工程化</strong>：多文件 + 头文件 + Makefile，用 git 管理代码。</li>
  <li><strong>算法训练</strong>：排序、查找、递推、贪心、动态规划，配合在线判题网站刷题。</li>
</ol>
<p>建议节奏：前 6 章每天 1 小时过语法，第 7~9 章花时间动手写，最后完成第 12 章的项目。能独立写完「学生成绩管理系统」，C 语言基础就算过关了。</p>
`,
  examples: [],
  practice: [],
  quiz: [
    {
      q: "下列哪一个不是 C 语言的关键字？",
      opts: ["return", "main", "static", "const"],
      answer: 1,
      explain: "main 只是约定俗成的入口函数名，不是关键字，你甚至可以定义别的函数叫 main。"
    },
    {
      q: "int 类型（4 字节，有符号）能直接存放 30 亿这个数吗？",
      opts: ["可以", "不可以，会溢出得到错误结果", "可以，编译器会自动扩容", "取决于变量名"],
      answer: 1,
      explain: "4 字节 int 最大约 21 亿，30 亿会溢出。应改用 long long 或 unsigned int。"
    },
    {
      q: "编译时提示 implicit declaration of function 'printf'，原因是？",
      opts: [
        "printf 拼写错误",
        "忘记 #include <stdio.h>",
        "缺少 return 0;",
        "main 函数写错了"
      ],
      answer: 1,
      explain: "printf 的声明在 stdio.h 中，没包含头文件时编译器只能「猜测」函数原型。"
    },
    {
      q: "程序编译通过但运行时报 Segmentation fault，最可能的原因是？",
      opts: [
        "循环次数太多",
        "指针问题：野指针、空指针解引用、数组越界、scanf 漏写 &",
        "printf 里中文太多",
        "没有写注释"
      ],
      answer: 1,
      explain: "段错误基本都来自非法内存访问，优先检查指针、数组下标和 scanf 的 &。"
    },
    {
      q: "代码里用了 sqrt，编译时报 undefined reference to 'sqrt'，正确的解决办法是？",
      opts: [
        "把 sqrt 改成 pow",
        "编译命令加上 -lm 链接数学库",
        "删除 #include <math.h>",
        "把 double 改成 float"
      ],
      answer: 1,
      explain: "数学库需要显式链接：gcc main.c -lm -o app（注意 -lm 要放在源文件之后）。"
    }
  ]
});
