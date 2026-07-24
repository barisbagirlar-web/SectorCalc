#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { canonicalUrls } from './seo-registry.mjs';

const urls = canonicalUrls();
const unique = new Set(urls);
if (unique.size !== urls.length) {
  throw new Error('[SEO] duplicate canonical URL in registry');
}

const body = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((url) => `  <url><loc>${url.replace(/&/g, '&amp;')}</loc></url>`),
  '</urlset>',
  ''
].join('\n');

writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), body, 'utf8');
console.log(`[PASS] sitemap generated: ${urls.length} canonical URLs`);
