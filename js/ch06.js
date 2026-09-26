/* 第 6 章：循环结构 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch6",
  group: "第二阶段 · 掌握基本语句",
  level: "基础",
  emoji: "🔁",
  title: "循环结构：让机器替你重复",
  lead: "while、for、do-while 三种循环 + break/continue，是算法题的基础设施。",
  tags: ["while", "for", "break/continue", "嵌套循环"],
  minutes: 40,
  summary: `
<h2>1. while：条件成立就一直做</h2>
<pre>int i = 1;
while (i &lt;= 5) {
    printf("%d ", i);
    i++;              /* 千万别忘，否则死循环 */
}</pre>
<p>适用场景：<strong>知道什么时候停，但不知道要转几圈</strong>（如「读入直到输入 0」）。</p>

<h2>2. for：最常用的计数循环</h2>
<pre>for (初始化 ; 条件 ; 每轮结束后执行) {
    循环体;
}
for (int i = 1; i &lt;= 5; i++)  printf("%d ", i);   /* 1 2 3 4 5 */</pre>
<p>执行顺序：初始化 → 判断条件 → 循环体 → i++ → 再判断条件 → …直到条件为假。</p>
<p>把这三部分分开看，循环题就好做多了：</p>
<ul>
  <li>初始化：从几开始？<code>i = 1</code></li>
  <li>条件：什么时候还继续？<code>i &lt;= n</code>（等于号别丢，否则少算最后一个）</li>
  <li>步长：每次变化多少？<code>i++</code>、<code>i += 2</code>、<code>i--</code></li>
</ul>

<h2>3. do-while：至少执行一次</h2>
<pre>int n;
do {
    printf("请输入正数:");
    scanf("%d", &amp;n);
} while (n &lt;= 0);      /* 注意末尾这个分号 */</pre>
<p>先做再判断，所以循环体至少执行一次，适合「先要一次输入再校验」的场景。</p>

<h2>4. break 与 continue</h2>
<ul>
  <li><code>break</code>：<strong>立刻跳出整个循环</strong>（在 switch 中用于结束分支）。</li>
  <li><code>continue</code>：跳过本轮剩下的语句，直接进入下一轮判断。</li>
</ul>
<pre>for (int i = 1; i &lt;= 10; i++) {
    if (i == 5) break;        /* 到 5 就整体结束，只输出 1 2 3 4 */
    printf("%d ", i);
}
for (int i = 1; i &lt;= 5; i++) {
    if (i == 3) continue;     /* 跳过 3，输出 1 2 4 5 */
    printf("%d ", i);
}</pre>

<h2>5. 嵌套循环</h2>
<p>外层执行一次，内层要完整跑一轮。九九乘法表、打印图形、矩阵遍历都靠它。</p>
<pre>for (int i = 1; i &lt;= 3; i++) {        /* 行 */
    for (int j = 1; j &lt;= i; j++) {    /* 列 */
        printf("*");
    }
    printf("\n");
}</pre>
<div class="callout info"><span class="ico">💡</span><div class="body"><p><code>break</code> 只能跳出<strong>最内层</strong>循环。想一次跳出多层，可以用一个标志变量 + 外层判断，或封装成函数直接 return。</p></div></div>

<h2>6. 五个常见错误</h2>
<ol>
  <li><code>while (i &lt; 10);</code> 后面多写分号，循环体成了空语句 → 死循环。</li>
  <li>循环变量忘记更新，或更新方向写反 → 死循环。</li>
  <li>把 <code>i &lt;= n</code> 写成 <code>i &lt; n</code> → 少算一次（经典的差一错误 off-by-one）。</li>
  <li>用 <code>==</code> 比较浮点循环变量，精度问题会让循环次数不对。</li>
  <li>在循环里累加却没初始化累加变量：<code>int sum;</code> 是垃圾值，必须写 <code>int sum = 0;</code>。</li>
</ol>
`,
  examples: [
    {
      name: "loop_basic.c",
      note: "三种循环各来一个经典例子：累加、阶乘、整数翻转。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    /* 1) for：求 1+2+...+100 */
    int sum = 0;
    for (int i = 1; i <= 100; i++) {
        sum += i;
    }
    printf("1+2+...+100 = %d\n", sum);

    /* 2) while：求 5! */
    int n = 5, fact = 1, i = 1;
    while (i <= n) {
        fact *= i;
        i++;
    }
    printf("%d! = %d\n", n, fact);

    /* 3) do-while：把 1234 翻转成 4321 */
    int x = 1234, rev = 0;
    do {
        rev = rev * 10 + x % 10;   /* 取末位接到结果后面 */
        x /= 10;                   /* 去掉末位 */
    } while (x > 0);

    printf("翻转后 = %d\n", rev);
    return 0;
}`,
      output: "1+2+...+100 = 5050\n5! = 120\n翻转后 = 4321"
    },
    {
      name: "table.c",
      note: "嵌套循环：外层控制行，内层控制每行输出的列数。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    for (int i = 1; i <= 9; i++) {          /* i：被乘数，也是列数 */
        for (int j = 1; j <= i; j++) {      /* j：乘数 */
            printf("%d*%d=%-3d", j, i, i * j);
        }
        printf("\n");
    }

    /* 顺便看看 break 与 continue 的区别 */
    for (int k = 1; k <= 6; k++) {
        if (k == 3) continue;    /* 跳过 3 */
        if (k == 6) break;       /* 到 6 就结束 */
        printf("%d ", k);
    }
    printf("\n");
    return 0;
}`,
      output: "1*1=1  \n1*2=2  2*2=4  \n1*3=3  2*3=6  3*3=9  \n...\n1 2 4 5\n（完整乘法表共 9 行）"
    }
  ],
  practice: [
    {
      title: "判断一个数是不是素数",
      req: "<p>读入一个正整数 n，判断它是否为素数（只能被 1 和自身整除的大于 1 的整数）。</p>",
      hint: [
        "从 2 试到 n-1，只要有一次能整除就不是素数。",
        "优化：只需试到 sqrt(n)。用 #include <math.h> 里的 sqrt，编译时可能需要加 -lm（Linux）。",
        "别忘处理 n <= 1 的情况，它们都不是素数。"
      ],
      sample: "输入 97\n97 是素数\n输入 100\n100 不是素数",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int n, is_prime = 1;          /* 1 表示假定是素数 */

    printf("请输入正整数: ");
    scanf("%d", &n);

    if (n <= 1) {
        is_prime = 0;
    } else {
        for (int i = 2; i * i <= n; i++) {   /* i*i <= n 等价于 i <= sqrt(n)，但不必用浮点 */
            if (n % i == 0) {
                is_prime = 0;
                break;                       /* 找到一个因子就够了 */
            }
        }
    }

    printf("%d %s素数\n", n, is_prime ? "是" : "不是");
    return 0;
}`,
      solutionNote: "标志变量（flag）＋ break 是判断类题目的固定套路。追问自己：为什么 <code>i * i &lt;= n</code> 就够了？如果 i*i 会溢出怎么办？"
    },
    {
      title: "用辗转相除法求最大公约数",
      req: "<p>读入两个正整数 a、b，用辗转相除法（欧几里得算法）求它们的最大公约数，并顺便输出最小公倍数。</p>",
      hint: [
        "反复执行：r = a % b; a = b; b = r; 直到 b 为 0，此时 a 就是最大公约数。",
        "最小公倍数 = 原两数之积 / 最大公约数，所以要先保存原始值。"
      ],
      sample: "输入 24 18\n最大公约数 = 6\n最小公倍数 = 72",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int a, b, x, y, r;

    printf("请输入两个正整数: ");
    scanf("%d %d", &a, &b);

    x = a;  y = b;                 /* 保存原值，供求最小公倍数用 */

    while (b != 0) {
        r = a % b;
        a = b;
        b = r;
    }

    printf("最大公约数 = %d\n", a);
    printf("最小公倍数 = %d\n", x / a * y);   /* 先除再乘，避免溢出 */
    return 0;
}`,
      solutionNote: "写法 <code>x / a * y</code> 比 <code>x * y / a</code> 更安全，因为先做乘法更容易溢出。这是很实用的经验。"
    }
  ],
  quiz: [
    {
      q: "for (int i = 0; i < 5; i++) 的循环体一共执行几次？",
      opts: ["4 次", "5 次", "6 次", "无限次"],
      answer: 1,
      explain: "i 取 0、1、2、3、4 共 5 个值，循环体执行 5 次后 i 变成 5 时条件不成立而退出。"
    },
    {
      q: "写了 while (i < 10); 会发生什么？",
      opts: [
        "循环体执行 10 次",
        "编译报错",
        "分号使循环体成为空语句，若 i 不变则变成死循环",
        "只执行一次"
      ],
      answer: 2,
      explain: "分号是一条空语句，成为 while 的循环体；因为循环体里没有改变 i，条件永远成立，程序卡死。"
    },
    {
      q: "在循环中，break 与 continue 的区别是？",
      opts: [
        "break 结束本次循环，continue 结束整个循环",
        "break 结束整个循环，continue 只结束本次循环的剩余语句",
        "两者完全相同",
        "continue 只能用于 for，break 只能用于 while"
      ],
      answer: 1,
      explain: "break 直接跳出循环；continue 跳到下一轮的条件判断。"
    },
    {
      q: "哪种循环结构保证循环体至少执行一次？",
      opts: ["for", "while", "do-while", "都保证"],
      answer: 2,
      explain: "do-while 先执行循环体再判断条件，所以至少执行一次。"
    },
    {
      q: "求 1~n 的和时，写成 int sum; for (...) sum += i; 可能出错的原因是？",
      opts: [
        "for 循环不能累加",
        "sum 未初始化，初值是垃圾值，结果不确定",
        "必须用 long 类型",
        "i 必须是浮点数"
      ],
      answer: 1,
      explain: "局部变量不会自动清零，累加变量必须写成 int sum = 0;"
    }
  ],
});
