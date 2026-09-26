/* 第 8 章：函数 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch8",
  group: "第三阶段 · 组织数据",
  level: "进阶",
  emoji: "🧩",
  title: "函数：把代码拆成积木",
  lead: "把大问题拆成小函数，是写程序最重要的一项工程能力。",
  tags: ["定义与调用", "值传递", "递归", "作用域"],
  minutes: 45,
  summary: `
<h2>1. 为什么要有函数</h2>
<ul>
  <li><strong>复用</strong>：一段逻辑写一次，到处调用。</li>
  <li><strong>可读</strong>：<code>is_prime(n)</code> 一眼就知道在做什么。</li>
  <li><strong>易调试</strong>：函数短，出错范围就小；可以单独测试。</li>
</ul>

<h2>2. 定义、声明与调用</h2>
<pre>int add(int a, int b) {        /* 函数定义：返回类型 函数名(参数列表) */
    return a + b;              /* return 把结果交回给调用者 */
}

int main(void)
{
    int s = add(3, 5);         /* 调用：实参 3、5 传给形参 a、b */
    printf("%d\n", s);         /* 8 */
    return 0;
}</pre>
<table>
  <tr><th>要点</th><th>说明</th></tr>
  <tr><td>先声明后使用</td><td>函数定义写在调用之后时，需要在前面写原型：<code>int add(int, int);</code></td></tr>
  <tr><td>不能嵌套定义</td><td>函数必须定义在函数外面（C 不支持函数里定义函数）</td></tr>
  <tr><td>只能 return 一个值</td><td>需要「返回多个结果」要用指针或结构体（第 9、11 章）</td></tr>
  <tr><td>无返回值写 void</td><td><code>void print_line(void) { ... }</code>，void 函数里 <code>return;</code> 表示直接结束</td></tr>
</table>

<h2>3. 参数传递：C 只有「值传递」</h2>
<pre>void change(int x) { x = 100; }     /* 改的是副本 */

int main(void)
{
    int a = 5;
    change(a);
    printf("%d\n", a);              /* 还是 5！ */
}</pre>
<div class="callout warn"><span class="ico">⚠️</span><div class="body"><p>形参是实参的<strong>副本</strong>，函数里改形参不影响外面的变量。所以「写一个 swap 函数交换两个数」必须用指针（第 9 章的第一个例子）。</p></div></div>

<h2>4. 递归：函数自己调用自己</h2>
<pre>long long fact(int n) {
    if (n &lt;= 1) return 1;             /* 终止条件，绝对不能少 */
    return n * fact(n - 1);           /* 把问题缩小一号 */
}</pre>
<p>递归三要素：<strong>终止条件</strong>、<strong>把大问题变小</strong>、<strong>相信小问题已经被解决</strong>。汉诺塔、树的遍历、快排都靠它。</p>

<h2>5. 变量的作用域与存储</h2>
<table>
  <tr><th>类型</th><th>范围</th><th>生命周期</th></tr>
  <tr><td>局部变量</td><td>所在的花括号内</td><td>函数调用结束即销毁</td></tr>
  <tr><td>全局变量</td><td>整个文件（其他文件需 extern）</td><td>程序运行期间一直存在</td></tr>
  <tr><td>static 局部变量</td><td>所在函数内</td><td>只初始化一次，值在多次调用间保留</td></tr>
</table>
<div class="callout tip"><span class="ico">✅</span><div class="body"><p>尽量使用局部变量和参数传递，<strong>少用全局变量</strong>：全局变量会让函数之间产生隐形依赖，程序变大后很难维护。</p></div></div>

<h2>6. 多文件工程（了解一下）</h2>
<pre>/* math_utils.h */
#ifndef MATH_UTILS_H          /* 头文件保护，防止重复包含 */
#define MATH_UTILS_H
int add(int a, int b);
#endif

/* math_utils.c */
#include "math_utils.h"
int add(int a, int b) { return a + b; }

/* main.c */
#include <stdio.h>
#include "math_utils.h"
int main(void) { printf("%d\n", add(1, 2)); return 0; }

/* 编译：gcc main.c math_utils.c -o app */</pre>
`,
  examples: [
    {
      name: "functions.c",
      note: "一个完整的「多函数」程序：先写原型，再在 main 中调用，最后给出定义。",
      code: String.raw`#include <stdio.h>

/* 函数原型（声明）：让 main 提前知道它们的存在 */
int  is_prime(int n);
int  max3(int a, int b, int c);
void print_line(int n, char ch);

int main(void)
{
    printf("7 是素数吗? %s\n", is_prime(7) ? "是" : "不是");
    printf("三数最大值 = %d\n", max3(12, 45, 30));

    print_line(20, '-');        /* 输出一条分隔线 */
    printf("函数让 main 变得清爽\n");
    return 0;
}

int is_prime(int n)
{
    if (n <= 1) return 0;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return 0;      /* 提前 return，省掉标志变量 */
    return 1;
}

int max3(int a, int b, int c)
{
    int m = (a > b) ? a : b;
    return (m > c) ? m : c;
}

void print_line(int n, char ch)        /* void：没有返回值 */
{
    for (int i = 0; i < n; i++) putchar(ch);
    putchar('\n');
}`,
      output: "7 是素数吗? 是\n三数最大值 = 45\n--------------------\n函数让 main 变得清爽"
    },
    {
      name: "recursion.c",
      note: "递归求阶乘与斐波那契：注意终止条件，以及 return 前必须把问题变小。",
      code: String.raw`#include <stdio.h>

long long fact(int n)
{
    if (n <= 1) return 1;              /* 终止条件，绝不能少 */
    return (long long)n * fact(n - 1); /* 把问题缩小成 n-1 */
}

int fib(int n)
{
    if (n <= 2) return 1;
    return fib(n - 1) + fib(n - 2);
}

int main(void)
{
    for (int i = 1; i <= 10; i++)
        printf("%d! = %lld\n", i, fact(i));

    printf("斐波那契前 10 项: ");
    for (int i = 1; i <= 10; i++)
        printf("%d ", fib(i));
    printf("\n");
    return 0;
}`,
      output: "1! = 1\n2! = 2\n...\n10! = 3628800\n斐波那契前 10 项: 1 1 2 3 5 8 13 21 34 55"
    }
  ],
  practice: [
    {
      title: "用函数输出 100 以内的所有素数",
      req: "<p>写一个函数 <code>int is_prime(int n)</code>，在 <code>main</code> 中用循环找出 1~100 的所有素数并输出，每行输出 5 个。</p>",
      hint: [
        "判断素数的逻辑写在函数里，main 只负责遍历和格式化输出。",
        "想每行 5 个，可以用一个计数器 cnt，每输出一个就 cnt++，当 cnt % 5 == 0 时换行。",
        "注意 1 不是素数。"
      ],
      sample: "2 3 5 7 11\n13 17 19 23 29\n...\n共 25 个素数",
      solution: String.raw`#include <stdio.h>

int is_prime(int n)
{
    if (n <= 1) return 0;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return 0;
    return 1;
}

int main(void)
{
    int cnt = 0;

    for (int n = 2; n <= 100; n++) {
        if (is_prime(n)) {
            printf("%4d", n);
            cnt++;
            if (cnt % 5 == 0) printf("\n");
        }
    }
    printf("\n共 %d 个素数\n", cnt);
    return 0;
}`,
      solutionNote: "1~100 之间共有 25 个素数。如果你想验证答案，这个数字会帮你确认程序没错。"
    },
    {
      title: "用函数「返回」两个结果：和与差",
      req: "<p>写一个函数 <code>void calc(int a, int b, int *psum, int *pdiff)</code>，同时算出 a+b 和 a-b 并由指针带出来。</p>",
      hint: [
        "函数只能 return 一个值，多结果要靠指针（输出参数）。",
        "函数体里写 *psum = a + b; *pdiff = a - b;",
        "调用时要传地址：calc(x, y, &s, &d);"
      ],
      sample: "输入 10 4\n和=14 差=6",
      solution: String.raw`#include <stdio.h>

void calc(int a, int b, int *psum, int *pdiff)
{
    *psum  = a + b;      /* 写到调用者提供的变量里 */
    *pdiff = a - b;
}

int main(void)
{
    int x, y, s, d;

    printf("请输入两个整数: ");
    scanf("%d %d", &x, &y);

    calc(x, y, &s, &d);  /* 把 s、d 的地址交给函数 */

    printf("和=%d 差=%d\n", s, d);
    return 0;
}`,
      solutionNote: "提前熟悉这个套路，第 9 章学指针、第 11 章用结构体时都会反复用到「输出参数」。"
    }
  ],
  quiz: [
    {
      q: "关于 void 类型的函数，说法正确的是？",
      opts: [
        "不能有 return 语句",
        "没有返回值，可以写 return; 来提前结束函数",
        "必须返回 0",
        "调用时必须用变量接收结果"
      ],
      answer: 1,
      explain: "void 表示无返回值；return; 只是结束函数，后面不能带表达式。"
    },
    {
      q: "void f(int x) { x = 100; } 调用 f(a) 之后，a 的值会怎样？",
      opts: ["变成 100", "保持不变，因为形参是实参的副本", "不确定", "编译错误"],
      answer: 1,
      explain: "C 是值传递，函数内改形参不影响实参。要修改 a 必须传 &a 并在函数里用指针。"
    },
    {
      q: "递归函数缺少终止条件会导致什么？",
      opts: [
        "编译错误",
        "函数只会执行一次",
        "无限递归，最终因栈溢出而崩溃",
        "自动返回 0"
      ],
      answer: 2,
      explain: "每次调用都会占用栈空间，没有终止条件就会一直递归直到栈耗尽（stack overflow）。"
    },
    {
      q: "下面关于局部变量的说法，正确的是？",
      opts: [
        "局部变量在函数调用结束后仍然保留值",
        "局部变量只在其所在的花括号范围内有效",
        "局部变量必须用 static 声明",
        "局部变量可以被其他函数直接访问"
      ],
      answer: 1,
      explain: "局部变量作用域限于所在块，生命周期到函数返回为止；想保留值要用 static。"
    },
    {
      q: "函数定义写在 main 之后时，必须做什么？",
      opts: [
        "什么都不用做",
        "把函数定义复制到 main 里面",
        "在调用之前写函数原型声明（如 int add(int, int);）",
        "把函数名改成小写"
      ],
      answer: 2,
      explain: "C 要求先声明后使用，原型声明告诉编译器函数的返回类型和参数类型。"
    }
  ]
});
