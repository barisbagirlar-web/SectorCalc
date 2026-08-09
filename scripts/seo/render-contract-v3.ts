#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { sitemapPages } from '../../seo/registry.mjs';

export function inspectFirstHtml(html: string, route: string) {
  const errors: string[] = [];
  const required: Array<[string, RegExp]> = [
    ['title', /<title>[^<]+<\/title>/i],
    ['description', /<meta\s+[^>]*name=["']description["'][^>]*>/i],
    ['canonical', /<link\s+[^>]*rel=["']canonical["'][^>]*>/i],
    ['robots', /<meta\s+[^>]*name=["']robots["'][^>]*>/i],
    ['h1', /<h1\b[^>]*>[\s\S]*?<\/h1>/i],
    ['crawlable-link', /<a\s+[^>]*href=["'][^"'#][^"']*["'][^>]*>/i],
    ['json-ld', /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>/i],
  ];
  for (const [name, pattern] of required) if (!pattern.test(html)) errors.push(`${route}: missing ${name} in first HTML`);
  const visible = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (visible.length < 250) errors.push(`${route}: first HTML visible content too thin (${visible.length})`);
  return errors;
}

const cli = process.argv[1]?.endsWith('render-contract-v3.ts');
if (cli) {
  const baseDir = process.argv.includes('--dist') ? path.join(process.cwd(), 'dist') : process.cwd();
  const errors: string[] = [];
  let checked = 0;
  for (const page of sitemapPages()) {
    const sourceFile = page.sourceFile;
    if (!sourceFile) continue;
    const file = path.join(baseDir, sourceFile);
    if (!fs.existsSync(file)) continue;
    errors.push(...inspectFirstHtml(fs.readFileSync(file, 'utf8'), page.canonicalPath));
    checked += 1;
  }
  if (!checked) errors.push('no registry source files were checked');
  if (errors.length) {
    console.error('[FAIL] V3 first HTML contract\n' + errors.map((e) => ` - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log(`[PASS] V3 first HTML contract checked=${checked} mode=${baseDir.endsWith('dist') ? 'dist' : 'source'}`);
}
