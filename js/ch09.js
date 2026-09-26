/* 第 9 章：指针 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch9",
  group: "第三阶段 · 组织数据",
  level: "进阶",
  emoji: "📍",
  title: "指针：C 语言的分水岭",
  lead: "指针就是「内存地址」。理解它，你才真正理解 C 是怎么操作数据的。",
  tags: ["& 与 *", "指针与数组", "指针传参", "NULL"],
  minutes: 50,
  summary: `
<h2>1. 内存、地址与两个运算符</h2>
<p>可以把内存想象成排成一排的小格子，每个格子有编号，这个编号就是<strong>地址</strong>。变量住在格子里，指针就是「存地址的变量」。</p>
<table>
  <tr><th>运算符</th><th>名称</th><th>作用</th></tr>
  <tr><td><code>&amp;</code></td><td>取地址</td><td><code>&amp;a</code> 得到变量 a 的地址</td></tr>
  <tr><td><code>*</code></td><td>解引用</td><td><code>*p</code> 取出 p 所指地址里存的值</td></tr>
</table>
<pre>int a = 10;
int *p = &amp;a;            /* p 指向 a（p 的类型是"指向 int 的指针"） */

printf("a 的值   = %d\n", a);      /* 10 */
printf("a 的地址 = %p\n", (void *)&amp;a);
printf("p 的值   = %p\n", (void *)p);   /* 和上面一样 */
printf("*p       = %d\n", *p);     /* 10 */

*p = 20;                          /* 通过指针改 a 的值 */
printf("a = %d\n", a);            /* 20 */</pre>
<p><code>%p</code> 用于输出地址，习惯上转成 <code>(void *)</code>。</p>

<h2>2. 指针的大小与初始化</h2>
<ul>
  <li>指针本身也占空间：64 位系统上通常是 <strong>8 字节</strong>，32 位系统 4 字节，与它指向的类型无关。</li>
  <li><strong>必须初始化</strong>：<code>int *p;</code> 是「野指针」，指向不确定的地址，解引用它可能直接崩溃。</li>
  <li>暂时没有指向时赋 <code>NULL</code>：<code>int *p = NULL;</code>，使用前判断 <code>if (p != NULL)</code>。</li>
</ul>

<h2>3. 指针与数组的关系</h2>
<pre>int a[5] = {10, 20, 30, 40, 50};
int *p = a;            /* 数组名就是首元素地址，等价于 &amp;a[0] */

printf("%d %d %d\n", a[2], *(a + 2), *(p + 2));   /* 都是 30 */
p++;                   /* 指针向后移动一个 int（不是 1 个字节） */</pre>
<div class="callout info"><span class="ico">💡</span><div class="body"><p>核心恒等式：<code>a[i]</code> 完全等价于 <code>*(a + i)</code>。这也解释了第 7 章的疑惑：数组名传给函数时退化成指针，所以函数里 <code>sizeof(a)</code> 得到的是指针大小而不是数组长度。</p></div></div>

<h2>4. 指针作为函数参数：真正的交换</h2>
<pre>void swap(int *x, int *y) {        /* 形参是指针 */
    int t = *x;
    *x = *y;
    *y = t;                        /* 改的是"指针指向的变量" */
}

int main(void)
{
    int a = 3, b = 8;
    swap(&amp;a, &amp;b);                   /* 传地址进去 */
    printf("a=%d b=%d\n", a, b);    /* a=8 b=3，成功交换 */
    return 0;
}</pre>
<p>要点：想在函数里修改调用者的变量，就<strong>把地址传进去</strong>。这也是「一个函数返回多个结果」的常用手法：用指针做输出参数。</p>

<h2>5. 指针与 const</h2>
<table>
  <tr><th>写法</th><th>含义</th></tr>
  <tr><td><code>const int *p;</code></td><td>不能通过 p 修改它指向的数据（指向的数据是只读的）</td></tr>
  <tr><td><code>int * const p = &amp;a;</code></td><td>p 本身不能再指向别人（指针是只读的）</td></tr>
</table>

<h2>6. 五个最常见的指针错误</h2>
<ol>
  <li><strong>野指针</strong>：<code>int *p;</code> 未初始化就 <code>*p = 5;</code> → 段错误。</li>
  <li><strong>解引用 NULL</strong>：<code>int *p = NULL; *p = 1;</code> → 崩溃。</li>
  <li><strong>数组越界</strong>：<code>p = a + n;</code> 之后就访问，已经跑出数组范围。</li>
  <li><strong>类型不匹配</strong>：把 <code>int *</code> 赋给 <code>double *</code>，读写会错位。</li>
  <li><strong>返回局部变量的地址</strong>：函数返回后那块内存已失效，是未定义行为。</li>
</ol>
<div class="callout tip"><span class="ico">✅</span><div class="body"><p>调试技巧：遇到「Segmentation fault」先怀疑指针；用 <code>gcc -g -fsanitize=address</code> 编译能把越界和野指针问题直接报在你面前。</p></div></div>
`,
  examples: [
    {
      name: "swap_demo.c",
      note: "对比实验：值传递改不了实参，传地址才能改。",
      code: String.raw`#include <stdio.h>

void swap_wrong(int x, int y)          /* 只交换了副本 */
{
    int t = x;  x = y;  y = t;
}

void swap_right(int *x, int *y)        /* 交换指针指向的变量 */
{
    int t = *x;
    *x = *y;
    *y = t;
}

int main(void)
{
    int a = 3, b = 8;

    swap_wrong(a, b);
    printf("值传递后  : a=%d b=%d （没变）\n", a, b);

    swap_right(&a, &b);                /* 传地址 */
    printf("指针传参后: a=%d b=%d （交换成功）\n", a, b);
    return 0;
}`,
      output: "值传递后  : a=3 b=8 （没变）\n指针传参后: a=8 b=3 （交换成功）"
    },
    {
      name: "pointer_array.c",
      note: "指针遍历数组 + 用「输出参数」一次带回两个结果。",
      code: String.raw`#include <stdio.h>

void min_max(int *a, int n, int *pmin, int *pmax)
{
    *pmin = *pmax = a[0];              /* 先用第一个元素初始化 */


    for (int i = 1; i < n; i++) {
        if (a[i] < *pmin) *pmin = a[i];
        if (a[i] > *pmax) *pmax = a[i];
    }
}

int main(void)
{
    int a[6] = {42, 7, 93, 15, 68, 30};
    int n = 6, low, high;

    min_max(a, n, &low, &high);
    printf("最小值=%d 最大值=%d\n", low, high);

    int *p = a;                        /* 指针遍历 */
    while (p < a + n) {
        printf("%d ", *p);
        p++;
    }
    printf("\n");
    return 0;
}`,
      output: "最小值=7 最大值=93\n42 7 93 15 68 30"
    }
  ],
  practice: [
    {
      title: "自己实现 swap 函数",
      req: "<p>读入两个整数，用自己写的 <code>void swap(int *x, int *y)</code> 交换它们，并输出结果。</p>",
      hint: [
        "形参是指针，所以函数里要用 *x、*y 访问真正的变量。",
        "临时变量 t 保存 *x 的值，注意别写成 t = x（那是地址）。",
        "调用时传 &a、&b。"
      ],
      sample: "输入 5 9\n交换后: a=9 b=5",
      solution: String.raw`#include <stdio.h>

void swap(int *x, int *y)
{
    int t = *x;
    *x = *y;
    *y = t;
}

int main(void)
{
    int a, b;

    printf("请输入两个整数: ");
    scanf("%d %d", &a, &b);

    swap(&a, &b);

    printf("交换后: a=%d b=%d\n", a, b);
    return 0;
}`,
      solutionNote: "如果漏了 <code>&amp;</code>，编译器通常会警告类型不匹配（int 与 int* 不兼容）——学会看警告信息，能省很多调试时间。"
    },
    {
      title: "用指针统计偶数的个数并找出最大值",
      req: "<p>读入 8 个整数存入数组，写函数统计其中偶数的个数（用 return 返回），并把最大值通过指针参数带出。</p>",
      hint: [
        "函数签名可以是：int count_even(int *a, int n, int *pmax);",
        "偶数判断：a[i] % 2 == 0。",
        "最大值初始化成 a[0]，然后逐个比较。"
      ],
      sample: "输入 1 4 6 7 8 10 3 12\n偶数个数=5 最大值=12",
      solution: String.raw`#include <stdio.h>

int count_even(int *a, int n, int *pmax)
{
    int cnt = 0;
    *pmax = a[0];

    for (int i = 0; i < n; i++) {
        if (a[i] % 2 == 0) cnt++;
        if (a[i] > *pmax)  *pmax = a[i];
    }
    return cnt;
}

int main(void)
{
    int a[8], max, cnt;

    printf("请输入 8 个整数: ");
    for (int i = 0; i < 8; i++) scanf("%d", &a[i]);

    cnt = count_even(a, 8, &max);

    printf("偶数个数=%d 最大值=%d\n", cnt, max);
    return 0;
}`,
      solutionNote: "「一个返回值 + 若干指针输出参数」是 C 里非常常见的函数设计方式；到了第 11 章，你会看到用结构体把多个结果打包返回的更清爽写法。"
    }
  ],
  quiz: [
    {
      q: "设有 int a = 5; int *p = &a; 则 & 和 * 的作用分别是？",
      opts: [
        "& 取地址，* 解引用（取出指针指向的值）",
        "& 解引用，* 取地址",
        "两者都是取地址",
        "两者都是解引用"
      ],
      answer: 0,
      explain: "&a 得到 a 的地址，*p 得到 p 所指地址中存放的值。"
    },
    {
      q: "int a = 10; int *p = &a; *p = 20; 之后 a 的值是？",
      opts: ["10", "20", "地址值", "不确定"],
      answer: 1,
      explain: "*p 与 a 是同一块内存，通过指针赋值就等于给 a 赋值。"
    },
    {
      q: "对于 int a[5]; 数组名 a 在表达式中等价于？",
      opts: ["整个数组的一份副本", "&a[0]，即首元素的地址", "a[0] 的值", "NULL"],
      answer: 1,
      explain: "数组名会退化成指向首元素的指针，因此 a[i] 等价于 *(a + i)。"
    },
    {
      q: "要让函数真正修改调用者的变量，必须怎么做？",
      opts: [
        "把变量声明为全局变量后直接传值",
        "把变量的地址传进去，函数用指针参数接收",
        "把返回值改成 void",
        "在函数里用 static 变量"
      ],
      answer: 1,
      explain: "C 是值传递，只有传地址（并用指针解引用）才能修改调用者的数据。"
    },
    {
      q: "下面哪种写法最危险（可能导致段错误）？",
      opts: [
        "int a = 1; int *p = &a;",
        "int *p = NULL; *p = 10;",
        "int a[3]; int *p = a;",
        "int a = 5; printf(\"%d\", a);"
      ],
      answer: 1,
      explain: "解引用空指针是典型的非法内存访问。使用指针前应判断 if (p != NULL)。"
    }
  ]
});
