# 品牌资产

logo、图标、favicon、照片。所有尺寸和留白数值都是从 wutong.org 线上实测的。

---

## 色板与 icon 的关系

**色板是品牌标准色的权威来源，icon 用渐变来表现它。** 2026-09 起叶片换成渐变版
（左蓝右红、多层色面），渐变里的每一个色值都只属于 icon，不进色板。需要品牌蓝、
品牌红的地方一律取令牌，不要从 icon 吸色。

| 标准色 | 在 logo 里 | 对应令牌 |
|---|---|---|
| `#003a89` | 字标文字；叶片蓝色渐变（`#04347f`–`#073a8a`）的中心色调 | `--color-jacksons-purple`（主色） |
| `#e63946` | 叶片红色渐变（`#e9232d`–`#ff432e`）更饱和，不取代它 | `--color-punch` |
| `#457b9d` | 不再出现（叶柄已改为蓝色） | `--color-steel`，保留为 UI 辅助色 |

三条色阶按系统统一的步长展开（浅三档混白 89.8 / 79.7 / 29.9%，深三档乘
0.797 / 0.399 / 0.297）。

**⚠ 派生规则：** 白字压 `#e63946` 只有 4.17:1，过不了 AA。因此语义别名
`--color-error` 指向 `punch-dark #b72d38`（6.09:1）。基色本身只作图形填充。

`#457b9d` / `#e63946` / `#a8dadc` 是一套成组的配色，`--color-aqua-island`
即其中的 `#a8dadc`。

---

## 纯图标 — 主资产

`icon/icon.svg` 是整套品牌资产的**源头**：只有叶片，用于头像、应用图标、需要
正方形且不放文字的地方。横版、竖版字标都由它拼出来（见下）。

| 文件 | 用途 |
|---|---|
| `icon/icon.svg` | **主资产。** 矢量，真实贝塞尔路径 + 线性渐变，非内嵌位图 |
| `icon/icon.pdf` | 印刷，矢量，渐变保留为原生渐变 |
| `icon/icon.png` | 2048² 位图 |
| `icon/icon-black.svg` / `.png` | 单色黑，整片剪影 |
| `icon/icon-white.svg` / `.png` | 单色白，整片剪影 —— **深底用这个** |
| `icon/png/icon-{16…2048}.png` | 14 档透明 PNG，按显示尺寸取，高密度屏取 2 倍 |
| `icon/webp/icon-{128…2048}.webp` | 5 档无损透明 WebP |
| `icon/_source-raster.png` | 精修原图（位图），SVG 据此重建；仅作比对参考 |

画布 1254 × 1254，**自带留白**（叶片约占 79%）。所有尺寸留白一致，不要裁切、
拉伸或再旋转。SVG 内所有 id 带 `wt-` 前缀，内联进页面时不会与别的 SVG 冲突。

- **深底：** 彩色叶片的蓝色部分在深底上对比度不足（压 `#0b1220` 仅 1.77:1），
  用 `-white` 或白底应用图标。
- **小尺寸：** 16–32px 下色面细节自然合并，轮廓仍可辨认，未另做简化版。
- **单色版：** 渐变色块拆不成单色层次，单色版是叶片外轮廓的整片剪影。

---

## Logo

横版、竖版都由 `npm run build:brand`（`scripts/build-brand.mjs`）生成：
`icon/icon.svg` 的叶片 + `logo/_text-paths.svg` 的字标文字。**不要手改产物。**
叶片换了就重跑一遍，SVG / PNG / PDF 与黑白变体全部重新生成。

排布沿用上一版官方字标实测的位置：新叶片高度 = 旧叶片高度；横版右缘贴旧叶片右缘，
与文字的间隙不变；竖版叶片水平居中。

**这就是正式字标，没有别的源文件。** 要改 logo，改 `icon/icon.svg`（或
`_text-paths.svg`）再重跑脚本；不需要 Illustrator。

### 横版 — 页头、名片、视频片头

| 文件 | 用途 |
|---|---|
| `logo/wordmark-landscape.svg` | **主资产。** 矢量，画布贴合内容（1071 × 255） |
| `logo/wordmark-landscape.pdf` | 印刷 |
| `logo/wordmark-landscape.png` | 位图导出，4463 × 1062 |
| `logo/wordmark-landscape-black.svg` / `.png` | 单色黑 —— 浅底、单色印刷 |
| `logo/wordmark-landscape-white.svg` / `.png` | 单色白 —— **深底用这个** |

### 竖版 — 头像、方形版位、印刷封面

`logo/wordmark-portrait.svg` 是主资产（761.1 × 590.3），另有 `.pdf` / `.png` +
`-black` / `-white` 的 SVG 与 PNG。叶片在上、文字在下。

### 字标文字

`logo/_text-paths.svg` 是「梧桐小讲堂」五个字的路径，逐字取自官方 Illustrator
导出的横版字标（1.1.0）。它是生成字标的输入，不单独使用。

### 站点当前在用的导出品

带 `_` 前缀的两个是**派生物**，不是主资产：

- `logo/_site-header-export.png` — 页头在用的 2560×619 PNG
- `logo/_site-footer-export.webp` — 页脚曾用的浮雕锁形

⚠ **这两个都是旧叶子，已停用**，仅作存档。站点页头、页脚自 1.3.0 起都用
`wordmark-landscape.svg`，页脚不再用浮雕效果。

**字标必须走矢量。** 不要把大尺寸 PNG 缩到几十像素高显示。

### 站上的实测尺寸

| | |
|---|---|
| 页头字标渲染 | **168 × 40 px**，高度令牌 `--spacing-logo` = `2.5rem` |
| 页脚字标渲染 | **252 × 60 px**，高度令牌 `--spacing-logo-footer` = `3.75rem` |
| 页头左侧留白 | 页面 gutter 5%（1500px 视口下约 75px） |
| 页头上下余量 | header 73px − 字标 40px = 上下各 16px |
| 页脚 hover | 上浮 4px、500ms，不加阴影 |

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
| `favicon/favicon.ico` | 16/32/48 | 老浏览器回退 |
| `favicon/favicon-16.png` / `-32` / `-48` | 16–48 | PNG 回退 |
| `favicon/apple-touch-icon.png` | 180，白底 | iOS 主屏，不预裁圆角 |
| `favicon/android-chrome-192x192.png` | 192，白底 | PWA |
| `favicon/android-chrome-512x512.png` | 512，白底 | PWA |
| `favicon/app-icon-1024.png` | 1024，白底 | 应用商店等大图 |
| `favicon/site.webmanifest` | — | 示例清单，引用 192/512 两张 |

站上 `BaseLayout.astro` 只声明了 SVG 一个：

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

其余文件需要各自的声明才会生效：

```html
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

`site.webmanifest` 的路径相对于清单文件本身，部署时按实际目录调整。PWA 图标声明为
`any`，不是 maskable。

---

## 照片

| 文件 | 尺寸 | 用途 |
|---|---|---|
| `photo/kenny.png` | 567 × 614 | 人物照，关于页 |
| `photo/hero.png` | 600 × 600 | 首页主视觉 |

放进 `ShotFrame` 或圆角容器，圆角走 `--radius-photo`（12px）或 `--radius-full`（头像）。

---

## 源文件

**本仓库的 SVG 就是源文件。** `icon/icon.svg` 是一切的起点，字标由它生成。
SVG 可以在 Figma、Inkscape、Affinity Designer、Illustrator 中打开编辑。

`.ai` 已停用。旧版（三色扁平叶片）的 `.ai` / `.eps` 存档在 Zoho 的
`Marketing/Logo/梧桐小讲堂/存档/`，只作历史参考。

对外交付给 PDF：矢量，渐变保留为原生渐变，印刷厂普遍接受。对方坚持要 `.ai` 的，
把 PDF 的扩展名改成 `.ai`，Illustrator 能正常打开编辑 —— 旧 `.ai` 本来也是
PDF 容器，只是少了 Illustrator 自己的编辑记录。

Zoho 里放一份可直接取用的副本，方便对外发送：

| Zoho `Marketing/Logo/梧桐小讲堂/` | 内容 |
|---|---|
| `icon/` | 纯图标交付包，含 favicon / 应用图标 |
| `logo/` | 横版、竖版字标（SVG / PDF / PNG + 黑白），复制自本仓库 `brand/logo/` |
| `存档/` | 旧版 `.ai` / `.eps` 与历史导出 |

**方向是单向的：仓库 → Zoho。** 改完仓库后把 `brand/logo/` 的新文件复制到 Zoho 的
`logo/`，不要在 Zoho 里直接改。

## 第三方标不在这里

YouTube、哔哩哔哩、Shopify 等是别家公司的商标，不放进 MIT 许可的公开仓库，
文件留在站点的 `src/media/brand/`。站上用它们时有两条规则：

1. **一排并列的品牌图标要统一高度，不是统一宽高。** YouTube 官方标是 800×524 的
   横牌，锁进正方形会渲染成 24×15.7px，比旁边 24×24 的方标矮一截。
2. **非方形的品牌标自己拼一个方块。** 导航下拉里的 YouTube 图标是「品牌红
   `#ff0033` 实底 + 白色播放三角」，不是原始文件 —— 这样三个平台的图标才是同一个轮廓。
