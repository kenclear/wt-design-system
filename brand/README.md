# 品牌资产

logo、图标、favicon、照片。所有尺寸和留白数值都是从 wutong.org 线上实测的。

---

## 色板以 logo 为准

logo 源文件里只有三个颜色，2026-08-31 起它们就是站点色板的权威来源：

| logo 用色 | | 站点令牌 | 此前的值 |
|---|---|---|---|
| `#003a89` | 深蓝（叶片左半 + 全部文字） | `--color-jacksons-purple`（主色） | `#2d3782` |
| `#e63946` | 红（叶片右半） | `--color-punch` | `#d93730` |
| `#457b9d` | 青灰（叶柄） | `--color-steel`（新增整条色阶） | 色板里没有 |

**为什么以 logo 为准：** logo 是品牌里最固定的一环 —— 印刷品、mockup、第三方平台上
都已经在用，改它的代价远大于改 UI。所以 UI 色板从 logo 推导，不是反过来。

三条色阶都按这套设计原有的步长重算（浅三档混白 89.8/79.7/29.9%，深三档乘
0.797/0.399/0.297），明暗关系不变，只有色相位移。

**⚠ 一处连带处理：** 白字压 `#e63946` 只有 4.17:1，过不了 AA（旧的 `#d93730` 是 4.63）。
所以语义别名 `--color-error` 指向 `punch-dark #b72d38`（6.09:1），**基色本身不动** ——
它是 logo 的真实颜色，必须保留。

> 线索：`#457b9d` / `#e63946` / `#a8dadc` 本就是一套成组的配色，而站点的
> `--color-aqua-island` 正好就是 `#a8dadc`。说明 logo 用的是这一套，站点的蓝和红
> 后来漂走了 —— 这次是把它们校回去。

---

## Logo

### 横版 — 页头、名片、视频片头

| 文件 | 用途 |
|---|---|
| `logo/wordmark-landscape.svg` | **主资产。** 矢量，1500×1500 viewBox，三色 |
| `logo/wordmark-landscape.pdf` | 印刷 |
| `logo/wordmark-landscape.png` | 位图导出 |
| `logo/wordmark-landscape-black.png` | 单色黑 —— 浅底、单色印刷 |
| `logo/wordmark-landscape-white.png` | 单色白 —— **深底用这个** |

### 竖版 — 头像、方形版位、印刷封面

`logo/wordmark-portrait.svg` 是主资产，另有 `.pdf` / `.png` + `-black` / `-white` 变体。
叶片在上、文字在下。

**这个 SVG 是拼出来的，不是从 `.ai` 导的**（本机没有矢量转换工具）：路径直接取自
`wordmark-landscape.svg`，逐字未改，只按官方 `wordmark-portrait.png` 实测的比例
重新排布 —— 叶子相对文字放大 1.595 倍、间隙为文字高度的 26.77%。
跟官方 PNG 做过像素比对：**形状吻合 99.29%、颜色吻合 99.92%**，差异全在边缘抗锯齿。
要绝对权威的版本，从 `.ai` 源文件重新导出覆盖它。

### 纯图标 — 无字标形态

`icon/icon.svg` 是主资产，另有 `.pdf` / `.png` + `-black` / `-white`。只有叶片，
用于头像、应用图标、需要正方形且不放文字的地方。

viewBox 紧贴图形（237.8 × 254.94），**没有内建留白** —— 留白由使用方决定。
同样由 landscape SVG 的 `#_x35_` 组裁出，路径逐字未改。

### 站点当前在用的导出品

带 `_` 前缀的两个是**派生物**，不是主资产：

- `logo/_site-header-export.png` — 页头在用的 2560×619 PNG
- `logo/_site-footer-export.webp` — 页脚在用的浮雕锁形

**页头那个应该换成 `wordmark-landscape.svg`。** 现在是把 2560px 宽的 PNG 缩到
165px 显示，矢量才是对的做法。

三种形态现在都有 SVG 了：横版（官方导出）、竖版与纯图标（由横版重排/裁切而来）。

### 站上的实测尺寸

| | |
|---|---|
| 页头字标渲染 | **165 × 40 px**，高度令牌 `--spacing-logo` = `2.5rem` |
| 页脚锁形渲染 | **297 × 120 px**，高度令牌 `--spacing-logo-footer` = `7.5rem` |
| 页头左侧留白 | 页面 gutter 5%（1500px 视口下约 75px） |
| 页头上下余量 | header 73px − 字标 40px = 上下各 16px |
| 页脚 hover | 上浮 4px、亮度 105%、500ms。**不加阴影** —— 投影会让金属质感发闷 |

### 使用规则

1. **不要拉伸。** 锁高度，宽度自适应。
2. **不要改色、不要加描边或阴影。**
3. **留白至少等于字标高度的 40%**（40px 高时约 16px）。
4. **深底用 `-white` 变体**，不要给彩色版加滤镜。
5. 单色场合用 `-black` / `-white`，不要自己去饱和。

---

## Favicon

| 文件 | 尺寸 | 用途 |
|---|---|---|
| `favicon/favicon.svg` | 矢量 | 浏览器标签页。站上唯一声明的那个 |
| `favicon/favicon-96x96.png` | 96 | 传统 favicon 回退 |
| `favicon/apple-touch-icon.png` | — | iOS 主屏 |
| `favicon/web-app-manifest-192x192.png` | 192 | PWA |
| `favicon/web-app-manifest-512x512.png` | 512 | PWA |
| `favicon/favicon-512.png` | 512 | 站点现有导出 |

站上 `BaseLayout.astro` 只声明了 SVG 一个：

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

**其余文件目前不生效** —— 它们在 `public/` 里但没有 `<link>` 指向。要用需要补声明，
PWA 那两个还需要一个 `manifest.json`。

---

## 照片

| 文件 | 尺寸 | 用途 |
|---|---|---|
| `photo/kenny.png` | 567 × 614 | 人物照，关于页 |
| `photo/hero.png` | 600 × 600 | 首页主视觉 |

放进 `ShotFrame` 或圆角容器，圆角走 `--radius-photo`（12px）或 `--radius-full`（头像）。

---

## 源文件不在这里

`.ai` / `.eps` 源文件留在 Zoho 的 `Marketing/Logo/梧桐小讲堂/`，本仓库只收可直接
使用的导出格式。要改 logo 本身，回源文件改，再重新导出到这里。

`.ai` 实际是 PDF 1.5 容器，但本机没有 `pdf2svg` / `mutool` / `inkscape`，所以竖版和
图标的 SVG 是从横版重新组合的（见上）。装了转换工具之后可以从 `.ai` 直接导出覆盖。

## 第三方标不在这里

YouTube、哔哩哔哩、Shopify 等是别家公司的商标，不放进 MIT 许可的公开仓库，
文件留在站点的 `src/media/brand/`。站上用它们时有两条规则：

1. **一排并列的品牌图标要统一高度，不是统一宽高。** YouTube 官方标是 800×524 的
   横牌，锁进正方形会渲染成 24×15.7px，比旁边 24×24 的方标矮一截。
2. **非方形的品牌标自己拼一个方块。** 导航下拉里的 YouTube 图标是「品牌红
   `#ff0033` 实底 + 白色播放三角」，不是原始文件 —— 这样三个平台的图标才是同一个轮廓。
