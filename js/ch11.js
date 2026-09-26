/* 第 11 章：结构体、枚举与 typedef */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch11",
  group: "第四阶段 · 处理真实数据",
  level: "进阶",
  emoji: "🧱",
  title: "结构体、枚举与 typedef",
  lead: "把「一个学生的全部信息」打包成一个变量，代码立刻像真实世界一样清晰。",
  tags: ["struct", "typedef", "enum", "结构体数组"],
  minutes: 40,
  summary: `
<h2>1. 结构体：自定义数据类型</h2>
<p>数组要求元素类型相同，而现实数据往往是「不同类型混在一起」（学号 int、姓名 char[]、成绩 double）。结构体解决的就是这个问题。</p>
<pre>struct Student {           /* 定义一种新类型：注意结尾的分号 */
    int    id;
    char   name[20];
    double score;
};

struct Student s1 = {1001, "小明", 92.5};   /* 初始化 */
s1.score = 95.0;                            /* 用点号 . 访问成员 */
printf("%d %s %.1f\\n", s1.id, s1.name, s1.score);</pre>

<h2>2. 用 typedef 起个短名字（强烈推荐）</h2>
<pre>typedef struct Student {
    int    id;
    char   name[20];
    double score;
} Student;                 /* 以后直接写 Student s1; 不用再加 struct */

typedef unsigned long ulong;    /* typedef 也能给基本类型起别名 */</pre>

<h2>3. 结构体数组：管理一批数据</h2>
<pre>Student group[3] = {
    {1001, "小明", 92.5},
    {1002, "小红", 88.0},
    {1003, "小刚", 76.5}
};

for (int i = 0; i &lt; 3; i++)
    printf("%-6d %-8s %.1f\\n", group[i].id, group[i].name, group[i].score);</pre>
<p>按成绩排序时，交换的是整个结构体（用临时变量 tmp = group[i]; 这样整体赋值，C 允许结构体直接赋值）。</p>

<h2>4. 结构体指针与 -&gt; 运算符</h2>
<pre>Student s = {1001, "小明", 92.5};
Student *p = &amp;s;

printf("%s\\n", (*p).name);    /* 先解引用再取成员，写法啰嗦 */
printf("%s\\n", p-&gt;name);      /* 等价简写：-&gt; 专用于指针 */</pre>
<p><code>p-&gt;name</code> 是 <code>(*p).name</code> 的语法糖，日常都用前者。</p>

<h2>5. 结构体做函数参数：用指针更高效</h2>
<pre>void print_student(const Student *p) {      /* const 表示"不会改你的数据" */
    printf("%s: %.1f\\n", p-&gt;name, p-&gt;score);
}

Student find_best(Student *list, int n);    /* 可以直接返回结构体 */</pre>
<div class="callout tip"><span class="ico">✅</span><div class="body"><p>结构体按值传递会<strong>复制整个结构体</strong>（成员多、含大数组时开销明显），所以传参习惯用指针 + const；而「返回一个结构体」是允许的，很适合打包多个结果。</p></div></div>

<h2>6. 枚举 enum：给整数起名字</h2>
<pre>enum Weekday { MON, TUE, WED, THU, FRI, SAT, SUN };   /* 默认 MON=0, TUE=1, ... */

enum Weekday today = WED;
printf("%d\\n", today);        /* 2 */

typedef enum { RED = 1, GREEN, BLUE } Color;          /* 也可以自定义起始值 */
Color c = GREEN;               /* GREEN 就是 2 */</pre>
<p>枚举让代码可读性大增：写 <code>today == SAT</code> 远比 <code>day == 5</code> 清楚。</p>

<h2>7. 联合 union（了解）</h2>
<pre>union Data {
    int   i;
    float f;
    char  str[8];
};   /* 所有成员共用同一块内存，同一时间只有一个成员有效，常用于节省空间或底层协议解析 */</pre>
`,
  examples: [
    {
      name: "struct_array.c",
      note: "结构体数组：像表格一样管理一批数据。",
      code: String.raw`#include <stdio.h>

typedef struct {
    int    id;
    char   name[20];
    double score;
} Student;                          /* 用 typedef 后可以直接写 Student */

int main(void)
{
    Student group[3] = {
        {1001, "小明", 92.5},
        {1002, "小红", 88.0},
        {1003, "小刚", 76.5}
    };
    int n = 3;

    printf("学号    姓名    成绩\n");
    for (int i = 0; i < n; i++)
        printf("%-7d %-6s %.1f\n",
               group[i].id, group[i].name, group[i].score);

    /* 找出最高分的学生：记录下标，而不是只记录分数 */
    int best = 0;
    for (int i = 1; i < n; i++)
        if (group[i].score > group[best].score) best = i;

    printf("最高分: %s (%.1f)\n", group[best].name, group[best].score);
    return 0;
}`,
      output: "学号    姓名    成绩\n1001    小明   92.5\n1002    小红   88.0\n1003    小刚   76.5\n最高分: 小明 (92.5)"
    },
    {
      name: "struct_func.c",
      note: "结构体数组 + 指针传参 + 排序，还有 -&gt; 运算符的用法。",
      code: String.raw`#include <stdio.h>

typedef struct {
    int    id;
    char   name[20];
    double score;
} Student;

void print_all(const Student *list, int n)      /* 传指针，不复制整个数组 */
{
    for (int i = 0; i < n; i++)
        printf("%s: %.1f\n", list[i].name, list[i].score);
}

void sort_by_score(Student *list, int n)        /* 冒泡排序，交换整个结构体 */
{
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (list[j].score < list[j + 1].score) {   /* 降序 */
                Student t   = list[j];
                list[j]     = list[j + 1];             /* 结构体可以直接赋值 */
                list[j + 1] = t;
            }
}

int main(void)
{
    Student list[3] = {
        {1001, "小明", 92.5},
        {1002, "小红", 88.0},
        {1003, "小刚", 76.5}
    };

    sort_by_score(list, 3);
    puts("按成绩降序排列:");
    print_all(list, 3);

    Student *p = &list[1];
    printf("第二个学生: %s -> %.1f\n", p->name, p->score);   /* p->成员 */
    return 0;
}`,
      output: "按成绩降序排列:\n小明: 92.5\n小红: 88.0\n小刚: 76.5\n第二个学生: 小红 -> 88.0"
    }
  ],
  practice: [
    {
      title: "统计学生成绩：平均分与最高分",
      req: "<p>用结构体数组存 3 个学生的信息（学号、姓名、成绩），读入后输出平均分，以及成绩最高的学生姓名。</p>",
      hint: [
        "先定义 typedef struct { int id; char name[20]; double score; } Student;",
        "读字符串成员用 scanf(\"%s\", s.name)（name 是数组，不用加 &）。",
        "求最高分时保存下标 best，最后用数组访问取出姓名。"
      ],
      sample: "输入 1001 小明 92.5 / 1002 小红 88 / 1003 小刚 76.5\n平均分 = 85.67，最高分：小明",
      solution: String.raw`#include <stdio.h>

typedef struct {
    int    id;
    char   name[20];
    double score;
} Student;

int main(void)
{
    Student s[3];
    double sum = 0;
    int best = 0;

    for (int i = 0; i < 3; i++) {
        printf("请输入第 %d 个学生的 学号 姓名 成绩: ", i + 1);
        scanf("%d %s %lf", &s[i].id, s[i].name, &s[i].score);
        sum += s[i].score;
    }

    for (int i = 1; i < 3; i++)
        if (s[i].score > s[best].score) best = i;

    printf("平均分 = %.2f，最高分：%s\n", sum / 3, s[best].name);
    return 0;
}`,
      solutionNote: "注意 <code>&amp;s[i].id</code> 和 <code>&amp;s[i].score</code> 要加 &amp;，而 <code>s[i].name</code> 本身就是地址，不用加。这是初学者最容易写错的地方之一。"
    },
    {
      title: "计算两点之间的距离",
      req: "<p>定义结构体 <code>Point { double x, y; }</code>，读入两个点的坐标，写一个函数求它们的距离（保留 2 位小数）。</p>",
      hint: [
        "距离公式：sqrt((x1-x2)^2 + (y1-y2)^2)。",
        "需要 #include <math.h> 使用 sqrt；Linux 上编译可能要加 -lm。",
        "函数可以写成 double distance(const Point *a, const Point *b);"
      ],
      sample: "输入 0 0 3 4\n两点距离 = 5.00",
      solution: String.raw`#include <stdio.h>
#include <math.h>

typedef struct { double x, y; } Point;

double distance(const Point *a, const Point *b)
{
    double dx = a->x - b->x;      /* 用 -> 访问指针成员的写法 */
    double dy = a->y - b->y;
    return sqrt(dx * dx + dy * dy);
}

int main(void)
{
    Point p1, p2;

    printf("请输入两个点的坐标 x1 y1 x2 y2: ");
    scanf("%lf %lf %lf %lf", &p1.x, &p1.y, &p2.x, &p2.y);

    printf("两点距离 = %.2f\n", distance(&p1, &p2));
    return 0;
}`,
      solutionNote: "结构体把 x、y 打包在一起后，函数签名变得非常自然：<code>distance(&amp;p1, &amp;p2)</code>，比传四个 double 清楚多了。"
    }
  ],
  quiz: [
    {
      q: "定义结构体时，最后那个大括号后面的分号能不能省？",
      opts: [
        "可以省，C 语法允许",
        "不能省，struct 定义是一条完整语句，缺分号会引发后续一连串报错",
        "只有用 typedef 时才能省",
        "只有定义了成员变量时才能省"
      ],
      answer: 1,
      explain: "struct { ... }; 结尾的分号是必须的，漏写会导致后面莫名其妙的编译错误。"
    },
    {
      q: "已知 Student *p = &s; 访问成员 score 的写法是？",
      opts: ["*p.score", "p->score", "p.score", "&p.score"],
      answer: 1,
      explain: "指针访问成员用 ->，它等价于 (*p).score。p.score 是语法错误。"
    },
    {
      q: "关于结构体作为函数参数，说法正确的是？",
      opts: [
        "只能传指针，不能传结构体本身",
        "按值传递会复制整个结构体，成员多时建议传指针（可加 const）",
        "传结构体会自动变成指针",
        "结构体不能作为函数参数"
      ],
      answer: 1,
      explain: "C 允许直接传结构体（会整体复制），但传指针更高效；加 const 表示函数不会修改它。"
    },
    {
      q: "enum Color { RED = 1, GREEN, BLUE }; 则 BLUE 的值是？",
      opts: ["0", "1", "2", "3"],
      answer: 3,
      explain: "RED 指定为 1，后面的依次加 1：GREEN = 2，BLUE = 3。"
    },
    {
      q: "交换结构体数组中的两个元素，最简洁的写法是？",
      opts: [
        "逐个成员交换，必须一个一个写",
        "用临时变量整体赋值：Student t = a[i]; a[i] = a[j]; a[j] = t;",
        "只能通过指针交换成员地址",
        "结构体不能交换"
      ],
      answer: 1,
      explain: "C 允许结构体整体赋值（同类型之间），所以交换整个结构体只要一个临时变量。"
    }
  ]
});
