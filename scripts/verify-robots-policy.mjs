#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { blockedPublicBots, requiredPublicBots } from '../seo/crawler-policy.mjs';
import { isRobotsAllowed } from '../seo/robots-policy.mjs';

const robots = readFileSync('public/robots.txt', 'utf8');
const errors = [];
const fail = (message) => errors.push(message);

const publicPaths = ['/', '/tools', '/calculator/bearing-life-l10', '/guides'];
const privatePaths = ['/cgi-bin/', '/tmp/', '/draft/', '/staging/', '/admin/', '/api/', '/internal/', '/assets/cache/'];

for (const bot of requiredPublicBots()) {
  for (const path of publicPaths) {
    if (!isRobotsAllowed(robots, bot, path)) fail(`${bot} must be allowed on public path ${path}`);
  }
  for (const path of privatePaths) {
    if (isRobotsAllowed(robots, bot, path)) fail(`${bot} must be blocked on private path ${path}`);
  }
}

for (const bot of blockedPublicBots()) {
  for (const path of ['/', '/calculator/bearing-life-l10', '/admin/']) {
    if (isRobotsAllowed(robots, bot, path)) fail(`${bot} must be blocked by training/non-search policy on ${path}`);
  }
}

if (!/Sitemap:\s*https:\/\/sectorcalc\.com\/sitemap\.xml/i.test(robots)) fail('robots missing canonical apex sitemap');
if (!/Sitemap:\s*https:\/\/sectorcalc\.com\/sitemap-images\.xml/i.test(robots)) fail('robots missing canonical image sitemap');
if (/Sitemap:\s*https:\/\/www\.sectorcalc\.com/i.test(robots)) fail('robots advertises www sitemap');
if (/\bAnthropic-ai\b|\bClaude-Web\b/i.test(robots)) fail('robots contains retired Anthropic crawler names');

if (errors.length) {
  console.error('[FAIL] effective robots policy');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`[OK] effective robots policy: allowed=${requiredPublicBots().length} blocked=${blockedPublicBots().length}; private paths denied`);
