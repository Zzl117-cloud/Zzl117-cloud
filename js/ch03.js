/* 第 3 章：运算符与表达式 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch3",
  group: "第一阶段 · 熟悉环境",
  level: "入门",
  emoji: "➗",
  title: "运算符与表达式",
  lead: "同样是 1 + 2，在 C 里也可能得到意想不到的结果，先认清运算符的优先级和陷阱。",
  tags: ["算术运算", "逻辑运算", "自增自减", "优先级"],
  minutes: 30,
  summary: `
<h2>1. 算术运算符</h2>
<table>
  <tr><th>运算符</th><th>含义</th><th>示例</th><th>结果</th></tr>
  <tr><td>+  -  *  /</td><td>加 减 乘 除</td><td>7 / 2</td><td>3（整数除法）</td></tr>
  <tr><td>%</td><td>取余，只能用于整数</td><td>7 % 2</td><td>1</td></tr>
</table>
<p>取余很实用：<code>x % 2 == 0</code> 判断偶数，<code>x % 10</code> 取个位，<code>x / 10</code> 去掉个位。</p>
<div class="callout warn"><span class="ico">⚠️</span><div class="body"><p><code>%</code> 不能用于 float / double，要对小数取余得用 <code>fmod</code> 函数。</p></div></div>

<h2>2. 关系运算符与逻辑运算符</h2>
<ul>
  <li>关系：<code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code> <code>==</code>（等于）<code>!=</code>（不等于），结果是 <code>1</code> 真或 <code>0</code> 假。</li>
  <li>逻辑：<code>&amp;&amp;</code> 与（两边都真才真）、<code>||</code> 或（一边真就真）、<code>!</code> 非（取反）。</li>
  <li><strong>短路求值</strong>：<code>a &amp;&amp; b</code> 中若 a 为假，b 不执行；<code>a || b</code> 中若 a 为真，b 不执行。写 <code>if (p != NULL &amp;&amp; *p &gt; 0)</code> 防止空指针解引用，就是利用这一点。</li>
</ul>
<p>常见错误：<code>a &gt; b &gt; c</code> <strong>不是</strong>数学上的连续比较，它会先算 <code>(a &gt; b)</code> 得到 0 或 1，再拿这个结果和 c 比较。</p>

<h2>3. 赋值与复合赋值</h2>
<pre>sum = sum + 5;  ==&gt;  sum += 5;
x = x * 2;      ==&gt;  x *= 2;      x = x % 3;  ==&gt;  x %= 3;</pre>

<h2>4. 自增自减：++ 和 --</h2>
<pre>i++;   // 后置：先取值，再加 1
++i;   // 前置：先加 1，再取值
int i = 1;
int a = i++;   // a = 1, i = 2
int b = ++i;   // b = 3, i = 3
单独作为一条语句时两者没区别，混在表达式里才不同。</pre>
<div class="callout danger"><span class="ico">🚫</span><div class="body"><p>不要在同一条语句里对同一变量多次自增（如 <code>i = i++ + i++;</code>），这是<strong>未定义行为</strong>，不同编译器结果不同。</p></div></div>

<h2>5. 条件运算符（三目运算）</h2>
<pre>max = (a &gt; b) ? a : b;
printf("%s\n", (n % 2 == 0) ? "偶数" : "奇数");</pre>

<h2>6. 优先级速记（由高到低）</h2>
<table>
  <tr><th>顺序</th><th>运算符</th></tr>
  <tr><td>1</td><td><code>()</code> <code>[]</code> <code>!</code> <code>++</code> <code>--</code> <code>(类型)</code> <code>*</code> <code>&amp;</code></td></tr>
  <tr><td>2</td><td><code>*</code> <code>/</code> <code>%</code></td></tr>
  <tr><td>3</td><td><code>+</code> <code>-</code></td></tr>
  <tr><td>4</td><td><code>&lt;</code> <code>&lt;=</code> <code>&gt;</code> <code>&gt;=</code>，然后 <code>==</code> <code>!=</code></td></tr>
  <tr><td>5</td><td><code>&amp;&amp;</code> 然后 <code>||</code></td></tr>
  <tr><td>6</td><td><code>? :</code> 与各种赋值运算符</td></tr>
</table>
<div class="callout tip"><span class="ico">✅</span><div class="body"><p>看不清优先级就<strong>加括号</strong>。括号不花钱，可读性最值钱：<code>if ((a &amp;&amp; b) || c)</code> 比 <code>if (a &amp;&amp; b || c)</code> 清楚得多。</p></div></div>
`,
  examples: [
    {
      name: "mod.c",
      note: "取余的经典用法：拆分整数的各位数字、判断奇偶。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int total = 3725;                        /* 总秒数 */
    int h = total / 3600;
    int m = (total % 3600) / 60;
    int s = total % 60;

    printf("%d 秒 = %d 小时 %d 分 %d 秒\n", total, h, m, s);

    int n = 47;
    printf("%d 是 %s\n", n, (n % 2 == 0) ? "偶数" : "奇数");
    printf("个位=%d, 十位=%d, 两位之和=%d\n",
           n % 10, n / 10, n % 10 + n / 10);
    return 0;
}`,
      output: "3725 秒 = 1 小时 2 分 5 秒\n47 是 奇数\n个位=7, 十位=4, 两位之和=11"
    },
    {
      name: "increment.c",
      note: "前置与后置的区别，以及短路求值的实际效果。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int i = 1;
    int a = i++;      /* 先取 1 赋给 a，再让 i 变 2 */
    int b = ++i;      /* i 先变 3，再取 3 赋给 b */

    printf("i=%d, a=%d, b=%d\n", i, a, b);

    int x = 0, y = 5;
    if (x != 0 && y / x > 1)   /* 左边为假，右边不执行，因此不会除零 */
        printf("不会走到这里\n");
    printf("短路求值保护了程序, y = %d\n", y);
    return 0;
}`,
      output: "i=3, a=1, b=3\n短路求值保护了程序, y = 5"
    }
  ],
  practice: [
    {
      title: "把三位数反转并求各位数字之和",
      req: "<p>给定 <code>n = 583</code>，输出个、十、百位，反转后的数，以及各位数字之和。</p>",
      hint: [
        "个位 = n % 10，十位 = n / 10 % 10，百位 = n / 100。",
        "反转 = 个位 * 100 + 十位 * 10 + 百位。"
      ],
      sample: "n=583\n个位=3 十位=8 百位=5\n反转后=385\n各位之和=16",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int n = 583;
    int ge  = n % 10;
    int shi = n / 10 % 10;
    int bai = n / 100;

    printf("n=%d\n", n);
    printf("个位=%d 十位=%d 百位=%d\n", ge, shi, bai);
    printf("反转后=%d\n", ge * 100 + shi * 10 + bai);
    printf("各位之和=%d\n", ge + shi + bai);
    return 0;
}`,
      solutionNote: "想加难度就试试四位数，思路完全相同。第 6 章学了循环后，用 <code>while (n &gt; 0)</code> 拆位会更通用。"
    },
    {
      title: "用条件运算符求三个数的最大值",
      req: "<p>已知 <code>a = 12</code>、<code>b = 45</code>、<code>c = 30</code>，用条件运算符求出最大值并输出。</p>",
      hint: ["先求 a、b 的较大者，再拿它和 c 比较。", "分两步写的可读性远好于在一行里嵌套两个三目运算符。"],
      sample: "最大值是 45",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int a = 12, b = 45, c = 30;

    int max = (a > b) ? a : b;
    max = (max > c) ? max : c;

    printf("最大值是 %d\n", max);
    return 0;
}`,
      solutionNote: "学完第 5 章 if 语句后，你更可能用嵌套 if 来解决「三个数排序」这类问题。"
    }
  ],
  quiz: [
    {
      q: "表达式 10 % 3 和 10 / 3 的值分别是？",
      opts: ["3 和 1", "1 和 3", "3.33 和 3", "0 和 3"],
      answer: 1,
      explain: "% 是取余得 1；两边都是整数时 / 做整数除法得 3，小数部分被截断。"
    },
    {
      q: "int i = 5; int a = i++; 执行后 a 和 i 的值是？",
      opts: ["a=6, i=6", "a=5, i=6", "a=5, i=5", "a=6, i=5"],
      answer: 1,
      explain: "后置 ++ 先把旧值 5 赋给 a，再让 i 变成 6。若写成 ++i，则 a=6, i=6。"
    },
    {
      q: "关于 if (x != 0 && y / x > 1)，说法正确的是？",
      opts: [
        "x 为 0 时程序会因除零而崩溃",
        "&& 有短路求值特性，x 为 0 时右边不执行，因此不会除零",
        "&& 两边总会全部求值",
        "应该改成 & 才能短路"
      ],
      answer: 1,
      explain: "&& 短路：左边为假就不计算右边，常被用来做安全检查。"
    },
    {
      q: "a=5, b=3, c=1 时，表达式 a > b > c 的结果是？",
      opts: ["1", "0", "语法错误", "不确定"],
      answer: 1,
      explain: "先算 a > b 得 1，再算 1 > c 即 1 > 1 得 0。连续比较要写成 a > b && b > c。"
    },
    {
      q: "判断「n 是偶数」的正确条件是？",
      opts: ["n % 2 = 0", "n / 2 == 0", "n % 2 == 0", "n % 2 != 1"],
      answer: 2,
      explain: "判等要用 ==；写成 n % 2 = 0 会被当成给表达式赋值，是编译错误。"
    }
  ]
});
