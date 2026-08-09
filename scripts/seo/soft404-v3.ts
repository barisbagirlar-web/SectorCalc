#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { sitemapPages } from '../../seo/registry.mjs';

const root = process.cwd();
const distMode = process.argv.includes('--dist');
const baseDir = distMode ? path.join(root, 'dist') : root;
const risks: string[] = [];

for (const page of sitemapPages()) {
  const source = page.sourceFile || (page.canonicalPath === '/' ? 'index.html' : `${page.canonicalPath.replace(/^\//, '')}.html`);
  const file = path.join(baseDir, source);
  if (!fs.existsSync(file)) continue; // pretty rewrites may be produced from a different sourceFile.
  const html = fs.readFileSync(file, 'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (/\b(page not found|not found|no results)\b/i.test(text.slice(0, 1200))) risks.push(`${page.canonicalPath}: soft-404 phrase`);
  if (text.length < 120) risks.push(`${page.canonicalPath}: unusually thin visible text (${text.length})`);
}

if (risks.length) {
  console.error('[FAIL] soft-404 risks\n' + risks.map((x) => ` - ${x}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] soft-404 static detector routes=${sitemapPages().length} mode=${distMode ? 'dist' : 'source'}`);
