#!/usr/bin/env node
/**
 * Generate public/robots.txt from data/seo/ai-crawler-policy.json.
 * Do not hand-edit robots.txt.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const policy = JSON.parse(readFileSync(join(ROOT, 'data/seo/ai-crawler-policy.json'), 'utf8'));

const PRIVATE = policy.privatePaths;
if (!Array.isArray(PRIVATE) || PRIVATE.length === 0) {
  console.error('[FAIL] crawler policy missing privatePaths');
  process.exit(1);
}

function privateBlock() {
  return PRIVATE.map((p) => `Disallow: ${p}`).join('\n');
}

function group(agent, allowPublic) {
  if (!allowPublic) {
    return `User-agent: ${agent}\nDisallow: /\n`;
  }
  return `User-agent: ${agent}\nAllow: /\n${privateBlock()}\n`;
}

const search = [];
const training = [];
for (const bot of policy.bots) {
  if (bot.allowPublic) search.push(bot);
  else training.push(bot);
}

const lines = [
  '# SectorCalc — robots.txt (generated from data/seo/ai-crawler-policy.json)',
  '# Canonical host: https://sectorcalc.com',
  '# Search/retrieval crawlers may access public content.',
  '# Training / model-development crawlers are blocked.',
  '# robots.txt is not an access-control mechanism for private data.',
  '',
  group('*', true).trimEnd(),
  '',
  ...search.map((b) => group(b.userAgent, true)),
  ...training.map((b) => group(b.userAgent, false)),
  ...policy.sitemaps.map((s) => `Sitemap: ${s}`),
  '',
];

writeFileSync(join(ROOT, 'public/robots.txt'), `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`);
console.log(`[OK] public/robots.txt generated from crawler policy (${policy.bots.length} bots)`);
