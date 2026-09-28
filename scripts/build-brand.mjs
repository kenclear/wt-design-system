#!/usr/bin/env node
/**
 * 从 brand/icon/icon.svg（叶片主资产）+ brand/logo/_text-paths.svg（字标文字）
 * 拼出全部 logo 派生物：横版 / 竖版字标 SVG，黑白单色 SVG，以及对应的 PNG、PDF。
 *
 * 为什么要这一步：叶片换过一次（2026-09 起为渐变版），而 .ai 源文件里的字标还是
 * 旧叶子。与其手工在 Illustrator 里逐个替换，不如让「叶片 + 文字」的组合规则写成
 * 代码 —— 下次叶片再改，重跑一遍即可。设计师从 .ai 导出正式字标后，可直接覆盖
 * 产物，并停用本脚本的对应部分。
 *
 * 排布规则：新叶片高度 = 旧叶片高度，横版右缘贴旧叶片右缘（与文字的间隙不变），
 * 竖版水平居中于旧叶片位置。旧叶片的位置实测自官方 1.1.0 导出。
 *
 * 位图与 PDF 用本机 Chrome 无头渲染（macOS 默认路径，可用 CHROME 环境变量覆盖）。
 *
 * 用法：npm run build:brand
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brand = (p) => join(root, 'brand', p);
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const BLUE = '#003A89';

// ---------- 读源 ----------

const icon = readFileSync(brand('icon/icon.svg'), 'utf8');
const iconInner = icon.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
  .replace(/<title[^>]*>[\s\S]*?<\/title>/, '');
const leafD = icon.match(/<path id="wt-leaf" d="([^"]+)"/)[1];
// 叶片在 icon.svg（1254² 画布）里的实际边界，含叶柄
const LEAF = { x: 110, y: 123, w: 986, h: 984.88 };

const text = readFileSync(brand('logo/_text-paths.svg'), 'utf8')
  .replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();

// ---------- 排布 ----------

/** 把叶片放进目标框：高度 = h，给出左上角 */
const place = (x, y, h) => {
  const s = h / LEAF.h;
  return { t: `translate(${r(x)},${r(y)}) scale(${r(s, 6)}) translate(${-LEAF.x},${-LEAF.y})`, w: LEAF.w * s };
};
const r = (v, d = 2) => +v.toFixed(d);

// 旧叶片实测：横版 (223.2, 622.57)–(461, 877.51)，竖版 (190.89, 0)–(570.2, 406.61)
const LAND_H = 877.51 - 622.57;
const landLeaf = place(461 - LEAF.w * (LAND_H / LEAF.h), 622.57, LAND_H);
const PORT_H = 406.61;
const portLeaf = place(380.545 - (LEAF.w * (PORT_H / LEAF.h)) / 2, 0, PORT_H);

const layouts = {
  landscape: {
    // 画布裁到内容边界（原 Illustrator 导出是 1500² 画板，四周大片空白，锁高度时字标会缩成一小块）
    crop: { x: r(461 - landLeaf.w), y: 622.57, w: r(1276.81 - (461 - landLeaf.w)), h: r(LAND_H) },
    scale: 4390 / (1276.81 - 223.2), // 与 1.1.0 PNG 同一像素密度
    leaf: landLeaf.t,
    text: '',
  },
  portrait: {
    crop: { x: 0, y: 0, w: 761.1, h: 590.3 },
    scale: 5408 / 761.1,
    leaf: portLeaf.t,
    text: 'translate(-515.70,-225.12)',
  },
};

// ---------- 生成 SVG ----------

const header = (title, note) =>
  `<?xml version="1.0" encoding="utf-8"?>\n<!-- ${title}\n     由 scripts/build-brand.mjs 生成，不要手改。${note} -->\n`;

const leafColor = (t) => `<g transform="${t}">${iconInner}</g>`;
const leafMono = (t, fill) => `<g transform="${t}"><path fill="${fill}" d="${leafD}"/></g>`;
const textG = (t, fill) => `<g fill="${fill}"${t ? ` transform="${t}"` : ''}>\n${text}\n</g>`;

const svgs = {};
for (const L of Object.values(layouts)) L.viewBox = `${L.crop.x} ${L.crop.y} ${L.crop.w} ${L.crop.h}`;
for (const [name, L] of Object.entries(layouts)) {
  const open = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="${L.viewBox}" role="img" aria-label="梧桐小讲堂">\n`;
  svgs[`logo/wordmark-${name}.svg`] = header(`梧桐小讲堂 · ${name === 'landscape' ? '横版' : '竖版'}字标`, '')
    + open + leafColor(L.leaf) + '\n' + textG(L.text, BLUE) + '\n</svg>\n';
  for (const [v, c] of [['black', '#000000'], ['white', '#FFFFFF']]) {
    svgs[`logo/wordmark-${name}-${v}.svg`] = header(`梧桐小讲堂 · ${name === 'landscape' ? '横版' : '竖版'}字标 · 单色${v === 'black' ? '黑' : '白'}`, '\n     单色版叶片为整片剪影：渐变色块无法拆成单色层次。')
      + open + leafMono(L.leaf, c) + '\n' + textG(L.text, c) + '\n</svg>\n';
  }
}
for (const [v, c] of [['black', '#000000'], ['white', '#FFFFFF']]) {
  svgs[`icon/icon-${v}.svg`] = header(`梧桐小讲堂 · 纯图标 · 单色${v === 'black' ? '黑' : '白'}`, '\n     叶片整片剪影，画布与 icon.svg 相同（1254²，含留白）。')
    + `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254" role="img" aria-label="梧桐小讲堂"><path fill="${c}" d="${leafD}"/></svg>\n`;
}
for (const [p, s] of Object.entries(svgs)) writeFileSync(brand(p), s);

// ---------- 位图 + PDF ----------

const tmp = mkdtempSync(join(tmpdir(), 'wt-brand-'));
const chrome = (args) => execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', ...args], { stdio: 'ignore' });

/** 把某个 SVG 按裁切框渲染成 PNG 或 PDF */
const render = (svgPath, crop, scale, out, kind) => {
  const W = Math.round(crop.w * scale), H = Math.round(crop.h * scale);
  const body = readFileSync(brand(svgPath), 'utf8').replace(/<\?xml[^>]*>/, '')
    .replace(/viewBox="[^"]+"/, `viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" width="${W}" height="${H}"`);
  const page = join(tmp, 'page.html');
  writeFileSync(page, `<!doctype html><style>@page{size:${W}px ${H}px;margin:0}html,body{margin:0;background:transparent}svg{display:block}</style>${body}`);
  if (kind === 'png') {
    chrome(['--default-background-color=00000000', `--window-size=${W},${H}`, `--screenshot=${brand(out)}`, pathToFileURL(page).href]);
  } else {
    chrome(['--no-pdf-header-footer', `--print-to-pdf=${brand(out)}`, pathToFileURL(page).href]);
  }
};

for (const [name, L] of Object.entries(layouts)) {
  for (const v of ['', '-black', '-white']) {
    render(`logo/wordmark-${name}${v}.svg`, L.crop, L.scale, `logo/wordmark-${name}${v}.png`, 'png');
  }
  // PDF 用 pt 尺寸：内容边界 1 单位 = 1px
  render(`logo/wordmark-${name}.svg`, L.crop, 1, `logo/wordmark-${name}.pdf`, 'pdf');
}
const ICON = { x: 0, y: 0, w: 1254, h: 1254 };
render('icon/icon.svg', ICON, 2048 / 1254, 'icon/icon.png', 'png');
render('icon/icon-black.svg', ICON, 2048 / 1254, 'icon/icon-black.png', 'png');
render('icon/icon-white.svg', ICON, 2048 / 1254, 'icon/icon-white.png', 'png');
render('icon/icon.svg', ICON, 1, 'icon/icon.pdf', 'pdf');

rmSync(tmp, { recursive: true });
console.log(`✓ ${Object.keys(svgs).length} 个 SVG，12 个 PNG，3 个 PDF`);
