#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { isRobotsAllowed } from '../seo/robots-policy.mjs';

const robots = readFileSync('public/robots.txt', 'utf8');
const errors = [];
const fail = (message) => errors.push(message);

const publicPaths = [
  '/',
  '/tools.html',
  '/calculator/bearing-life-l10',
  '/topics/maintenance-reliability',
];
const privatePaths = [
  '/cgi-bin/',
  '/tmp/',
  '/draft/',
  '/staging/',
  '/admin/',
  '/api/',
  '/internal/',
  '/assets/cache/',
];
const allowedBots = [
  'Googlebot',
  'Googlebot-Image',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Google-Extended',
  'Anthropic-ai',
  'Claude-Web',
  'cohere-ai',
  'ia_archiver',
  'AhrefsBot',
  'SemrushBot',
];

for (const bot of allowedBots) {
  for (const path of publicPaths) {
    if (!isRobotsAllowed(robots, bot, path)) {
      fail(`${bot} must be allowed on public path ${path}`);
    }
  }
  for (const path of privatePaths) {
    if (isRobotsAllowed(robots, bot, path)) {
      fail(`${bot} must be blocked on private path ${path}`);
    }
  }
}

for (const bot of ['GPTBot', 'ClaudeBot', 'CCBot', 'FacebookBot']) {
  for (const path of ['/', '/calculator/bearing-life-l10', '/admin/']) {
    if (isRobotsAllowed(robots, bot, path)) {
      fail(`${bot} must be blocked by training-crawler policy on ${path}`);
    }
  }
}

if (!/Sitemap:\s*https:\/\/sectorcalc\.com\/sitemap\.xml/i.test(robots)) {
  fail('robots missing canonical apex sitemap');
}
if (!/Sitemap:\s*https:\/\/sectorcalc\.com\/sitemap-images\.xml/i.test(robots)) {
  fail('robots missing canonical image sitemap');
}
if (/Sitemap:\s*https:\/\/www\.sectorcalc\.com/i.test(robots)) {
  fail('robots advertises www sitemap');
}

if (errors.length) {
  console.error('[FAIL] effective robots policy');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log('[OK] effective robots policy: public discovery allowed, private paths blocked, training bots denied');
