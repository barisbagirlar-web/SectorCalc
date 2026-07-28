#!/usr/bin/env node
/**
 * Homepage title-block footer must stay a finished DWG sheet:
 * brand mark present, Trust/legal SSOT links, no empty brand shell.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

const indexPath = join(ROOT, 'index.html');
if (!existsSync(indexPath)) fail('index.html missing');
const html = readFileSync(indexPath, 'utf8');

const footer = html.match(/<footer\s+class="title-block"[^>]*>[\s\S]*?<\/footer>/i)?.[0] || '';
if (!footer) fail('homepage missing <footer class="title-block">');

if (!/class="brand"[^>]*>[\s\S]*?<img[^>]+class="[^"]*logo-light/i.test(footer)) {
  fail('title-block footer brand must include logo-light image (empty brand shell banned)');
}
if (!/logo-dark/i.test(footer)) {
  fail('title-block footer brand must include logo-dark for theme parity');
}
if (/<a href="\/" class="brand"[^>]*>\s*<\/a>/i.test(footer)) {
  fail('title-block footer still has empty brand anchor');
}

const requiredHrefs = [
  '/tools.html',
  '/pricing.html',
  '/guides',
  '/glossary',
  '/about',
  '/contact',
  '/case-studies',
  '/security',
  '/status',
  '/privacy',
  '/terms',
  '/refund',
  '#prove',
];
for (const href of requiredHrefs) {
  const re = new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`);
  if (!re.test(footer)) fail(`title-block footer missing required link: ${href}`);
}

if (!/aria-label="Legal and trust"/i.test(footer)) {
  fail('title-block footer Trust nav must expose aria-label="Legal and trust"');
}
if (!/tb-grid/i.test(footer) || !/SC-HOME-001/i.test(footer)) {
  fail('title-block footer must keep DWG title-block meta (tb-grid / SC-HOME-001)');
}
if (!/Engineering preview/i.test(footer)) {
  fail('title-block footer missing engineering preview disclaimer');
}

// Parity with content/partials/site-footer.html trust set
const partialPath = join(ROOT, 'content/partials/site-footer.html');
if (existsSync(partialPath)) {
  const partial = readFileSync(partialPath, 'utf8');
  const trustLinks = [...partial.matchAll(/href="(\/[^"]+)"/g)].map((m) => m[1]);
  for (const href of trustLinks) {
    if (!footer.includes(`href="${href}"`)) {
      fail(`title-block Trust column missing site-footer SSOT link: ${href}`);
    }
  }
}

if (errors.length) {
  console.error('[FAIL] Home title-block footer guard:');
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}
console.log(
  '[PASS] Home title-block footer: brand mark, Trust SSOT, DWG meta, engineering disclaimer',
);
