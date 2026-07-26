#!/usr/bin/env node
// 部署前的靜態檢查（CI 會先跑這支，過了才發佈）。
// 這是純靜態網站、沒有 build step，所以壞掉的連結或漏翻的字串不會有人幫你抓——這支負責抓。
//
//   1. 內部連結與資源（href/src）指到的檔案真的存在
//   2. HTML 用到的每個 data-i18n 鍵，zh 與 en 字典都有（漏一邊會顯示成另一種語言）
//   3. data-lang-only 只允許 zh / en
//   4. 每頁都有引入 i18n.js 與語言切換按鈕
//
//   node scripts/check-site.mjs

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);

const htmlFiles = readdirSync(ROOT).filter((f) => f.endsWith('.html'));
if (htmlFiles.length === 0) fail('.', '找不到任何 HTML 檔');

// ---- 取出 i18n.js 的字典（純物件字面值，直接求值即可） ----------------------
const i18nSource = readFileSync(join(ROOT, 'i18n.js'), 'utf8');
const start = i18nSource.indexOf('var DICT = ');
const end = i18nSource.indexOf('var HTML_LANG');
if (start < 0 || end < 0 || end < start) {
  console.error('i18n.js: 找不到 DICT 物件（結構被改過？請同步更新這支檢查腳本）');
  process.exit(1);
}
const dictLiteral = i18nSource.slice(start + 'var DICT = '.length, end).trim().replace(/;$/, '');
// eslint-disable-next-line no-new-func
const DICT = new Function(`return ${dictLiteral}`)();
const LANGS = ['zh', 'en'];
for (const lang of LANGS) {
  if (!DICT[lang]) {
    console.error(`i18n.js: 字典缺少 ${lang}`);
    process.exit(1);
  }
}

// zh 與 en 的鍵必須一一對應，否則切語言會留下上一種語言的字。
const zhKeys = new Set(Object.keys(DICT.zh));
const enKeys = new Set(Object.keys(DICT.en));
for (const key of zhKeys) if (!enKeys.has(key)) fail('i18n.js', `en 字典缺少鍵 ${key}`);
for (const key of enKeys) if (!zhKeys.has(key)) fail('i18n.js', `zh 字典缺少鍵 ${key}`);

// ---- 逐頁檢查 --------------------------------------------------------------
for (const file of htmlFiles) {
  const html = readFileSync(join(ROOT, file), 'utf8');

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(target)) continue;
    const path = target.split(/[?#]/)[0];
    if (!existsSync(join(ROOT, path))) fail(file, `連結指向不存在的檔案：${target}`);
  }

  for (const match of html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) {
    const key = match[1];
    for (const lang of LANGS) {
      if (!(key in DICT[lang])) fail(file, `${lang} 字典缺少 data-i18n 鍵：${key}`);
    }
  }

  for (const match of html.matchAll(/data-lang-only="([^"]+)"/g)) {
    if (!LANGS.includes(match[1])) fail(file, `data-lang-only 值不合法：${match[1]}`);
  }

  if (!html.includes('i18n.js')) fail(file, '沒有引入 i18n.js，語言切換會失效');
  if (!html.includes('lang-switch')) fail(file, '沒有語言切換按鈕');
  if (!/<title/.test(html)) fail(file, '缺少 <title>');
  if (!/<meta name="viewport"/.test(html)) fail(file, '缺少 viewport meta，手機上會爆版');
}

// ---- 結果 ------------------------------------------------------------------
if (errors.length) {
  console.error(`✗ 檢查未通過（${errors.length} 項）：`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ 檢查通過：${htmlFiles.length} 個頁面、${zhKeys.size} 組雙語字串`);
