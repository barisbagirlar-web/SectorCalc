#!/usr/bin/env node
/**
 * Language gate — enforce English-only file content.
 *
 * FAIL (--strict): any Turkish / non-English letter found -> exit 1.
 * WARN: common Turkish words on word boundaries (informational, non-blocking).
 *
 * Usage:
 *   node scripts/check-language.mjs            # report only
 *   node scripts/check-language.mjs --strict   # exit 1 on hard violation
 *
 * NOTE: This file is self-ignored (it contains the Turkish word list by design).
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();
const STRICT = process.argv.includes('--strict');

// Directories never scanned.
const IGNORE_DIRS = new Set([
  'node_modules', 'dist', 'build', '.git', '.firebase',
  'coverage', 'playwright-report', 'test-results', '.cache',
  'kimi-hero', 'kimi-hiz', 'vendor'
]);

// Files never scanned (generated, binary, or self).
const IGNORE_FILES = new Set([
  'package-lock.json', 'npm-shrinkwrap.json',
  'check-language.mjs' // self: holds the Turkish word list on purpose
]);

const BINARY_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.pdf', '.zip', '.gz', '.mp4', '.mp3'
]);

// HARD violation: Turkish-specific letters. English text never contains these.
const TURKISH_CHARS = /[çÇğĞıİöÖşŞüÜ]/;

// SOFT signal: common Turkish words on word boundaries.
// Words that are also valid English (e.g. "motor") are excluded to cut noise.
const TURKISH_WORDS = [
  'bir', 've', 'için', 'ile', 'bu', 'şu', 'değil', 'yok',
  'oluştur', 'dosya', 'klasör', 'yorum', 'hata', 'çalış', 'ekle', 'sil',
  'kurulum', 'kural', 'talimat', 'hesap', 'araç', 'sayfa',
  'renk', 'yazı', 'metin', 'başlık', 'giriş', 'çıkış', 'sonuç', 'uyarı',
  'doğrula', 'bekle', 'dur', 'geç', 'yap', 'gibi', 'ama', 'veya',
  'daha', 'çok', 'tüm', 'her', 'hiç', 'sonra', 'önce', 'şimdi',
  'evet', 'hayır', 'tamam', 'lütfen', 'iyi', 'kötü', 'büyük', 'küçük',
  'yeni', 'eski', 'kolay', 'zor', 'doğru', 'yanlış', 'kalıcı', 'önlem',
  'saf', 'artık', 'istemiyorum', 'cevap', 'dürüst', 'eksik', 'sapma', 'tarama', 'temiz',
  'dizin', 'uyum', 'işlem', 'yapılır', 'edilir', 'kullanılır', 'gerekir', 'beklenir',
  'görünür', 'dönüşür', 'çevir', 'dosyayı', 'şunu', 'bunu', 'değildir', 'olmalıdır'
];

const wordPattern = new RegExp(`\\b(${TURKISH_WORDS.join('|')})\\b`, 'gi');

const violations = [];
const warnings = [];

function scanFile(absPath) {
  const rel = relative(ROOT, absPath).replace(/\\/g, '/');
  let content;
  try {
    content = readFileSync(absPath, 'utf8');
  } catch {
    return;
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((line, i) => {
    const lineNo = i + 1;

    if (TURKISH_CHARS.test(line)) {
      violations.push({ file: rel, line: lineNo, text: line.trim().slice(0, 120) });
    }

    let m;
    wordPattern.lastIndex = 0;
    while ((m = wordPattern.exec(line)) !== null) {
      warnings.push({ file: rel, line: lineNo, word: m[0], text: line.trim().slice(0, 120) });
    }
  });
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    let st;
    try {
      st = statSync(abs);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      if (!IGNORE_DIRS.has(entry)) walk(abs);
    } else if (st.isFile()) {
      if (IGNORE_FILES.has(entry)) continue;
      if (BINARY_EXT.has(extname(entry).toLowerCase())) continue;
      scanFile(abs);
    }
  }
}

walk(ROOT);

if (violations.length) {
  console.error(`\n[FAIL] Language gate: ${violations.length} non-English character violation(s)\n`);
  for (const v of violations) console.error(`  ${v.file}:${v.line}  ${v.text}`);
}

if (warnings.length) {
  console.warn(`\n[WARN] Language gate: ${warnings.length} possible Turkish word(s) — review\n`);
  for (const w of warnings.slice(0, 50)) {
    console.warn(`  ${w.file}:${w.line}  "${w.word}"  ${w.text}`);
  }
  if (warnings.length > 50) console.warn(`  ... and ${warnings.length - 50} more`);
}

if (!violations.length && !warnings.length) {
  console.log('[PASS] Language gate: no non-English content detected.');
}

if (STRICT && violations.length) {
  console.error('\nStrict mode: failing. Translate the lines above to English.\n');
  process.exit(1);
}

process.exit(0);
