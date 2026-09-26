/* 第 5 章：选择结构（if 与 switch） */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch5",
  group: "第二阶段 · 掌握基本语句",
  level: "基础",
  emoji: "🔀",
  title: "选择结构：if 与 switch",
  lead: "程序开始「会思考」了：根据不同条件走不同的路。",
  tags: ["if/else", "switch", "常见陷阱"],
  minutes: 35,
  summary: `
<h2>1. if 语句</h2>
<pre>if (条件) {
    语句;
}</pre>
<p>条件为真（非 0）才执行。只有一条语句时花括号可以省略，但<strong>建议永远写上</strong>，加代码时才不会出错。</p>

<h2>2. if / else / else if 多分支</h2>
<pre>if (score &gt;= 90)
    grade = 'A';
else if (score &gt;= 80)     /* 能走到这里，说明 score &lt; 90 */
    grade = 'B';
else if (score &gt;= 60)
    grade = 'C';
else
    grade = 'D';</pre>
<div class="callout warn"><span class="ico">⚠️</span><div class="body"><p>多分支的<strong>顺序很关键</strong>：条件要从严格到宽松排列。若把 <code>score &gt;= 60</code> 写在最前面，90 分也会被判成 C。</p></div></div>

<h2>3. 嵌套与条件组合</h2>
<pre>/* 写法一：嵌套 */
if (x &gt; 0) {
    if (y &gt; 0) printf("第一象限");
}
/* 写法二：用逻辑运算符组合，层次更浅，推荐 */
if (x &gt; 0 &amp;&amp; y &gt; 0) printf("第一象限");</pre>

<h2>4. switch：等值多分支</h2>
<pre>switch (表达式) {
    case 1:
        printf("星期一\n");
        break;                    /* 不加 break 会继续往下执行 */
    case 6:
    case 7:                       /* 多个 case 共用一段代码 */
        printf("周末\n");
        break;
    default:                      /* 都不匹配时执行 */
        printf("输入有误\n");
}</pre>
<ul>
  <li>表达式必须是<strong>整型或字符型</strong>，不能是浮点数、字符串。</li>
  <li><code>case</code> 后面必须是<strong>常量</strong>（如 <code>case 3:</code> <code>case 'A':</code>），不能写变量或表达式。</li>
  <li>忘记 <code>break</code> 会发生「穿透」，继续执行下一个 case 的代码。</li>
  <li>if/else 适合范围判断（&gt;、&lt;），switch 适合等值判断（菜单、选项）。</li>
</ul>

<h2>5. 四个经典错误</h2>
<table>
  <tr><th>错误写法</th><th>问题</th></tr>
  <tr><td><code>if (a = 1)</code></td><td>赋值表达式恒为 1，条件永远成立。判等要用 <code>==</code>，也可写成 <code>if (1 == a)</code></td></tr>
  <tr><td><code>if (x &gt; 0);</code></td><td>多写一个分号，if 后面变成空语句，下面的大括号代码无条件执行</td></tr>
  <tr><td>省略花括号写多行</td><td>只有第一行属于 if，后面的语句总是执行</td></tr>
  <tr><td>悬空 else</td><td>else 会与最近的未配对 if 结合，缩进不代表归属，请加花括号</td></tr>
</table>
`,
  examples: [
    {
      name: "grade.c",
      note: "多分支的典型写法：条件从严格到宽松，最后一个 else 兜底。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int score;

    printf("请输入成绩(0-100): ");
    scanf("%d", &score);

    if (score < 0 || score > 100) {
        printf("成绩不合法\n");
    } else if (score >= 90) {
        printf("等级 A，太棒了！\n");
    } else if (score >= 80) {
        printf("等级 B\n");
    } else if (score >= 60) {
        printf("等级 C，及格\n");
    } else {
        printf("等级 D，需要补考\n");
    }
    return 0;
}`,
      output: "请输入成绩(0-100): 85\n等级 B"
    },
    {
      name: "season.c",
      note: "switch 的等值多分支：多个 case 可以共用同一段代码（利用穿透）。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int month;

    printf("输入月份(1-12): ");
    scanf("%d", &month);

    switch (month) {
        case 3:  case 4:  case 5:
            printf("%d 月属于春季\n", month);
            break;
        case 6:  case 7:  case 8:
            printf("%d 月属于夏季\n", month);
            break;
        case 9:  case 10: case 11:
            printf("%d 月属于秋季\n", month);
            break;
        case 12: case 1:  case 2:
            printf("%d 月属于冬季\n", month);
            break;
        default:
            printf("月份不合法，请输入 1-12\n");
    }
    return 0;
}`,
      output: "输入月份(1-12): 10\n10 月属于秋季"
    }
  ],
  practice: [
    {
      title: "判断闰年",
      req: "<p>读入一个年份，判断它是否为闰年。闰年规则：能被 4 整除但不能被 100 整除，或者能被 400 整除。</p>",
      hint: [
        "把规则翻译成条件：(year % 4 == 0 && year % 100 != 0) || year % 400 == 0。",
        "注意 && 的优先级高于 ||，为保险可以加括号。"
      ],
      sample: "输入 2024\n2024 是闰年\n输入 1900\n1900 不是闰年",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int year;

    printf("请输入年份: ");
    scanf("%d", &year);

    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
        printf("%d 是闰年\n", year);
    else
        printf("%d 不是闰年\n", year);

    return 0;
}`,
      solutionNote: "测试用例要覆盖四种情况：2024（闰）、2023（平）、1900（平）、2000（闰）。能想到用 1900 和 2000 这两个边界，说明你已经会「设计测试」了。"
    },
    {
      title: "把三个数从小到大排序",
      req: "<p>读入三个整数 a、b、c，输出排序后的结果。</p>",
      hint: [
        "思路：让 a 始终最小，再比较 b 和 c。",
        "让 a 最小的办法：if (a > b) 交换 a 和 b; 再 if (a > c) 交换 a 和 c。",
        "交换需要临时变量 tmp，回想第 2 章的练习。"
      ],
      sample: "输入 7 3 5\n排序后: 3 5 7",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int a, b, c, tmp;

    printf("请输入三个整数: ");
    scanf("%d %d %d", &a, &b, &c);

    if (a > b) { tmp = a; a = b; b = tmp; }   /* 保证 a <= b */
    if (a > c) { tmp = a; a = c; c = tmp; }   /* 保证 a <= c，此时 a 最小 */
    if (b > c) { tmp = b; b = c; c = tmp; }   /* 保证 b <= c */

    printf("排序后: %d %d %d\n", a, b, c);
    return 0;
}`,
      solutionNote: "这就是「冒泡排序」三个元素的版本，第 7 章会把它推广到数组上。"
    }
  ],
  quiz: [
    {
      q: "if (a = 0) 这类写法的实际后果是？",
      opts: [
        "编译报错，无法通过",
        "把 0 赋给 a，条件恒为假，else 分支总被执行",
        "与 a == 0 完全等价",
        "把 0 赋给 a，条件恒为真"
      ],
      answer: 1,
      explain: "赋值表达式的结果是被赋的值 0，0 视为假，所以 if 永远不成立（写成 if (a = 1) 则永远成立）。判等要用 ==。"
    },
    {
      q: "switch 语句中如果某个 case 后忘了写 break，会出现什么？",
      opts: [
        "编译错误",
        "只执行该 case，没有影响",
        "发生穿透，继续执行后面 case 的代码",
        "直接跳出 switch"
      ],
      answer: 2,
      explain: "没有 break 会「fall through」继续往下执行，直到遇到 break 或 switch 结束。有时故意这样用，但多数情况是 bug。"
    },
    {
      q: "判断闰年的正确条件是？",
      opts: [
        "year % 4 == 0",
        "year % 400 == 0",
        "(year % 4 == 0 && year % 100 != 0) || year % 400 == 0",
        "year % 4 == 0 || year % 100 == 0"
      ],
      answer: 2,
      explain: "必须排除整百年，同时保留能被 400 整除的特殊情况，例如 1900 不是闰年而 2000 是。"
    },
    {
      q: "关于 switch，下列说法正确的是？",
      opts: [
        "switch 的表达式可以是 double",
        "case 后面可以写变量，如 case n:",
        "switch 的表达式必须是整型或字符型，case 后必须是常量",
        "switch 必须有 default 分支才算合法"
      ],
      answer: 2,
      explain: "switch 只支持整型/字符型（含 enum），case 必须是编译期常量；default 是可选的。"
    },
    {
      q: "关于 if 后面多写一个分号：if (x > 0);  { ... }，会出现什么？",
      opts: [
        "编译错误",
        "if 后面成了空语句，大括号里的代码无条件执行",
        "与正常写法完全一样",
        "只在大括号里有变量声明时才出错"
      ],
      answer: 1,
      explain: "分号结束了 if 的控制范围，后面的大括号变成一个普通语句块，永远执行。"
    }
  ]
});
