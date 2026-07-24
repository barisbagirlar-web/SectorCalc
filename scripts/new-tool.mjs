#!/usr/bin/env node
/**
 * Scaffold a new SectorCalc calculator page with the locked form-field layout.
 *
 * Usage:
 *   node scripts/new-tool.mjs --id SC-030 --slug gear --title "Gear Ratio" --kind lit
 *   node scripts/new-tool.mjs --id SC-031 --slug tap --title "Tap Drill" --kind engine
 *
 * Then: add guide content, wire tools.html / sitemap, run npm run build.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return process.argv[i + 1] ?? fallback;
}

const id = arg('id');
const slug = arg('slug');
const title = arg('title');
const kind = arg('kind', 'lit'); // lit | engine
const description =
  arg('description') ||
  `${title} calculator with selectable units, reference values, and audit-ready results.`;

if (!id || !slug || !title) {
  console.error(
    'Usage: node scripts/new-tool.mjs --id SC-0XX --slug my-tool --title "My Tool" [--kind lit|engine]'
  );
  process.exit(1);
}
if (!/^SC-\d{3}$/i.test(id)) {
  console.error('[FAIL] --id must look like SC-030');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('[FAIL] --slug must be lowercase kebab-case');
  process.exit(1);
}
if (kind !== 'lit' && kind !== 'engine') {
  console.error('[FAIL] --kind must be lit or engine');
  process.exit(1);
}

const outName = `${slug}-pro.html`;
const outPath = join(ROOT, outName);
if (existsSync(outPath)) {
  console.error(`[FAIL] ${outName} already exists`);
  process.exit(1);
}

const tplName = kind === 'engine' ? 'tool-pro-engine.html' : 'tool-pro-lit.html';
const tplPath = join(ROOT, 'content', 'templates', tplName);
let html = readFileSync(tplPath, 'utf8');
const badge = `${id.toUpperCase()} · ${title}`;
html = html
  .replaceAll('{{TITLE}}', title)
  .replaceAll('{{DESCRIPTION}}', description)
  .replaceAll('{{BADGE}}', badge);

writeFileSync(outPath, html);
console.log(`[OK] Created ${outName} from ${tplName}`);
console.log('Next:');
console.log(`  1. Add an explicit PAGES entry in scripts/inject-site-nav.mjs`);
console.log(`  2. Add content/guides/${id.toLowerCase().replace('-', '')}.html and wire inject-guides.mjs`);
console.log('  3. Link from tools.html + public/sitemap.xml');
console.log('  4. npm run build   # inject + form-field gate + verify-nav');
