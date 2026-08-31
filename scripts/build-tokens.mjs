#!/usr/bin/env node
/**
 * 从 tokens/core.css 抽出所有设计令牌，生成 tokens/tokens.json。
 *
 * 为什么要这一步：CSS 只有浏览器读得懂。Figma 的 Tokens 插件、Style
 * Dictionary、以及各种设计系统工具读的是 JSON。这个导出让这套系统能离开
 * 浏览器，而 core.css 仍然是唯一的源 —— JSON 是产物，不要手改。
 *
 * 用法：npm run build:tokens
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, '..', 'tokens', 'core.css'), 'utf8');

// 只取 @theme 块和它前面的 :root（--wt-* 响应式中间量在那里）
const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');

const raw = {};
for (const m of stripped.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
  const [, name, value] = m;
  // 同名重复取最后一个（响应式 --wt-* 的 lg 覆盖）
  (raw[name] ??= []).push(value.trim());
}

/** 把 --color-jacksons-purple-dark 归到 color / jacksons-purple / dark */
const group = (name) => {
  const parts = name.slice(2).split('-');
  const kind = parts.shift();
  return { kind, rest: parts.join('-') || kind };
};

const out = {
  $schema: 'https://design-tokens.github.io/community-group/format/',
  $description:
    '梧桐设计系统核心令牌。由 scripts/build-tokens.mjs 从 tokens/core.css 生成，不要手改。',
  $generated: new Date().toISOString().slice(0, 10),
};

for (const [name, values] of Object.entries(raw)) {
  const { kind, rest } = group(name);
  let type = 'other';
  if (kind === 'color') type = 'color';
  else if (kind === 'shadow') type = 'shadow';
  else if (kind === 'font') type = rest.startsWith('weight-') ? 'fontWeight' : 'fontFamily';
  else if (['text', 'wt', 'radius', 'spacing', 'container', 'breakpoint', 'border', 'tracking'].includes(kind))
    type = 'dimension';
  else if (kind === 'ease') type = 'cubicBezier';

  // var(--x) 转成设计令牌通用的别名写法 {group.name}，工具才认得出这是引用
  const alias = (v) => {
    const m = /^var\(\s*(--[a-z0-9-]+)\s*\)$/.exec(v);
    if (!m) return v;
    const g = group(m[1]);
    return `{${g.kind}.${g.rest}}`;
  };

  const resolved = values.map(alias);
  (out[kind] ??= {})[rest] = {
    $value: resolved.length > 1 ? resolved : resolved[0],
    $type: type,
    ...(resolved.length > 1 ? { $responsive: true } : {}),
  };
}

const target = join(here, '..', 'tokens', 'tokens.json');
writeFileSync(target, JSON.stringify(out, null, 2) + '\n');

const counts = Object.entries(out)
  .filter(([k]) => !k.startsWith('$'))
  .map(([k, v]) => `${k} ${Object.keys(v).length}`)
  .join(' · ');
console.log(`tokens.json 已生成：${counts}`);
