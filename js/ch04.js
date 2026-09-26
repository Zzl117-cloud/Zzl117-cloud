/* 第 4 章：输入输出与格式化 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch4",
  group: "第二阶段 · 掌握基本语句",
  level: "基础",
  emoji: "⌨️",
  title: "输入输出与格式化",
  lead: "让程序不再是「独角戏」：学会读键盘输入、把结果排得整整齐齐。",
  tags: ["printf", "scanf", "转义字符"],
  minutes: 30,
  summary: `
<h2>1. printf：把数据变成文字</h2>
<p>格式串里的 <strong>占位符</strong>决定怎么解释后面那个变量，用错占位符是最常见的诡异 bug：</p>
<table>
  <tr><th>占位符</th><th>用于</th><th>示例</th></tr>
  <tr><td>%d</td><td>int</td><td>printf("%d", 42)</td></tr>
  <tr><td>%f</td><td>float / double（printf 中通用）</td><td>printf("%.2f", 3.14159)</td></tr>
  <tr><td>%c</td><td>char</td><td>printf("%c", 'A')</td></tr>
  <tr><td>%s</td><td>字符串</td><td>printf("%s", "hi")</td></tr>
  <tr><td>%%</td><td>输出一个 % 本身</td><td>printf("100%%")</td></tr>
  <tr><td>%u / %ld / %lld</td><td>unsigned / long / long long</td><td>printf("%lld", 123456789012LL)</td></tr>
</table>
<p><strong>宽度与精度</strong>能让输出对齐，做表格特别有用：</p>
<pre>printf("[%d][%5d][%-5d][%05d]\n", 42, 42, 42, 42);
// [42][   42][42   ][00042]
printf("%.2f  %8.3f\n", 3.14159, 3.14159);
// 3.14     3.142</pre>
<p>记忆方法：<code>%5d</code> 表示总宽 5、右对齐；加负号 <code>%-5d</code> 变左对齐；<code>%05d</code> 左边补 0；<code>%.2f</code> 是保留 2 位小数（会四舍五入）。</p>

<h2>2. scanf：从键盘读数据</h2>
<pre>int n;  double d;  char c;
scanf("%d", &n);          /* & 取地址运算符，必须写 */
scanf("%lf", &d);         /* 读 double 必须用 %lf */
scanf("%d %d", &a, &b);   /* 一次读两个数，用空格/回车分隔 */
scanf(" %c", &c);         /* %c 前的空格能跳过之前残留的换行/空格 */</pre>
<p><code>scanf</code> 的返回值是<strong>成功读入的变量个数</strong>，可以用来校验输入：</p>
<pre>if (scanf("%d", &n) != 1) {
    printf("输入的不是整数！\n");
    return 1;
}</pre>
<div class="callout danger"><span class="ico">🚫</span><div class="body">
<ul>
  <li><strong>忘记 &amp;</strong>：<code>scanf("%d", n)</code> 会把 n 的值当地址用，通常直接崩溃。注意读字符串（字符数组）时<strong>不要</strong>加 &amp;。</li>
  <li><strong>double 用了 %f</strong>：读进来的数据是错的（%f 只适用于 float）。</li>
  <li><strong>%c 读到回车</strong>：先前的输入会留下换行符，写成 <code>" %c"</code> 加个空格即可。</li>
  <li><strong>格式串里乱加提示文字</strong>：<code>scanf("请输入%d", &amp;n)</code> 会让程序等待你输入「请输入」这几个字。</li>
</ul></div></div>

<h2>3. 转义字符表</h2>
<table>
  <tr><th>写法</th><th>含义</th></tr>
  <tr><td>\\n</td><td>换行</td></tr>
  <tr><td>\\t</td><td>制表符（可用于对齐）</td></tr>
  <tr><td>\\\\</td><td>一个反斜杠</td></tr>
  <tr><td>\\"  \\'</td><td>双引号 / 单引号本身</td></tr>
  <tr><td>\\0</td><td>空字符，字符串结束标志（第 10 章重点）</td></tr>
</table>

<h2>4. 一次读写一个字符：getchar / putchar</h2>
<pre>char ch = getchar();   /* 从键盘读一个字符 */
putchar(ch);           /* 输出一个字符 */</pre>
`,
  examples: [
    {
      name: "sum.c",
      note: "最简单的交互：读两个整数，输出四则运算结果。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int a, b;

    printf("请输入两个整数（用空格分隔）: ");
    scanf("%d %d", &a, &b);          /* 两个 & 都不能少 */

    printf("%d + %d = %d\n", a, b, a + b);
    printf("%d - %d = %d\n", a, b, a - b);
    printf("%d * %d = %d\n", a, b, a * b);
    printf("%d / %d = %d （整数除法）\n", a, b, a / b);
    return 0;
}`,
      output: "请输入两个整数（用空格分隔）: 7 3\n7 + 3 = 10\n7 - 3 = 4\n7 * 3 = 21\n7 / 3 = 2 （整数除法）"
    },
    {
      name: "scanf_trap.c",
      note: "演示 %c 与换行残留的坑、输入校验，以及宽度/精度格式化。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int n;
    char c;

    printf("输入一个整数: ");
    if (scanf("%d", &n) != 1) {          /* 返回值 = 成功读入的个数 */
        printf("输入的不是整数！\n");
        return 1;
    }
    printf("读到整数 %d\n", n);

    printf("输入一个字符: ");
    scanf(" %c", &c);                    /* 开头的空格：跳过残留的换行 */
    printf("读到字符 [%c]\n", c);

    printf("对齐实验: [%5d][%-5d][%05d][%.3f]\n",
           n, n, n, n / 3.0);
    return 0;
}`,
      output: "输入一个整数: 7\n读到整数 7\n输入一个字符: A\n读到字符 [A]\n对齐实验: [    7][7    ][00007][2.333]"
    }
  ],
  practice: [
    {
      title: "求矩形的面积与周长",
      req: "<p>从键盘读入长和宽（可能是小数），输出面积与周长，各保留 2 位小数。</p>",
      hint: [
        "周长 = 2 * (长 + 宽)，面积 = 长 * 宽。",
        "读 double 用 %lf，输出用 %.2f。"
      ],
      sample: "输入 3.5 2\n面积=7.00 周长=11.00",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    double w, h;

    printf("请输入长和宽: ");
    scanf("%lf %lf", &w, &h);

    printf("面积=%.2f 周长=%.2f\n", w * h, 2 * (w + h));
    return 0;
}`,
      solutionNote: "试着把 <code>%lf</code> 改成 <code>%f</code> 看看会输出什么——这就是占位符不匹配的代价。"
    },
    {
      title: "秒数换算成时分秒（改为键盘输入）",
      req: "<p>读入一个整数秒数，输出「x 小时 x 分 x 秒」。</p>",
      hint: [
        "小时 = 总秒数 / 3600，分钟 = 剩余秒数 / 60，秒 = 总秒数 % 60。",
        "剩余秒数 = 总秒数 % 3600。"
      ],
      sample: "输入 3725\n3725 秒 = 1 小时 2 分 5 秒",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int total;

    printf("请输入秒数: ");
    scanf("%d", &total);

    printf("%d 秒 = %d 小时 %d 分 %d 秒\n",
           total, total / 3600, total % 3600 / 60, total % 60);
    return 0;
}`,
      solutionNote: "注意 <code>total % 3600 / 60</code> 的运算顺序：<code>%</code> 和 <code>/</code> 同级，从左到右计算，正好等价于 (total % 3600) / 60。写括号更清楚。"
    }
  ],
  quiz: [
    {
      q: "从键盘读入 int 变量 n，正确的写法是？",
      opts: ['scanf("%d", &n);', 'scanf("%d", n);', 'scanf(&n, "%d");', 'n = scanf("%d");'],
      answer: 0,
      explain: "scanf 需要变量的地址，所以必须加 &。少了它会崩溃或写入错误的内存。"
    },
    {
      q: "用 scanf 读入 double 变量应使用哪个占位符？",
      opts: ["%f", "%lf", "%d", "%g 都可以"],
      answer: 1,
      explain: "scanf 中读 double 必须用 %lf；printf 中输出 double 用 %f 或 %lf 都可以。"
    },
    {
      q: 'printf("[%5.2f]", 3.14159); 的输出是？',
      opts: ["[3.14]", "[ 3.14]", "[3.14159]", "[03.14]"],
      answer: 1,
      explain: "5.2 表示总宽度 5、保留 2 位小数，3.14 占 4 个字符，右对齐补一个空格。"
    },
    {
      q: "要在屏幕上输出一个百分号 %，应该写？",
      opts: ['printf("%");', 'printf("%%");', 'printf("\\%");', 'printf("percent");'],
      answer: 1,
      explain: "% 在格式串中是占位符起始符，输出它本身要写两个 %% 。"
    },
    {
      q: "输入整数后马上用 scanf(\"%c\", &c) 读字符，却发现读到的是回车，正确的修正方式是？",
      opts: [
        'scanf(" %c", &c);   /* %c 前加一个空格 */',
        'scanf("%c ", &c);   /* 后面加空格 */',
        "改用 printf 读",
        "把 c 声明为 int"
      ],
      answer: 0,
      explain: "%c 前的空白字符会匹配并跳过之前残留的换行或空格。"
    }
  ]
});
