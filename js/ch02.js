/* 第 2 章：变量、数据类型与常量 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch2",
  group: "第一阶段 · 熟悉环境",
  level: "入门",
  emoji: "📦",
  title: "变量、数据类型与常量",
  lead: "程序要处理数据，就得先学会给数据「找一个带类型的盒子」。",
  tags: ["int/double/char", "sizeof", "类型转换"],
  minutes: 30,
  summary: `
<h2>1. 变量：带类型的盒子</h2>
<p>变量是内存中一块有名字的存储空间。使用前必须<strong>先声明类型</strong>，类型决定这块空间多大、能存什么。</p>
<pre>int age;            // 声明：给我一个整数盒子
age = 18;           // 赋值
int score = 95;     // 声明并初始化（推荐写法）
int a = 1, b = 2;   // 一行声明多个变量</pre>
<p><strong>命名规则</strong>：只能由字母、数字、下划线组成，不能以数字开头，不能是关键字（如 <code>int</code>、<code>if</code>），区分大小写（<code>age</code> 与 <code>Age</code> 是两个变量）。推荐 <code>max_score</code> 或 <code>maxScore</code> 这样的写法。</p>

<h2>2. 常用数据类型</h2>
<table>
  <tr><th>类型</th><th>典型字节数</th><th>用途</th><th>printf 占位符</th></tr>
  <tr><td><code>char</code></td><td>1</td><td>单个字符，如 'A'</td><td>%c</td></tr>
  <tr><td><code>short</code></td><td>2</td><td>小整数</td><td>%hd</td></tr>
  <tr><td><code>int</code></td><td>4</td><td>整数（最常用）</td><td>%d</td></tr>
  <tr><td><code>long long</code></td><td>8</td><td>大整数</td><td>%lld</td></tr>
  <tr><td><code>float</code></td><td>4</td><td>单精度小数（约 7 位有效数字）</td><td>%f</td></tr>
  <tr><td><code>double</code></td><td>8</td><td>双精度小数（约 15 位，推荐）</td><td>%lf</td></tr>
</table>
<p>用 <code>sizeof</code> 可查看占用字节数：<code>printf("%d", (int)sizeof(int));</code></p>
<div class="callout warn"><span class="ico">⚠️</span><div class="body"><p>整数有范围：4 字节 int 约为 <code>-2147483648 ~ 2147483647</code>，超出会<strong>溢出</strong>成奇怪的负数，而编译器通常不报错。</p></div></div>

<h2>3. 常量：值不该被改</h2>
<pre>#define PI 3.14159          // 宏常量：预处理阶段做文本替换，没有类型
const double pi = 3.14159;  // const 常量：有类型、编译器会检查，推荐</pre>

<h2>4. 类型转换</h2>
<ul>
  <li><strong>隐式转换</strong>：小范围自动转大范围，如 int 与 double 运算时先转 double，安全。</li>
  <li><strong>隐式窄化</strong>：double 赋给 int 会<strong>直接丢掉小数部分</strong>（不是四舍五入）。</li>
  <li><strong>强制转换</strong>：<code>(int)3.9</code> 得 <code>3</code>；<code>(double)5 / 2</code> 得 <code>2.500000</code>。</li>
</ul>

<h2>5. 四个必须记住的坑</h2>
<ol>
  <li><strong>整数除法</strong>：<code>5 / 2</code> 得 <code>2</code>；要 2.5 必须写 <code>5.0 / 2</code> 或 <code>(double)5 / 2</code>。</li>
  <li><strong>浮点精度</strong>：<code>0.1 + 0.2</code> 可能不等于 <code>0.3</code>，所以浮点数<strong>不要用 == 比较</strong>，应判断两数之差的绝对值是否足够小。</li>
  <li><strong>未初始化</strong>：<code>int x;</code> 里面是内存垃圾值，输出什么都有可能。</li>
  <li><strong>占位符用错</strong>：用 <code>%d</code> 输出 double 会得到垃圾数字，甚至崩溃。</li>
</ol>
`,
  examples: [
    {
      name: "types.c",
      note: "演示声明、初始化、sizeof 与格式化输出。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int    age = 18;
    double height = 1.75;
    char   grade = 'A';

    printf("年龄: %d 岁\n", age);
    printf("身高: %.2f 米\n", height);   /* %.2f：保留两位小数 */
    printf("等级: %c\n", grade);
    printf("int 占 %d 字节, double 占 %d 字节\n",
           (int)sizeof(int), (int)sizeof(double));
    return 0;
}`,
      output: "年龄: 18 岁\n身高: 1.75 米\n等级: A\nint 占 4 字节, double 占 8 字节"
    },
    {
      name: "divide.c",
      note: "整数除法与类型转换对比，注意两种写法的差别。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int a = 5, b = 2;

    printf("a / b         = %d\n", a / b);          /* 2：整数除法截断 */
    printf("a %% b         = %d\n", a % b);          /* 1：%% 输出一个 % */
    printf("(double)a / b = %.3f\n", (double)a / b); /* 2.500 */
    printf("(int)3.9      = %d\n", (int)3.9);        /* 3：截断不是四舍五入 */

    int x;                                        /* 未初始化 = 垃圾值 */
    printf("未初始化变量 x = %d\n", x);
    return 0;
}`,
      output: "a / b         = 2\na % b         = 1\n(double)a / b = 2.500\n(int)3.9      = 3\n未初始化变量 x = 4200560"
    }
  ],
  practice: [
    {
      title: "交换两个变量的值",
      req: "<p>已知 <code>a = 3</code>、<code>b = 8</code>，交换它们的值，最后输出「交换后 a=8, b=3」。</p>",
      hint: [
        "需要临时变量 tmp 暂存一个值，就像用空杯子交换两杯饮料。",
        "顺序：tmp = a; a = b; b = tmp; 顺序写错结果就错，可在纸上走一遍。"
      ],
      sample: "交换前 a=3, b=8\n交换后 a=8, b=3",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int a = 3, b = 8, tmp;

    printf("交换前 a=%d, b=%d\n", a, b);

    tmp = a;
    a = b;
    b = tmp;

    printf("交换后 a=%d, b=%d\n", a, b);
    return 0;
}`,
      solutionNote: "进阶：不用临时变量也能交换（<code>a=a+b; b=a-b; a=a-b;</code>），但可读性差，实际都用临时变量。第 9 章会学到用函数加指针来实现交换。"
    },
    {
      title: "计算圆的面积（体会整数除法的坑）",
      req: "<p>半径 <code>r = 3</code>，圆周率用 <code>3.14159</code>，输出面积并保留 2 位小数。</p>",
      hint: [
        "公式：s = pi * r * r。",
        "写 22 / 7 * 3 * 3 会先算整数除法 22/7 = 3，结果就错了；应保证至少有一个操作数是浮点数。"
      ],
      sample: "半径 r=3 的圆面积为 28.27",
      solution: String.raw`#include <stdio.h>
#define PI 3.14159

int main(void)
{
    double r = 3.0;
    double s = PI * r * r;

    printf("半径 r=%.0f 的圆面积为 %.2f\n", r, s);
    return 0;
}`,
      solutionNote: "即使把 r 声明为 int 也不影响结果，因为 PI 是浮点数，会触发隐式类型提升。"
    }
  ],
  quiz: [
    {
      q: "下列哪个变量名是合法的？",
      opts: ["2ndScore", "_total", "int", "my score"],
      answer: 1,
      explain: "不能以数字开头、不能用关键字、不能含空格；下划线开头合法。"
    },
    {
      q: "表达式 5 / 2 的结果是？",
      opts: ["2.5", "2", "3", "编译错误"],
      answer: 1,
      explain: "两个操作数都是 int，执行整数除法，结果截断为 2。要得到 2.5 需写 5.0 / 2 或 (double)5 / 2。"
    },
    {
      q: "要输出 double 类型变量 d，正确的是？",
      opts: ['printf("%d", d);', 'printf("%f", d);', 'printf("%c", d);', 'printf("%s", d);'],
      answer: 1,
      explain: "double 用 %f（可带精度如 %.2f）；%d 是整数，%c 是字符，%s 是字符串。"
    },
    {
      q: "(int)3.99 与 (double)7 / 2 的值分别是？",
      opts: ["4 和 3", "3 和 3.5", "4 和 3.5", "3 和 3"],
      answer: 1,
      explain: "强制转 int 直接截断小数部分，不是四舍五入；(double)7 / 2 中 7 先变 7.0，结果是 3.5。"
    }
  ]
});
