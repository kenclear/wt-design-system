#!/usr/bin/env node
/**
 * 生成「常用包」：日常直接取用的 logo / 图标位图，按底色分文件夹。
 *
 * 为什么要这一步：brand/ 里是主资产（透明底、按规格命名），但日常用得最多的是
 * 「白底的横版 logo」「深色底的白色图标」「社交头像」这类现成图 —— 每次临时去
 * 拼一张，底色、留白都会漂。这里把它们一次性按规则生成，logo 改了重跑即可。
 *
 * 命名：形态-颜色-底色-宽x高（如 横版-彩色-白底-2400x876.png）。形态为 横版 / 竖版 / icon。不带品牌名 ——
 * 整个文件夹都是梧桐小讲堂的；尺寸放最后，在 Finder 里被截断时也还看得见。
 * 矢量文件不标尺寸。
 *
 * 规则：
 *   - 深色底（黑 / 品牌深蓝）一律用白色单色版：彩色叶片的蓝色在深底上看不清。
 *   - 有底色的图出 PNG + JPG（有些平台不收透明图）；透明底只出 PNG。
 *   - 字标四周留白 = 字标高度的 42%（规范下限 40%）。
 *   - icon/ 为 1080² 的方形图标（可作社交头像），叶片缩在画布中央 62% 以内，
 *     裁成圆形也不会切到叶片。
 *
 * 位图用本机 Chrome 无头渲染（可用 CHROME 环境变量覆盖），JPG 由 macOS sips 转换。
 *
 * 用法：npm run build:kit [-- 输出目录]    默认输出到 dist/常用/（不入库）
 */
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brand = (p) => join(root, 'brand', p);
const OUT = resolve(process.argv[2] ?? join(root, 'dist', '常用'));
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const BG = { 白底: '#ffffff', 黑底: '#000000', 深蓝底: '#003a89' };

// 各形态的 SVG 与画布尺寸（viewBox 宽高）
const viewBox = (p) => readFileSync(brand(p), 'utf8').match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const FORMS = {
  横版: { svg: (v) => `logo/wordmark-landscape${v}.svg`, w: 2000 }, // 字标宽 2000px
  竖版: { svg: (v) => `logo/wordmark-portrait${v}.svg`, w: 1600 },
  icon: { svg: (v) => `icon/icon${v}.svg`, w: 1024, square: true }, // icon.svg 自带留白
};
const VARIANT = { 彩色: '', 黑色: '-black', 白色: '-white' };

const tmp = mkdtempSync(join(tmpdir(), 'wt-kit-'));
let count = 0;

/** 渲染一张图：svg 放在 W×H 画布中央，宽 w。bg 为空则透明。 */
const render = (svgRel, W, H, w, bg, outPng) => {
  const page = join(tmp, 'page.html');
  writeFileSync(page, `<!doctype html><style>html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:${bg ?? 'transparent'}}
img{position:absolute;left:${(W - w) / 2}px;top:50%;transform:translateY(-50%);width:${w}px}</style>
<img src="${pathToFileURL(brand(svgRel)).href}">`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--default-background-color=00000000', `--window-size=${W},${H}`, `--screenshot=${outPng}`, pathToFileURL(page).href], { stdio: 'ignore' });
  count++;
};
const toJpg = (png) => {
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '90', png, '--out', png.replace(/\.png$/, '.jpg')], { stdio: 'ignore' });
  count++;
};

/** 按形态算画布：字标加 42% 高度的留白，图标用自身正方形画布 */
const canvas = (form) => {
  const f = FORMS[form];
  if (f.square) return { W: f.w, H: f.w, w: f.w };
  const [, , vw, vh] = viewBox(f.svg(''));
  const h = Math.round(f.w * vh / vw), pad = Math.round(h * 0.42);
  return { W: f.w + pad * 2, H: h + pad * 2, w: f.w };
};

for (const dir of ['透明底', ...Object.keys(BG), 'icon', '矢量']) mkdirSync(join(OUT, dir), { recursive: true });

// 透明底：三形态 × 三色
for (const form of Object.keys(FORMS)) {
  const { W, H, w } = canvas(form);
  for (const [color, v] of Object.entries(VARIANT)) {
    render(FORMS[form].svg(v), W, H, w, null, join(OUT, '透明底', `${form}-${color}-透明底-${W}x${H}.png`));
  }
}

// 有底色：白底配彩色，深色底配白色
for (const [bgName, bg] of Object.entries(BG)) {
  const color = bgName === '白底' ? '彩色' : '白色';
  for (const form of Object.keys(FORMS)) {
    const { W, H, w } = canvas(form);
    const png = join(OUT, bgName, `${form}-${color}-${bgName}-${W}x${H}.png`);
    render(FORMS[form].svg(VARIANT[color]), W, H, w, bg, png);
    toJpg(png);
  }
}

// icon：1080²，图标画布（1254²，叶片占约 79%）缩到 830px，叶片约占画布 62%
for (const [bgName, color] of [['白底', '彩色'], ['深蓝底', '白色']]) {
  const png = join(OUT, 'icon', `icon-${color}-${bgName}-1080x1080.png`);
  render(FORMS.icon.svg(VARIANT[color]), 1080, 1080, 830, BG[bgName], png);
  toJpg(png);
}

// 矢量：主资产的副本，换成中文名
for (const [form, base] of [['横版', 'logo/wordmark-landscape'], ['竖版', 'logo/wordmark-portrait'], ['icon', 'icon/icon']]) {
  for (const ext of ['svg', 'pdf']) {
    copyFileSync(brand(`${base}.${ext}`), join(OUT, '矢量', `${form}-彩色.${ext}`));
    count++;
  }
}

rmSync(tmp, { recursive: true });
console.log(`✓ 常用包 ${count} 个文件 → ${OUT}`);
