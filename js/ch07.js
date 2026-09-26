/* 第 7 章：数组 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch7",
  group: "第三阶段 · 组织数据",
  level: "进阶",
  emoji: "🗂️",
  title: "数组：把一批数据装进一个盒子",
  lead: "有了数组，才能处理「一列数」：排序、查找、统计都从这里开始。",
  tags: ["一维数组", "二维数组", "冒泡排序", "查找"],
  minutes: 40,
  summary: `
<h2>1. 数组的声明与初始化</h2>
<p>数组是<strong>同类型数据的连续容器</strong>，长度在声明时确定，之后不能改变。</p>
<pre>int    scores[5];                  /* 5 个 int，下标 0 ~ 4 */
int    a[5] = {1, 2, 3, 4, 5};     /* 逐个初始化 */
int    b[5] = {1, 2};              /* 其余元素自动补 0 */
int    c[]  = {1, 2, 3};           /* 长度由初始化列表决定，等于 3 */
double d[10] = {0};                /* 常用技巧：全部清零 */</pre>
<div class="callout danger"><span class="ico">🚫</span><div class="body"><p>下标从 <strong>0</strong> 开始，最后一个元素是 <code>a[n-1]</code>。越界访问（如访问 <code>a[5]</code>）编译器不会报错，但会写坏别的变量甚至导致程序崩溃，这是 C 语言最危险的坑之一。</p></div></div>

<h2>2. 遍历：一切操作的基础</h2>
<pre>int sum = 0;
for (int i = 0; i &lt; n; i++) {      /* 注意是 i &lt; n，不是 i &lt;= n */
    sum += a[i];
}
printf("平均分 = %.2f\n", (double)sum / n);</pre>

<h2>3. 四个必会套路</h2>
<table>
  <tr><th>目标</th><th>思路</th></tr>
  <tr><td>最大值 / 最小值</td><td>先假设 <code>max = a[0]</code>，再逐个比较更新</td></tr>
  <tr><td>求和 / 平均</td><td>累加变量初始化为 0，别忘了求平均时转成 double</td></tr>
  <tr><td>计数统计</td><td>准备数组当下标计数器：<code>count[score / 10]++</code> 就是分数段统计</td></tr>
  <tr><td>查找</td><td>线性查找（无序数组）；二分查找（有序数组，效率高得多）</td></tr>
</table>

<h2>4. 排序：冒泡与选择</h2>
<pre>/* 冒泡排序：相邻两两比较，大的往后冒 */
for (int i = 0; i &lt; n - 1; i++)
    for (int j = 0; j &lt; n - 1 - i; j++)
        if (a[j] &gt; a[j + 1]) {            /* 想降序就把 &gt; 改成 &lt; */
            int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
        }</pre>
<p>外层循环控制「趟数」，内层比较相邻元素。选择排序则是每轮从未排序区间挑出最小值，放到当前位置。</p>

<h2>5. 二维数组</h2>
<pre>int m[2][3] = {{1, 2, 3}, {4, 5, 6}};   /* 2 行 3 列 */
int g[3][4] = {0};                       /* 3 行 4 列全 0 */

for (int i = 0; i &lt; 2; i++) {
    for (int j = 0; j &lt; 3; j++)
        printf("%4d", m[i][j]);
    printf("\n");
}</pre>
<p>理解方式：<code>m[i][j]</code> 是「第 i 行第 j 列」。矩阵转置就是把 <code>m[i][j]</code> 与 <code>m[j][i]</code> 互换。</p>

<h2>6. 数组作为函数参数（预告）</h2>
<pre>int sum_array(int a[], int n);   /* 声明：必须额外传长度 */
</pre>
<div class="callout warn"><span class="ico">⚠️</span><div class="body"><p>数组传参时不会整体复制，传进去的是首元素的地址，所以在函数里<strong>无法用 sizeof 求长度</strong>，必须把长度 n 一起传过去（第 9 章会解释原因）。</p></div></div>
`,
  examples: [
    {
      name: "array_stats.c",
      note: "一套数组统计组合拳：求和、平均、最值，以及用数组做计数器。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int a[8] = {72, 95, 60, 88, 95, 47, 73, 88};
    int n = 8;
    int sum = 0, max = a[0], min = a[0];

    for (int i = 0; i < n; i++) {
        sum += a[i];
        if (a[i] > max) max = a[i];
        if (a[i] < min) min = a[i];
    }
    printf("总和=%d 平均=%.2f 最高=%d 最低=%d\n",
           sum, (double)sum / n, max, min);

    /* 用数组当下标计数器：统计各分数段人数 */
    int count[10] = {0};                  /* 必须以 0 初始化 */
    for (int i = 0; i < n; i++) {
        count[a[i] / 10]++;               /* 72 / 10 = 7，落到第 7 组 */
    }
    for (int i = 9; i >= 4; i--) {
        if (count[i] > 0)
            printf("%d0-%d9 分: %d 人\n", i, i, count[i]);
    }
    return 0;
}`,
      output: "总和=618 平均=77.25 最高=95 最低=47\n90-99 分: 2 人\n80-89 分: 2 人\n70-79 分: 2 人\n60-69 分: 1 人\n40-49 分: 1 人"
    },
    {
      name: "sort_search.c",
      note: "先冒泡排序，再对有序数组做二分查找（效率远超逐个比较）。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    int a[6] = {42, 7, 93, 15, 68, 30};
    int n = 6;

    /* 冒泡排序（升序）：相邻比较，大的往后走 */
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (a[j] > a[j + 1]) {
                int t = a[j];  a[j] = a[j + 1];  a[j + 1] = t;
            }

    printf("排序后: ");
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");

    /* 二分查找：每次砍掉一半区间 */
    int target = 68, pos = -1, low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (a[mid] == target) { pos = mid; break; }
        else if (a[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    printf("查找 %d => 下标 %d\n", target, pos);
    return 0;
}`,
      output: "排序后: 7 15 30 42 68 93\n查找 68 => 下标 4"
    }
  ],
  practice: [
    {
      title: "统计高于平均分的人数",
      req: "<p>读入 6 个成绩存入数组，先求平均分，再统计有多少人高于平均分。</p>",
      hint: [
        "两轮循环：第一轮求和求平均，第二轮比较计数。",
        "平均分要用 double，比较时注意类型（double 与 int 比较会自动转换）。"
      ],
      sample: "输入 80 90 60 70 100 50\n平均分=75.00，高于平均分的有 3 人",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int a[6], sum = 0, cnt = 0;
    double avg;

    printf("请输入 6 个成绩: ");
    for (int i = 0; i < 6; i++) scanf("%d", &a[i]);   /* a[i] 本身就是地址，不用加 & */

    for (int i = 0; i < 6; i++) sum += a[i];
    avg = (double)sum / 6;

    for (int i = 0; i < 6; i++)
        if (a[i] > avg) cnt++;

    printf("平均分=%.2f，高于平均分的有 %d 人\n", avg, cnt);
    return 0;
}`,
      solutionNote: "注意 <code>scanf(\"%d\", &amp;a[i])</code> 里的 <code>&amp;</code> 是取元素地址，而 <code>a</code> 本身就不用再加 &amp;。"
    },
    {
      title: "矩阵转置（二维数组）",
      req: "<p>读入 2 行 3 列的整数矩阵，输出它的转置矩阵（变成 3 行 2 列）。</p>",
      hint: [
        "用二重循环读入：外层行、内层列。",
        "转置就是 result[j][i] = m[i][j]，输出时把两个循环的下标范围换过来。"
      ],
      sample: "输入 1 2 3 / 4 5 6\n输出 1 4 / 2 5 / 3 6",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int m[2][3], t[3][2];

    printf("请输入 2 行 3 列共 6 个整数:\n");
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 3; j++)
            scanf("%d", &m[i][j]);

    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 3; j++)
            t[j][i] = m[i][j];

    printf("转置后:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 2; j++) printf("%4d", t[i][j]);
        printf("\n");
    }
    return 0;
}`,
      solutionNote: "亲手在纸上画出两个矩阵的下标对应关系，比背代码有效得多。"
    }
  ],
  quiz: [
    {
      q: "int a[5]; 合法下标的范围是？",
      opts: ["1 ~ 5", "0 ~ 4", "0 ~ 5", "1 ~ 4"],
      answer: 1,
      explain: "C 数组下标从 0 开始，长度 5 的数组最大下标是 4。"
    },
    {
      q: "访问 a[5]（越界一个元素）会发生什么？",
      opts: [
        "编译报错，无法通过",
        "自动扩容数组",
        "编译通常不报错，但会读写到数组外的内存，可能改坏其他变量或崩溃",
        "自动把下标修正为 4"
      ],
      answer: 2,
      explain: "C 不做数组越界检查，这是段错误和「莫名其妙的数据被改」的常见原因。"
    },
    {
      q: "在函数内部对数组参数写 sizeof(a)，得到的是什么？",
      opts: [
        "整个数组的字节数",
        "数组元素个数",
        "指针（地址）的字节数，所以必须额外传长度",
        "编译错误"
      ],
      answer: 2,
      explain: "数组作为参数会退化成指针，sizeof 得到的是指针大小（64 位系统通常是 8），因此必须把 n 一起传进去。"
    },
    {
      q: "int a[5] = {0}; 的含义是？",
      opts: [
        "只有 a[0] 是 0，其余是垃圾值",
        "所有元素都被初始化为 0",
        "数组长度是 1",
        "语法错误"
      ],
      answer: 1,
      explain: "初始化列表不足时会自动补 0，所以 {0} 是最常用的「整体清零」写法。"
    },
    {
      q: "二维数组 int m[2][3] 中，元素 m[1][2] 是第几个元素（按行优先存放）？",
      opts: ["第 3 个", "第 5 个", "第 6 个", "第 2 个"],
      answer: 1,
      explain: "行优先：m[0][0] m[0][1] m[0][2] m[1][0] m[1][1] m[1][2]，所以 m[1][2] 是第 6 个（下标 5）。"
    }
  ]
});
