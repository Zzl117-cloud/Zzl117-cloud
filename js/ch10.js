/* 第 10 章：字符串 */
window.COURSE = window.COURSE || { chapters: [], examExtra: [] };

COURSE.chapters.push({
  id: "ch10",
  group: "第四阶段 · 处理真实数据",
  level: "进阶",
  emoji: "🔤",
  title: "字符串：C 里最容易被坑的地方",
  lead: "C 没有 String 类型，字符串其实是「以 \\0 结尾的字符数组」，理解这一点就不会踩坑。",
  tags: ["字符数组", "\\0", "string.h", "fgets"],
  minutes: 40,
  summary: `
<h2>1. 字符串的本质</h2>
<p>C 语言没有专门的字符串类型：<strong>字符串就是以 <code>\\0</code>（空字符）结尾的字符数组</strong>。<code>\\0</code> 是结束标志，printf、strlen 都靠它判断字符串到哪里结束。</p>
<pre>char s1[] = "hello";            /* 长度 6：h e l l o \\0 */
char s2[10] = "hi";             /* 剩余位置自动补 0 */
char s3[]  = {'h','i','\\0'};    /* 与 s2 内容相同的手写形式 */
char *s4   = "hello";           /* 指向字符串常量，内容只读，不能改！ */</pre>
<div class="callout warn"><span class="ico">⚠️</span><div class="body"><p>忘记 <code>\\0</code> 就会出现「乱码」或读到数组外的垃圾数据。声明时留足空间：存 <code>n</code> 个字符的字符串，数组至少要 <code>n + 1</code> 个字节。</p></div></div>

<h2>2. 输出与遍历</h2>
<pre>printf("%s\\n", s);                     /* 输出整个字符串 */
puts(s);                              /* 输出并自动换行 */

for (int i = 0; s[i] != '\\0'; i++)     /* 不依赖 strlen 的遍历写法 */
    putchar(s[i]);</pre>

<h2>3. string.h 常用函数</h2>
<table>
  <tr><th>函数</th><th>作用</th><th>示例</th></tr>
  <tr><td><code>strlen(s)</code></td><td>求长度（不含 \\0）</td><td>strlen("abc") == 3</td></tr>
  <tr><td><code>strcpy(d, s)</code></td><td>复制字符串（d 要够大）</td><td>strcpy(dst, "hi")</td></tr>
  <tr><td><code>strncpy(d, s, n)</code></td><td>最多复制 n 个字符，更安全</td><td>strncpy(dst, src, 9)</td></tr>
  <tr><td><code>strcat(d, s)</code></td><td>把 s 拼接到 d 后面</td><td>strcat(msg, "!")</td></tr>
  <tr><td><code>strcmp(a, b)</code></td><td>比较大小：0 相等，&lt;0 前者小，&gt;0 前者大</td><td>if (strcmp(a,b) == 0)</td></tr>
  <tr><td><code>strchr(s, c)</code></td><td>查找字符，返回首次出现的指针</td><td>strchr(s, '@')</td></tr>
  <tr><td><code>strstr(a, b)</code></td><td>查找子串</td><td>strstr(url, "http")</td></tr>
</table>
<div class="callout danger"><span class="ico">🚫</span><div class="body"><p>两个最基本的禁忌：<strong>字符串不能用 <code>=</code> 赋值</strong>（要用 strcpy），<strong>不能用 <code>==</code> 比较</strong>（要用 strcmp）。<code>if (s1 == s2)</code> 比较的是地址，不是内容。</p></div></div>

<h2>4. 手动实现 strlen / strcpy（理解原理）</h2>
<pre>int my_strlen(const char *s) {
    int n = 0;
    while (s[n] != '\\0') n++;      /* 或 while (*s++) n++; */
    return n;
}

void my_strcpy(char *dst, const char *src) {
    int i = 0;
    while ((dst[i] = src[i]) != '\\0') i++;   /* 连 \\0 一起复制 */
}</pre>

<h2>5. 读入一整行：fgets 才是安全选择</h2>
<pre>char line[100];
if (fgets(line, sizeof(line), stdin) != NULL) {
    line[strcspn(line, "\\n")] = '\\0';    /* 去掉末尾的换行符 */
    printf("你输入的是: %s\\n", line);
}</pre>
<div class="callout info"><span class="ico">💡</span><div class="body"><p><code>scanf("%s", s)</code> 遇到空格就停，而且不检查长度（可能溢出）；<code>gets()</code> 因为完全不做边界检查已被标准废弃。<strong>读一整行请用 fgets</strong>。</p></div></div>
`,
  examples: [
    {
      name: "string_basic.c",
      note: "区分 strlen 与 sizeof，并手写一次遍历。",
      code: String.raw`#include <stdio.h>
#include <string.h>

int main(void)
{
    char name[50] = "C language";

    printf("内容: %s\n", name);
    printf("strlen = %d （不含结尾的 '\\0'）\n", (int)strlen(name));
    printf("sizeof = %d （数组的总容量）\n", (int)sizeof(name));

    /* 不用 strlen 的遍历：遇到 '\0' 就停 */
    int lower = 0, upper = 0;
    for (int i = 0; name[i] != '\0'; i++) {
        if (name[i] >= 'a' && name[i] <= 'z')      lower++;
        else if (name[i] >= 'A' && name[i] <= 'Z') upper++;
    }
    printf("小写字母 %d 个，大写字母 %d 个\n", lower, upper);
    return 0;
}`,
      output: "内容: C language\nstrlen = 10 （不含结尾的 '\\0'）\nsizeof = 50 （数组的总容量）\n小写字母 9 个，大写字母 1 个"
    },
    {
      name: "string_ops.c",
      note: "string.h 常用函数实战，注意字符串比较必须用 strcmp。",
      code: String.raw`#include <stdio.h>
#include <string.h>

int main(void)
{
    char a[20] = "apple";
    char b[20] = "banana";
    char buf[40];

    printf("strcmp(a, b) = %d （负数表示 a 排在 b 前面）\n", strcmp(a, b));

    strcpy(buf, a);                 /* 复制，不能用 buf = a; */
    strcat(buf, " & ");             /* 拼接 */
    strcat(buf, b);
    printf("拼接结果: %s （长度 %d）\n", buf, (int)strlen(buf));

    if (strcmp(a, "apple") == 0)
        printf("内容相等（必须用 strcmp，不能用 ==）\n");

    char *pos = strchr(b, 'n');     /* 查找字符 */
    printf("'n' 首次出现在下标 %d\n", (int)(pos - b));
    return 0;
}`,
      output: "strcmp(a, b) = -1 （负数表示 a 排在 b 前面）\n拼接结果: apple & banana （长度 14）\n内容相等（必须用 strcmp，不能用 ==）\n'n' 首次出现在下标 2"
    }
  ],
  practice: [
    {
      title: "统计一行文字里某个字符的个数",
      req: "<p>用 <code>fgets</code> 读入一整行文字（含空格），再读入一个字符，统计该字符出现的次数。</p>",
      hint: [
        "fgets 会把换行符也读进来，可以用 strcspn(line, \"\\n\") 找到它并将该位置改成 '\\0'。",
        "读字符时用 \" %c\"（前面有空格）跳过换行残留。",
        "遍历时遇到 '\\0' 停止。"
      ],
      sample: "输入: hello c language\n要统计的字符: l\n'l' 出现了 3 次",
      solution: String.raw`#include <stdio.h>
#include <string.h>

int main(void)
{
    char line[200], ch;
    int cnt = 0;

    printf("请输入一行文字: ");
    if (fgets(line, sizeof(line), stdin) == NULL) return 1;
    line[strcspn(line, "\n")] = '\0';        /* 去掉行尾换行符 */

    printf("要统计的字符: ");
    scanf(" %c", &ch);

    for (int i = 0; line[i] != '\0'; i++)
        if (line[i] == ch) cnt++;

    printf("'%c' 出现了 %d 次\n", ch, cnt);
    return 0;
}`,
      solutionNote: "输入「hello c language」时，字母 l 出现 3 次（he-l-lo c l-anguage）。你还可以试试统计空格、元音字母的个数。"
    },
    {
      title: "判断回文串",
      req: "<p>读入一个字符串，判断它是不是回文（正着读和倒着读一样，如 level、上海自来水来自海上）。</p>",
      hint: [
        "用两个下标：i 从头开始，j 从 strlen(s)-1 开始，向中间靠拢。",
        "只要 s[i] != s[j] 就不是回文。",
        "注意中文字符是多字节的，用英文单词测试最稳妥。"
      ],
      sample: "输入 level\nlevel 是回文\n输入 hello\nhello 不是回文",
      solution: String.raw`#include <stdio.h>
#include <string.h>

int main(void)
{
    char s[100];
    int is_pal = 1;

    printf("请输入一个字符串: ");
    scanf("%99s", s);              /* 限制长度，避免溢出 */

    int i = 0, j = (int)strlen(s) - 1;
    while (i < j) {
        if (s[i] != s[j]) { is_pal = 0; break; }
        i++;  j--;
    }

    printf("%s %s回文\n", s, is_pal ? "是" : "不是");
    return 0;
}`,
      solutionNote: "顺手写一个「反转字符串」的版本吧：把 s[i] 与 s[len-1-i] 交换，遍历到一半即可。"
    }
  ],
  quiz: [
    {
      q: 'char s[] = "abc"; 则 sizeof(s) 和 strlen(s) 分别是？',
      opts: ["3 和 3", "4 和 3", "3 和 4", "4 和 4"],
      answer: 1,
      explain: "字符串常量隐含一个结尾的 '\\0'，所以 sizeof 是 4，而 strlen 只数有效字符 3 个。"
    },
    {
      q: "要比较两个字符串的内容是否相同，应该用？",
      opts: ["if (s1 == s2)", "if (strcmp(s1, s2) == 0)", "if (s1 = s2)", "if (strlen(s1) == strlen(s2))"],
      answer: 1,
      explain: "== 比较的是两个数组的地址，永远不相等（除非同一个数组）；strcmp 返回 0 才表示内容相同。"
    },
    {
      q: "给字符数组赋一个新字符串，正确的写法是？",
      opts: ["s = \"hello\";", "strcpy(s, \"hello\");", "s[] = \"hello\";", "strcmp(s, \"hello\");"],
      answer: 1,
      explain: "数组名是常量地址，不能被赋值，必须用 strcpy（并确保数组够大）。"
    },
    {
      q: "字符串的结束标志是哪个字符？",
      opts: ["'\\n'", "'\\0'", "' '", "'\\t'"],
      answer: 1,
      explain: "'\\0'（ASCII 值为 0 的空字符）是字符串结束标志，所有字符串函数都依赖它。"
    },
    {
      q: 'char s[20]; scanf("%s", s); 输入 "hello world" 后，s 中的内容是？',
      opts: ['"hello world"', '"hello"', '"world"', "读入失败"],
      answer: 1,
      explain: "scanf 的 %s 遇到空白字符（空格、换行）就停止，所以只读到 hello。要读整行请用 fgets。"
    }
  ]
});
