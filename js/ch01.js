/* 第 1 章：认识 C 语言，写出第一个程序 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch1",
  group: "第一阶段 · 熟悉环境",
  level: "入门",
  emoji: "🚀",
  title: "认识 C 语言，写出第一个程序",
  lead: "弄清 C 代码是怎么变成可执行程序的，然后亲手跑通 Hello World。",
  tags: ["编译流程", "main 函数", "printf"],
  minutes: 25,
  summary: `
<h2>1. C 语言是什么</h2>
<p>C 语言由 Dennis Ritchie 于 1972 年在贝尔实验室发明，最初用于编写 UNIX 操作系统。它既有高级语言的结构化语法，又能直接操作内存和硬件，因此至今活跃在操作系统、嵌入式、数据库、编译器等底层领域。</p>
<table>
  <tr><th>特点</th><th>说明</th></tr>
  <tr><td>效率高</td><td>编译成机器码直接执行，几乎没有额外开销</td></tr>
  <tr><td>可移植</td><td>同一份源码换个平台重新编译即可运行</td></tr>
  <tr><td>能碰内存</td><td>指针可以操作内存地址，这是 C 的灵魂，也是最大门槛</td></tr>
  <tr><td>语法简洁</td><td>关键字只有 32 个，也意味着很多细节要自己管</td></tr>
</table>

<h2>2. 一段代码如何变成程序</h2>
<p>C 是<strong>编译型语言</strong>：代码必须编译、链接成可执行文件才能运行，分四步：</p>
<ol>
  <li><strong>预处理</strong>：处理 <code>#include</code>、<code>#define</code>，把 <code>stdio.h</code> 的内容真正展开进来。</li>
  <li><strong>编译</strong>：翻译成汇编代码并做语法检查（报错大多出现在这一步）。</li>
  <li><strong>汇编</strong>：生成机器码目标文件（<code>.o</code> / <code>.obj</code>）。</li>
  <li><strong>链接</strong>：与标准库拼在一起，生成 <code>.exe</code> 或 Linux/macOS 下的可执行文件。</li>
</ol>
<div class="callout info"><span class="ico">💡</span><div class="body"><p>一句话记住：<strong>编译把「你看得懂的代码」变成「机器看得懂的指令」</strong>，改一次代码就要重新编译一次。</p></div></div>

<h2>3. 程序骨架：这三行要背下来</h2>
<ul>
  <li><code>#include &lt;stdio.h&gt;</code>：引入标准输入输出库，<code>printf</code>、<code>scanf</code> 都来自这里。</li>
  <li><code>int main(void) { ... }</code>：<strong>程序唯一入口</strong>，执行到 <code>return 0;</code> 结束。</li>
  <li><code>return 0;</code>：把 0 返回给操作系统，表示正常结束。</li>
</ul>
<p>编译运行只需两条命令：</p>
<pre>gcc hello.c -o hello    # 编译，生成可执行文件
./hello                 # 运行；Windows PowerShell 可写成 .\\hello 或 hello.exe</pre>

<h2>4. 新手最常见的 5 个错误</h2>
<ul>
  <li><strong>漏分号</strong>：报错常显示在下一行，看报错要<strong>往上一行看</strong>。</li>
  <li><strong>用了中文标点</strong>：<code>；""（）</code> 会引发诡异报错，必须用英文半角。</li>
  <li><strong>括号不配对</strong>：写 <code>{</code> 的同时立刻补 <code>}</code>。</li>
  <li><strong>main 写成 mian</strong>：链接时报 <em>undefined reference to main</em>。</li>
  <li><strong>忘记 #include</strong>：所有与 printf、scanf 有关的报错先检查它。</li>
</ul>
`,
  examples: [
    {
      name: "hello.c",
      note: "每个 C 程序员的第一个程序：向屏幕输出一行文字。",
      code: String.raw`#include <stdio.h>          /* 引入标准输入输出库 */

int main(void)              /* 程序入口，返回 int 型退出码 */
{
    printf("Hello, World!\n");   /* \n 表示换行 */
    return 0;               /* 0 表示程序正常结束 */
}`,
      output: "Hello, World!"
    },
    {
      name: "card.c",
      note: "注释不参与编译，是给人看的：// 单行注释，/* ... */ 多行注释。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    printf("=== 学习卡片 ===\n");        // 一行文本
    printf("姓名：%s，科目：%s\n", "小明", "C 语言");
    printf("路径：C:\code\main.c\n");     // 注意：\c 无意义，这里仅演示
    return 0;
}`,
      output: "=== 学习卡片 ===\n姓名：小明，科目：C 语言\n路径：C:\code\main.c"
    }
  ],
  practice: [
    {
      title: "输出你的自我介绍",
      req: "<p>输出三行内容：第 1 行姓名，第 2 行学号，第 3 行「我正在学习 C 语言」。</p>",
      hint: [
        "一次 printf 输出一行，末尾写 \\n 表示换行。",
        "也可以用一个 printf，中间用 \\n 分隔三行。"
      ],
      sample: "张三\n20240101\n我正在学习 C 语言",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    printf("张三\n");
    printf("20240101\n");
    printf("我正在学习 C 语言\n");
    return 0;
}`,
      solutionNote: "也可以用一条语句完成：<code>printf(\"张三\\n20240101\\n我正在学习 C 语言\\n\");</code>"
    },
    {
      title: "用星号画直角三角形",
      req: "<p>输出 3 行星号：第 1 行 1 个 <code>*</code>，第 2 行 2 个，第 3 行 3 个。</p>",
      hint: ["星号就是普通字符，直接写进字符串里。", "每行末尾别忘了 \\n。"],
      sample: "*\n**\n***",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    printf("*\n");
    printf("**\n");
    printf("***\n");
    return 0;
}`,
      solutionNote: "学完第 6 章循环后，可以用 for 输出任意行数，那种写法更「程序员」。"
    },
    {
      title: "把编译环境跑通（重要！）",
      req: "<p>在电脑或在线编译器上把 hello.c <strong>手敲一遍</strong>（不要复制），编译运行成功，并记录报错。</p>",
      hint: [
        "命令：gcc 文件名.c -o 程序名，再运行 ./程序名。",
        "提示「'gcc' 不是内部或外部命令」说明 MinGW 没加入 PATH，重启终端或电脑再试。",
        "实在装不上，先用在线编译器完成，不影响后续学习。"
      ],
      sample: "Hello, World!",
      solution: "// 本练习没有标准代码，步骤参照：\n// 1) 保存为 hello.c（编码选 UTF-8）\n// 2) 终端执行：gcc hello.c -o hello\n// 3) 执行：./hello\n// 4) 看到 Hello, World! 即成功",
      solutionNote: "能不能独立跑通编译流程，是自学 C 的第一道分水岭，请务必亲手完成。"
    }
  ],
  quiz: [
    {
      q: "C 语言源程序文件的常见后缀名是？",
      opts: [".c", ".cpp", ".py", ".txt"],
      answer: 0,
      explain: "C 源文件用 .c，C++ 才是 .cpp。"
    },
    {
      q: "一个可运行的 C 程序，有且只有一个的函数是？",
      opts: ["printf", "main", "include", "return"],
      answer: 1,
      explain: "main 是程序入口，程序从 main 的第一行开始执行。"
    },
    {
      q: "#include <stdio.h> 的主要作用是？",
      opts: [
        "告诉编译器程序从这里开始执行",
        "让程序运行变快",
        "引入 printf / scanf 等标准输入输出函数的声明",
        "定义一个名为 stdio 的变量"
      ],
      answer: 2,
      explain: "#include 是预处理指令，把 stdio.h 内容展开进来，从而获得输入输出函数的声明。"
    },
    {
      q: "printf(\"Hello\\n\"); 中的 \\n 表示？",
      opts: ["输出字母 n", "输出一个换行符", "输出一个反斜杠", "什么都不输出"],
      answer: 1,
      explain: "\\n 是转义字符，代表换行。想输出反斜杠本身要写 \\\\。"
    },
    {
      q: "把 hello.c 编译为可执行文件 hello，正确的命令是？",
      opts: ["gcc hello.c -o hello", "run hello.c", "gcc hello -o hello.c", "compile hello.c"],
      answer: 0,
      explain: "-o 后面跟输出文件名，即 gcc 源文件 -o 可执行文件。"
    }
  ]
});
