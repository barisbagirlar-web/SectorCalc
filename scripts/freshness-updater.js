/**
 * SectorCalc — Content Freshness Auto-Updater
 * Updates public/sitemap.xml <lastmod> from git history for known HTML locs.
 *
 * Usage (CI): node scripts/update-sitemap-lastmod.js
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const SITEMAP_PATH = join(ROOT, 'public/sitemap.xml');

function getGitLastModified(filePath) {
  try {
    const stdout = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf8',
      cwd: ROOT
    });
    const v = stdout.trim();
    return v || new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function resolveFile(pagePath) {
  if (!pagePath || pagePath === '/') return 'index.html';
  const clean = pagePath.replace(/^\//, '').replace(/\/$/, '');
  const candidates = [
    clean,
    `${clean}.html`,
    join('public', clean),
    join('public', clean, 'index.html'),
    join('public', `${clean}.html`)
  ];
  for (const c of candidates) {
    if (existsSync(join(ROOT, c))) return c;
  }
  return null;
}

let sitemap = readFileSync(SITEMAP_PATH, 'utf8');
const urlRegex =
  /<loc>(https:\/\/sectorcalc\.com\/([^<]*))<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
let match;
const replacements = [];

while ((match = urlRegex.exec(sitemap)) !== null) {
  const fullUrl = match[1];
  const pagePath = match[2];
  const currentLastmod = match[3];
  const filePath = resolveFile(pagePath);
  if (!filePath) continue;
  const gitDate = getGitLastModified(filePath);
  const gitDateShort = gitDate.split('T')[0];
  const currentDateShort = currentLastmod.split('T')[0];
  if (gitDateShort !== currentDateShort) {
    console.log(`[FRESHNESS] ${pagePath || '/'}: ${currentDateShort} → ${gitDateShort}`);
    replacements.push({ fullUrl, currentLastmod, gitDate });
  }
}

for (const r of replacements) {
  sitemap = sitemap.replace(
    `<loc>${r.fullUrl}</loc>\n    <lastmod>${r.currentLastmod}</lastmod>`,
    `<loc>${r.fullUrl}</loc>\n    <lastmod>${r.gitDate}</lastmod>`
  );
}

writeFileSync(SITEMAP_PATH, sitemap);
console.log(`[FRESHNESS] sitemap.xml updated (${replacements.length} lastmod changes)`);
