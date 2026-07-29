#!/usr/bin/env node
/**
 * Blind-spot claim honesty gate.
 * Fails the build on stale credit expiry, fake ratings, unverified expert endorsement,
 * absolute privacy lies, placeholder video schema, and stale test-count marketing.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = process.cwd();
const EVIDENCE = join(ROOT, 'seo/evidence/expert-relationships.json');
const errors = [];
const fail = (m) => errors.push(m);

function claimAllowed() {
  if (!existsSync(EVIDENCE)) return false;
  const data = JSON.parse(readFileSync(EVIDENCE, 'utf8'));
  return (data.relationships || []).some(
    (r) =>
      r.schemaPersonId?.includes('neela') &&
      r.publicClaimAllowed === true &&
      r.relationshipVerified === true &&
      r.scopeVerified === true,
  );
}

function walkHtml(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (extname(name) === '.html') out.push(p);
  }
  return out;
}

const bannedPatterns = [
  [/Valid\s+12\s+months/i, 'stale credit expiry "Valid 12 months" (SSOT: purchased credits never expire)'],
  [/credits?[^\n.]{0,40}valid\s+for\s+12\s+months/i, 'stale 12-month credit validity claim'],
  [/Exact\s+P0\.13/i, 'unscientific Exact P0.13 claim from finite Monte Carlo'],
  [/"@type"\s*:\s*"AggregateRating"/i, 'AggregateRating schema without verified review inventory'],
  [/https?:\/\/www\.youtube\.com\/(?:watch\?v=|embed\/)REPLACE_WITH_YOUTUBE_ID/i, 'placeholder YouTube VideoObject schema'],
  [/zero data leaves browser/i, 'absolute privacy claim contradicted by analytics'],
  [/Client-side,\s*nothing uploaded/i, 'absolute upload claim contradicted by analytics/session'],
  [/data never left your browser/i, 'absolute privacy claim contradicted by analytics'],
  [/data never leaves your browser/i, 'absolute privacy claim contradicted by analytics'],
  [/394 automated tests/i, 'stale test-count marketing (current suite is 505+)'],
];

function walkTs(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkTs(p, out);
    else if (extname(name) === '.ts' || extname(name) === '.tsx') out.push(p);
  }
  return out;
}

const published = [];
for (const name of readdirSync(ROOT)) {
  if (extname(name) === '.html') published.push(join(ROOT, name));
}
walkHtml(join(ROOT, 'public'), published);

const allowed = claimAllowed();

for (const file of published) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, 'utf8');
  for (const [re, msg] of bannedPatterns) {
    if (re.test(html)) fail(`${rel}: ${msg}`);
  }
  if (!allowed) {
    if (/Reviewed by Prof\.\s*Dr\.\s*Neela Nataraj/i.test(html)) {
      fail(`${rel}: public Neela review badge while evidence publicClaimAllowed=false`);
    }
    if (/#person-neela-nataraj/.test(html)) {
      fail(`${rel}: publishes #person-neela-nataraj while evidence gate is closed`);
    }
  }
}

// Report/PDF copy lives in src/*-pro.ts — must be scanned (ADV-G1)
const srcTs = walkTs(join(ROOT, 'src'));
for (const file of srcTs) {
  const rel = relative(ROOT, file);
  const src = readFileSync(file, 'utf8');
  for (const [re, msg] of bannedPatterns) {
    if (re.test(src)) fail(`${rel}: ${msg}`);
  }
}

// Template quarantine: must not keep AggregateRating samples that can be copy-pasted into live pages
const schemaTpl = join(ROOT, 'content/seo-sprint/schema-template.txt');
if (existsSync(schemaTpl)) {
  const tpl = readFileSync(schemaTpl, 'utf8');
  if (/"@type"\s*:\s*"AggregateRating"/i.test(tpl)) {
    fail('content/seo-sprint/schema-template.txt still contains AggregateRating sample');
  }
  if (/ratingValue"\s*:\s*"4\.9"/i.test(tpl)) fail('content/seo-sprint/schema-template.txt still contains fake 4.9 rating sample');
}

const videoPartial = join(ROOT, 'content/partials/schema-video-sc008.html');
if (existsSync(videoPartial)) {
  const vp = readFileSync(videoPartial, 'utf8');
  if (/https?:\/\/www\.youtube\.com\/(?:watch\?v=|embed\/)REPLACE_WITH_YOUTUBE_ID/.test(vp)) {
    fail('content/partials/schema-video-sc008.html still has placeholder YouTube URLs');
  }
  if (/<script[^>]*application\/ld\+json[\s\S]*VideoObject/i.test(vp)) {
    fail('content/partials/schema-video-sc008.html still ships VideoObject JSON-LD without a verified video ID');
  }
}

// Blog hub must only link to articles that exist on disk (no ghost cards / fake pagination)
const blogHub = join(ROOT, 'public/blog/index.html');
const blogDir = join(ROOT, 'public/blog');
if (existsSync(blogHub) && existsSync(blogDir)) {
  const hub = readFileSync(blogHub, 'utf8');
  const existing = new Set(
    readdirSync(blogDir).filter((n) => n.endsWith('.html') && n !== 'index.html'),
  );
  const linked = new Set();
  for (const m of hub.matchAll(/href=["']\/blog\/([^"'#?]+)["']/g)) {
    const target = m[1];
    if (target === '' || target === 'index.html') continue;
    linked.add(target);
    if (!existing.has(target) && !existing.has(target.replace(/\/$/, '') + '.html') && !existsSync(join(blogDir, target))) {
      fail(`public/blog/index.html links to missing /blog/${target}`);
    }
  }
  for (const file of existing) {
    if (!linked.has(file)) {
      fail(`public/blog/index.html missing card link for published article ${file}`);
    }
  }
  if (/reviewed by IIT Bombay/i.test(hub) && !allowed) {
    fail('public/blog/index.html still claims IIT Bombay review while evidence gate is closed');
  }
}

// Image sitemap must not advertise unverified Academic Oversight portraits
const imageSitemap = join(ROOT, 'public/sitemap-images.xml');
if (existsSync(imageSitemap) && !allowed) {
  const simg = readFileSync(imageSitemap, 'utf8');
  if (/neela-nataraj\.jpg/i.test(simg) || /Academic Oversight/i.test(simg)) {
    fail('public/sitemap-images.xml still advertises Neela / Academic Oversight while evidence gate is closed');
  }
}

if (errors.length) {
  console.error('[FAIL] claim honesty guard:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] claim honesty guard: ${published.length} HTML pages scanned; expertAllowed=${allowed}`);
