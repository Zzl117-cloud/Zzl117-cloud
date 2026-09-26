/* 第 12 章：文件操作与综合项目 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch12",
  group: "第四阶段 · 处理真实数据",
  level: "实战",
  emoji: "💾",
  title: "文件操作与综合项目",
  lead: "让数据活过程序退出：把结果写进文件，下次运行还能读回来。",
  tags: ["fopen/fclose", "fprintf/fgets", "综合项目", "调试"],
  minutes: 50,
  summary: `
<h2>1. 为什么需要文件</h2>
<p>程序里的变量都在内存中，程序一退出就消失了。要让数据<strong>持久保存</strong>（比如成绩单、配置、日志），就得写进磁盘文件。</p>

<h2>2. 三件套：fopen / 读写 / fclose</h2>
<pre>FILE *fp = fopen("scores.txt", "w");   /* 打开文件，返回文件指针 */
if (fp == NULL) {                      /* 必须检查是否打开成功 */
    printf("文件打开失败！\\n");
    return 1;
}
fprintf(fp, "小明 %d %d\\n", 90, 85);    /* 写数据 */
fclose(fp);                            /* 一定要关闭，否则数据可能没保存 */</pre>
<table>
  <tr><th>模式</th><th>含义</th></tr>
  <tr><td>"r"</td><td>只读。文件不存在则 fopen 返回 NULL</td></tr>
  <tr><td>"w"</td><td>只写。<strong>会清空原内容</strong>，文件不存在则新建</td></tr>
  <tr><td>"a"</td><td>追加：在文件末尾继续写</td></tr>
  <tr><td>"r+"</td><td>读写，文件必须存在</td></tr>
  <tr><td>"rb" / "wb"</td><td>二进制模式（Windows 上写二进制数据必须加 b）</td></tr>
</table>
<div class="callout warn"><span class="ico">⚠️</span><div class="body"><p>用 <code>"w"</code> 打开一个已有文件会<strong>立刻清空</strong>。想保留原数据要用 <code>"a"</code>，读取用 <code>"r"</code>。</p></div></div>

<h2>3. 读写数据的常用函数</h2>
<table>
  <tr><th>函数</th><th>用途</th><th>说明</th></tr>
  <tr><td><code>fprintf(fp, ...)</code></td><td>按格式写</td><td>和 printf 一样，只是多了第一个 fp 参数</td></tr>
  <tr><td><code>fscanf(fp, ...)</code></td><td>按格式读</td><td>和 scanf 一样，主要差别是要加 &amp; 且以 fp 开头</td></tr>
  <tr><td><code>fgets(buf, n, fp)</code></td><td>读一行</td><td>安全，读到 NULL 表示结束</td></tr>
  <tr><td><code>fputs(s, fp)</code></td><td>写一行</td><td>不自动加换行</td></tr>
  <tr><td><code>fgetc(fp)</code> / <code>fputc(c, fp)</code></td><td>读/写一个字符</td><td>fgetc 返回 EOF（-1）表示读完</td></tr>
</table>
<p><strong>读整个文件的正确写法</strong>：</p>
<pre>char line[256];
while (fgets(line, sizeof(line), fp) != NULL) {   /* 用返回值判断，而不是 feof */
    printf("%s", line);
}</pre>
<div class="callout danger"><span class="ico">🚫</span><div class="body"><p>不要写 <code>while (!feof(fp)) { fgets(...); ... }</code>，这是经典错误：<code>feof</code> 只有在读过之后才知道是否结束，会导致最后一行被处理两次。</p></div></div>

<h2>4. 综合项目：学生成绩管理系统</h2>
<p>把前面 11 章的知识串起来，做一个能长期使用的小系统。功能：</p>
<ol>
  <li>添加学生（学号、姓名、三科成绩）</li>
  <li>显示全部学生和平均分</li>
  <li>按平均分排序</li>
  <li>保存到文件 / 从文件读取</li>
</ol>
<p>实现建议（分四步做，每步都能单独跑通）：</p>
<ol>
  <li>先用 <code>Student</code> 结构体 + 数组，做好「添加」和「显示」。</li>
  <li>再加一个 <code>sort_by_avg()</code> 函数（冒泡排序，交换整个结构体）。</li>
  <li>然后用 <code>fprintf</code> 保存、<code>fscanf</code> 读取，实现持久化。</li>
  <li>最后套一层 <code>while + switch</code> 菜单，做成可交互程序。</li>
</ol>

<h2>5. 调试清单（遇到问题先查这里）</h2>
<table>
  <tr><th>现象</th><th>常见原因</th></tr>
  <tr><td>Segmentation fault / 段错误</td><td>野指针、空指针解引用、数组越界、scanf 忘了 &amp;、字符串没留 \\0 空间</td></tr>
  <tr><td>输出乱码</td><td>字符串缺 \\0、占位符与类型不匹配、文件编码不是 UTF-8（Windows 控制台可试 chcp 65001）</td></tr>
  <tr><td>死循环</td><td>循环变量没更新、while 后面多了分号、条件写反</td></tr>
  <tr><td>结果不对但能跑</td><td>整数除法、未初始化变量、== 与 = 混用、循环边界差一</td></tr>
  <tr><td>文件打不开</td><td>路径错、权限不足、用了 "r" 但文件不存在、忘记转义 Windows 路径中的反斜杠</td></tr>
</table>
<div class="callout tip"><span class="ico">✅</span><div class="body"><p>把 <code>-Wall -Wextra</code> 打开：<code>gcc -Wall -Wextra -g main.c -o app</code>。编译器给出的警告里有大量真实 bug，别忽略它们。</p></div></div>

<h2>6. 学完这一章之后</h2>
<ul>
  <li>动态内存：<code>malloc / free</code>，让数组大小在运行时决定。</li>
  <li>链表、栈、队列等数据结构；以及 <code>Makefile</code>、多文件工程、版本管理 git。</li>
  <li>算法训练：排序、查找、递推、贪心…… 用 C 实现一遍，语言本身就不再是障碍。</li>
</ul>
`,
  examples: [
    {
      name: "file_write.c",
      note: "把数据写进文件：注意 w 模式会清空原内容，以及 fclose 的重要性。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    FILE *fp = fopen("scores.txt", "w");      /* w：清空或新建 */
    if (fp == NULL) {
        printf("无法创建文件（检查是否有写权限）\n");
        return 1;                             /* 非 0 表示出错 */
    }

    fprintf(fp, "%s %d %d %d\n", "小明", 90, 85, 78);
    fprintf(fp, "%s %d %d %d\n", "小红", 88, 92, 95);
    fprintf(fp, "%s %d %d %d\n", "小刚", 76, 60, 82);

    fclose(fp);                               /* 必须关闭，否则缓冲区的数据可能丢失 */
    puts("已写入 scores.txt");
    return 0;
}`,
      output: "已写入 scores.txt\n（同目录下生成文件，内容为三行：小明 90 85 78 ...）"
    },
    {
      name: "file_read.c",
      note: "把文件读回来并计算平均分，用 fscanf 的返回值判断读取是否结束。",
      code: String.raw`#include <stdio.h>

int main(void)
{
    char name[20];
    int c, m, e;
    FILE *fp = fopen("scores.txt", "r");

    if (fp == NULL) {
        printf("文件不存在，请先运行写入程序\n");
        return 1;
    }

    printf("%-8s %5s %5s %5s %8s\n", "姓名", "语文", "数学", "英语", "平均分");
    while (fscanf(fp, "%s %d %d %d", name, &c, &m, &e) == 4) {
        printf("%-8s %5d %5d %5d %8.1f\n", name, c, m, e, (c + m + e) / 3.0);
    }

    fclose(fp);
    return 0;
}`,
      output: "姓名      语文  数学  英语    平均分\n小明        90    85    78     84.3\n小红        88    92    95     91.7\n小刚        76    60    82     72.7"
    }
  ],
  practice: [
    {
      title: "写入数组再读回来求平均",
      req: "<p>把数组 <code>{85, 92, 78, 60, 99}</code> 写入文件 nums.txt（每行一个数字），再重新打开文件读回，计算平均值与最大值。</p>",
      hint: [
        "写：用 fprintf(fp, \"%d\\n\", a[i]) 循环写入，写完 fclose。",
        "读：用 while (fscanf(fp, \"%d\", &x) == 1) 循环读，边读边累加并更新最大值。",
        "记得两次 fopen 都要检查 NULL，也要分别 fclose。"
      ],
      sample: "平均分=82.80 最大值=99",
      solution: String.raw`#include <stdio.h>

int main(void)
{
    int a[5] = {85, 92, 78, 60, 99};
    int x, cnt = 0, sum = 0, max;
    FILE *fp;

    /* 第一步：写入 */
    fp = fopen("nums.txt", "w");
    if (fp == NULL) { printf("写入失败\n"); return 1; }
    for (int i = 0; i < 5; i++) fprintf(fp, "%d\n", a[i]);
    fclose(fp);

    /* 第二步：读回并统计 */
    fp = fopen("nums.txt", "r");
    if (fp == NULL) { printf("读取失败\n"); return 1; }

    max = 0;
    while (fscanf(fp, "%d", &x) == 1) {
        if (cnt == 0 || x > max) max = x;
        sum += x;
        cnt++;
    }
    fclose(fp);

    printf("平均分=%.2f 最大值=%d\n", (double)sum / cnt, max);
    return 0;
}`,
      solutionNote: "注意 <code>max</code> 的初始化技巧：用 <code>cnt == 0</code> 判断是否是第一个读到的数，避免用 0 或垃圾值当初始最大值。"
    },
    {
      title: "综合项目：学生成绩管理系统",
      req: "<p>把前 11 章的知识全部串起来：用结构体 + 数组 + 函数 + 文件，做一个带菜单的小系统，支持「添加 / 显示 / 保存 / 读取 / 退出」。</p>",
      hint: [
        "第一步只做「添加 + 显示」，跑通后再加保存和读取，最后套菜单。",
        "菜单用 for (;;) + switch，选 0 时 return 0 退出。",
        "保存用 fprintf 写「学号 姓名 三科成绩」，读取用 fscanf 且判断返回值是否为 5。"
      ],
      sample: "1.添加 2.显示 3.保存 4.读取 0.退出\n（添加两条后显示）\n1001 小明 90 85 78  平均 84.33",
      solution: String.raw`#include <stdio.h>
#include <string.h>

#define MAX 50
#define FILE_NAME "students.txt"

typedef struct {
    int    id;
    char   name[20];
    double c, math, eng;                 /* 三科成绩 */
} Student;

Student list[MAX];
int count = 0;                           /* 当前人数（示例中简化为全局变量） */

double average(const Student *s)
{
    return (s->c + s->math + s->eng) / 3.0;
}

void add_student(void)
{
    if (count >= MAX) { puts("记录已满"); return; }
    printf("输入 学号 姓名 语文 数学 英语: ");
    scanf("%d %s %lf %lf %lf", &list[count].id, list[count].name,
          &list[count].c, &list[count].math, &list[count].eng);
    count++;
    puts("添加成功");
}

void show_all(void)
{
    if (count == 0) { puts("暂无数据"); return; }
    printf("%-8s %-10s %6s %6s %6s %8s\n",
           "学号", "姓名", "语文", "数学", "英语", "平均分");
    for (int i = 0; i < count; i++)
        printf("%-8d %-10s %6.1f %6.1f %6.1f %8.2f\n", list[i].id, list[i].name,
               list[i].c, list[i].math, list[i].eng, average(&list[i]));
}

void save(void)
{
    FILE *fp = fopen(FILE_NAME, "w");
    if (fp == NULL) { puts("保存失败"); return; }
    for (int i = 0; i < count; i++)
        fprintf(fp, "%d %s %.1f %.1f %.1f\n", list[i].id, list[i].name,
                list[i].c, list[i].math, list[i].eng);
    fclose(fp);
    printf("已保存 %d 条记录到 %s\n", count, FILE_NAME);
}

void load(void)
{
    FILE *fp = fopen(FILE_NAME, "r");
    if (fp == NULL) { puts("文件不存在"); return; }
    count = 0;
    while (count < MAX &&
           fscanf(fp, "%d %s %lf %lf %lf", &list[count].id, list[count].name,
                  &list[count].c, &list[count].math, &list[count].eng) == 5)
        count++;
    fclose(fp);
    printf("已读取 %d 条记录\n", count);
}

int main(void)
{
    int choice;

    for (;;) {
        printf("\n=== 学生成绩管理 ===\n");
        printf("1.添加 2.显示 3.保存 4.读取 0.退出\n请选择: ");

        if (scanf("%d", &choice) != 1) break;

        switch (choice) {
            case 1: add_student(); break;
            case 2: show_all();    break;
            case 3: save();        break;
            case 4: load();        break;
            case 0: puts("再见！"); return 0;
            default: puts("无效选项，请重新输入");
        }
    }
    return 0;
}`,
      solutionNote: "这个项目几乎用到了全书所有知识点：结构体（第 11 章）、数组（第 7 章）、函数（第 8 章）、指针与 const（第 9 章）、循环与 switch（第 5、6 章）、文件（本章）。建议继续扩展功能：按平均分排序、删除记录、查找学生、统计不及格人数。"
    }
  ],
  quiz: [
    {
      q: '用 fopen("data.txt", "w") 打开一个已有内容的文件，会发生什么？',
      opts: [
        "在原内容后面追加",
        "打开失败",
        "原有内容被清空，文件从头开始写",
        "只读打开，不能写入"
      ],
      answer: 2,
      explain: "w 模式会清空文件（不存在则新建）。要保留原数据请用 a（追加）或先读出来再写。"
    },
    {
      q: "fopen 返回 NULL 说明？",
      opts: [
        "文件为空",
        "文件打开失败（不存在、无权限、路径错误等），必须处理否则后续操作会崩溃",
        "文件已读完",
        "一切正常"
      ],
      answer: 1,
      explain: "标准写法是 if (fp == NULL) { 提示并 return; }，否则对 NULL 调用 fprintf/fgets 会导致崩溃。"
    },
    {
      q: "逐行读取整个文件的推荐写法是？",
      opts: [
        "while (!feof(fp)) { fgets(line, sizeof(line), fp); }",
        "while (fgets(line, sizeof(line), fp) != NULL) { ... }",
        "for (int i = 0; i < 100; i++) fgets(...)",
        "fgets 只能读一次，必须用 fread"
      ],
      answer: 1,
      explain: "用返回值判断最可靠。feof 只有在读操作之后才有效，while (!feof) 会造成最后一行被处理两次。"
    },
    {
      q: "fclose(fp) 的作用不包括？",
      opts: [
        "把缓冲区里还没写盘的数据真正写入文件",
        "释放该文件相关的资源",
        "防止文件句柄泄漏",
        "删除文件"
      ],
      answer: 3,
      explain: "fclose 负责刷新缓冲并释放资源，不会删除文件；写程序时忘关文件可能导致数据没保存。"
    },
    {
      q: "关于 fprintf 和 printf，说法正确的是？",
      opts: [
        "fprintf 不能使用 %d 之类的格式符",
        "fprintf 的第一个参数是文件指针，其余用法与 printf 相同",
        "printf 可以写文件，fprintf 只能打印屏",
        "两者完全一样"
      ],
      answer: 1,
      explain: "fprintf(fp, \"%d\\n\", n) 就是「向 fp 指向的文件做 printf」。fscanf 与 scanf 的关系同理。"
    }
  ]
});
