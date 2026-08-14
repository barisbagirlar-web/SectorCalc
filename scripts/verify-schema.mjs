#!/usr/bin/env node
/**
 * Schema / JSON-LD truth gate for SectorCalc SEO pages.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { HOST, publishedCalculators, toolCanonicalBySourceFile } from '../seo/registry.mjs';

const ROOT = process.cwd();
const errors = [];
const fail = (m) => errors.push(m);
const CANON = toolCanonicalBySourceFile();

const evidencePath = join(ROOT, 'seo/evidence/expert-relationships.json');
const evidence = existsSync(evidencePath)
  ? JSON.parse(readFileSync(evidencePath, 'utf8'))
  : { relationships: [] };
const neelaAllowed = (evidence.relationships || []).some(
  (r) => r.schemaPersonId?.includes('neela') && r.publicClaimAllowed === true && r.relationshipVerified === true && r.scopeVerified === true,
);

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    try {
      blocks.push({ raw, json: JSON.parse(raw) });
    } catch (err) {
      fail(`invalid JSON-LD: ${err.message}`);
    }
  }
  return blocks;
}

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const n of node) walk(n, visit);
    return;
  }
  visit(node);
  for (const v of Object.values(node)) walk(v, visit);
}

const pages = ['index.html', 'tools.html', 'pro.html', 'pricing.html', ...readdirSync(ROOT).filter((f) => f.endsWith('-pro.html')).sort()];
const ids = new Map();

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  if (/AggregateRating/i.test(html)) fail(`${page} AggregateRating present without allowlist`);
  if (/"@type"\s*:\s*"Review"/i.test(html)) fail(`${page} Review schema present without allowlist`);
  // No page may ship a video schema without a real video: placeholder YouTube
  // IDs and VideoObject/Clip claims are fake-data smoke in the crawl surface.
  if (/VideoObject|"@type"\s*:\s*"Clip"|REPLACE_WITH_YOUTUBE_ID/i.test(html)) {
    fail(`${page} ships video schema (VideoObject/Clip/REPLACE_WITH_YOUTUBE_ID) with no real video`);
  }

  const blocks = extractJsonLd(html);
  for (const { json } of blocks) {
    walk(json, (node) => {
      if (node['@id']) {
        const id = String(node['@id']);
        const types = node['@type'];
        const typeStr = Array.isArray(types) ? types.join(',') : String(types || '');
        if (/\/[a-z0-9-]+-pro\.html/i.test(id) && /SoftwareApplication|WebApplication/i.test(typeStr)) {
          fail(`${page} primary schema @id uses legacy URL ${id}`);
        }
      }
      if (node.url && typeof node.url === 'string') {
        const types = node['@type'];
        const typeStr = Array.isArray(types) ? types.join(',') : String(types || '');
        // Speakable/WebPage twins may still mention legacy file path during migration; SoftwareApplication must be pretty.
        if (/\/[a-z0-9-]+-pro\.html$/i.test(node.url) && /SoftwareApplication|WebApplication|Dataset/i.test(typeStr)) {
          fail(`${page} schema entity URL is legacy ${node.url}`);
        }
      }
      if (!neelaAllowed && node['@id'] === `${HOST}/#person-neela-nataraj`) {
        fail(`${page} publishes Neela Person schema but evidence publicClaimAllowed/scopeVerified is false`);
      }
    });
  }

  if (page.endsWith('-pro.html')) {
    const pretty = CANON[page];
    const slug = page.replace(/\.html$/, '');
    if (!html.includes(`sc-schema-tool-${slug}`)) fail(`${page} missing tool schema marker`);
    if (pretty && !html.includes(`"${HOST}${pretty}`)) fail(`${page} schema/canonical missing pretty URL ${pretty}`);
    const meta = publishedCalculators().find((c) => c.sourceFile === page);
    if (meta) {
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
      // Task 4 mandate: H1 must carry the demand-matched primary intent term.
      // Compare word-by-word so "stack-up"/"stack up", "&"/"and" variants pass.
      if (meta.primaryIntent && h1) {
        const norm = (s) => s.toLowerCase().replace(/&amp;/g, '&').replace(/[-–—/]/g, ' ').replace(/&/g, ' ').replace(/[^a-z0-9 ]/g, ' ');
        const h1Words = new Set(norm(h1).split(/\s+/).filter(Boolean));
        const missing = norm(meta.primaryIntent).split(/\s+/).filter((w) => w && !h1Words.has(w));
        if (missing.length) fail(`${page} H1 missing primary-intent word(s) ${missing.join(', ')} (Task 4 mandate)`);
      }
      if (h1 && meta.name && !h1.includes(meta.id) && !html.includes(meta.name) && !html.includes(meta.short || '')) {
        // soft: ensure registry id appears somewhere in page identity
        if (!html.includes(meta.id)) fail(`${page} missing registry tool id ${meta.id} in HTML`);
      }
    }
  }
}

if (errors.length) {
  console.error('[FAIL] schema gate:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`[PASS] schema gate: ${pages.length} pages, AggregateRating/Review=0, legacy schema URLs=0, evidence.neelaAllowed=${neelaAllowed}`);
