# 梧桐设计系统

梧桐小讲堂（wutong.org）的设计系统。颜色、字号、圆角、间距、组件规格、以及
这些值背后的理由。

**这个仓库是唯一源头。** 任何站点上的样式改动，先改这里，再同步过去。

---

## 目录里有什么

```
tokens/
  core.css        跨站点通用的一切 —— 色阶、语义色、类型标尺、圆角、
                  间距、容器、断点、阴影、动效、装饰层。Tailwind v4 @theme。
  fonts.css       字体声明。站上唯一的网络字体是 Funnel Display（33KB）。
  tokens.json     平台无关导出，给 Figma / Style Dictionary 这类工具读。
                  由脚本生成，不要手改。

brand/
  logo/           横版 / 竖版矢量字标 + pdf/png + 黑白单色变体
  icon/           纯图标形态（只有叶片），含 SVG
  favicon/        favicon.svg + 96/192/512 PNG + apple-touch-icon
  photo/          人物照、首页主视觉
  README.md       尺寸、留白、使用规则 —— 数值都是线上实测的

fonts/            Funnel Display 四个切片 + OFL 许可证。40KB。

docs/
  index.html      完整规范文档（16 节，含组件画廊）。
                  在线版：https://kenclear.github.io/wt-design-system/
  梧桐设计系统.pdf  同一份文档的 A4 打印版，45 页。

scripts/
  build-tokens.mjs  从 core.css 生成 tokens.json
```

## 怎么用

### 网站接入

把 `tokens/core.css` 和 `tokens/fonts.css` 同步到站点，在站点的 `global.css`
里按这个顺序 import：

```css
@import "tailwindcss";
@import "./fonts.css";   /* 必须在 core 之前，--font-heading 才有东西可指 */
@import "./core.css";    /* 设计系统，同步产物，不要在站点里改 */
@import "./site.css";    /* 站点专属的令牌和组件，各站自己维护 */
```

`fonts/` 里的 woff2 放到站点的 `public/fonts/`。

### 改了设计系统之后

```bash
npm run build:tokens     # 重新生成 tokens.json
# 提交，在 CHANGELOG.md 记一行「改了什么 + 为什么」
```

然后到消费方站点执行它的同步命令。

## core 和 site 怎么分

判断标准只有一条：**换一个站还会不会用到。**

| | 归属 |
|---|---|
| 六条色阶、语义别名、类型标尺、圆角、间距、断点、阴影、动效、装饰层 | `core.css` |
| 某一页专属的令牌和组件（工具卡、筛选 chip、某个导航项的底色） | 各站的 `site.css` |

`core.css` 不该出现任何只有一个页面会用的东西。

## 组件画廊

第 12 节把每个组件<b>实际渲染出来</b>，用的全是文档里记录的字面值，没有引用站点样式表 ——
既是样例，也是对规格完整性的验证：画得出来，就说明规格够别的软件照着重建。

覆盖 12 个组件，每个都给出**全部状态的渲染 + 完整参数表 + 可直接复制的 CSS**：

| | |
|---|---|
| 按钮 | 主按钮、次按钮、文字链、工具卡主/次按钮 |
| 控件 | 筛选 chip（4 态）、搜索框 |
| 徽章 | 优惠 pill、首选 pill |
| 卡片 | 工具卡（完整组装）、站内通用卡 |
| 零件 | 段落横线、微标签、logo 方块 |

末尾附「两套按钮体系的区别」对照表 —— 站内和工具页参数不同，不要混用。

## 品牌资产

logo、favicon、照片在 [`brand/`](brand/)，用法规则见 [brand/README.md](brand/README.md)。

**色板以 logo 为准。** 2026-08-31 起主色 `#003a89`、punch `#e63946`、steel `#457b9d`
都直接取自 logo 源文件，取代此前口述的 `#2d3782` / `#d93730`。三条色阶按原有步长
重算，明暗关系不变。详见 [brand/README.md](brand/README.md)。

**三种形态的 SVG 现在都有了** —— 横版（官方导出）、竖版与纯图标（由横版路径重排/
裁切，与官方 PNG 像素比对吻合 99.29%）。深底白版、黑版、favicon 全套齐备。

站点页头目前仍在用 2560px 的 PNG，应换成 `wordmark-landscape.svg`。

YouTube / 哔哩哔哩 / Shopify 等第三方标不在这里 —— 它们是别家公司的商标。

## 三条铁律

这套系统服务的是中文界面，下面三条是用错误换来的，不是通用建议。任何一次
「让它更紧凑一点」的改动，都要先过这三条。

**1. 行高是字号的一部分。** 每一档字号自带行高：正文 `1.75`，标题 `1.3–1.4`。
不要用 `leading-snug` / `leading-tight` 覆盖正文字号——那是拉丁字母的值。同样
一个字框里，中文字的笔画密度是字母的好几倍，行距一压，行与行之间的空隙就没
了，整段灰成一块。紧行距只给两行以内的卡片标题用。

**2. 墨要实。** 正文和次级文字取颜色令牌，绝不用白/墨加透明度。透明度会等比
削薄每一笔，拉丁字母扛得住，中文扛不住。深色底上用
`--color-content-inverse-light`。透明度阶梯是给蒙版、导轨、细线用的。

**3. AA 是地板，不是及格线。** 每个文字颜色要在 `--color-surface`（#ffffff）
和 `--color-surface-alt`（#f6fbfb）**两个底**上都过 4.5:1。只量白底，是当初正文
链接色以 4.45:1 上线到半个站的原因。而且过了比例也不等于可读——上面两条描述
的正是「过了 AA 却读不了」的情况。

完整版见 [docs/index.html](docs/index.html)，含 14 组对比度实测和四个踩过的坑。

## 品牌色板

取自 logo 源文件（`brand/logo/wordmark-landscape.svg`）：

```
#003a89  海军蓝（主色）    #e63946  红        #457b9d  青灰
```

客户提供的九色板，其余仍在用的：

```
#a8dadc  浅青    #eff9fb  淡青底    #a1ec84  浅绿
#f2673f  珊瑚    #f1f4f5  浅灰      #ffffff  白      #00dc82  亮翠绿
```

板外新增一支交互蓝：`#165dfc` / `#0e48d6` / `#e8eefe`。

⚠ **白字压 punch 基色 `#e63946` 只有 4.17:1，过不了 AA。** 所以语义别名
`--color-error` 指向 `punch-dark #b72d38`（6.09:1），基色留作图形填充 ——
它是 logo 的真实颜色，要保留。

## 字体

站上只加载一个网络字体：**Funnel Display**（拉丁展示体，33KB，OFL）。

中文走系统黑体——Mac 苹方、Windows 微软雅黑。`--font-heading` 把
Funnel Display 排在系统栈前面，所以一个中英混排的标题里，「Shopify」「2026」
走展示体，中文整体交给系统字体。靠的是字体栈顺序加各自的字符覆盖范围，不是
手动切分标签。

中文标题曾经加载过网络字体（HarmonyOS Sans SC，后思源黑体），2026-08 取消：
实测一页要下 249.5KB 分片，只为渲染几十个中文字。详见 CHANGELOG。

## 许可

- 令牌、脚本、文档：MIT
- `fonts/` 里的 Funnel Display：SIL Open Font License 1.1（见 `fonts/OFL.txt`）
