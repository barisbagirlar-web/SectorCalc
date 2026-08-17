#!/usr/bin/env node
/**
 * One-shot URL + registry + firebase inversion for extensionless canonicals.
 * Safe to re-run.
 */
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

function read(p) {
  return readFileSync(join(ROOT, p), 'utf8');
}
function write(p, s) {
  writeFileSync(join(ROOT, p), s);
}

// --- firebase ---
const fj = JSON.parse(read('firebase.json'));
const redirects = fj.hosting.redirects || [];
const rewrites = fj.hosting.rewrites || [];

function upsertRedirect(source, destination) {
  const i = redirects.findIndex((r) => r.source === source);
  const row = { source, destination, type: 301 };
  if (i >= 0) redirects[i] = row;
  else redirects.unshift(row);
}
function removeRedirect(source) {
  for (let i = redirects.length - 1; i >= 0; i--) {
    if (redirects[i].source === source) redirects.splice(i, 1);
  }
}
function upsertRewrite(source, destination) {
  const i = rewrites.findIndex((r) => r.source === source);
  const row = { source, destination };
  if (i >= 0) rewrites[i] = row;
  else rewrites.unshift(row);
}

removeRedirect('/tools');
removeRedirect('/pricing');
removeRedirect('/login');
removeRedirect('/account');
removeRedirect('/pro');
upsertRedirect('/tools.html', '/tools');
upsertRedirect('/pricing.html', '/pricing');
upsertRedirect('/login.html', '/login');
upsertRedirect('/account.html', '/account');
upsertRedirect('/pro.html', '/tools');
upsertRedirect('/pro', '/tools');
upsertRedirect('/llm.txt', '/llms.txt');
upsertRewrite('/tools', '/tools.html');
upsertRewrite('/pricing', '/pricing.html');
upsertRewrite('/login', '/login.html');
upsertRewrite('/account', '/account.html');

fj.hosting.redirects = redirects;
fj.hosting.rewrites = rewrites;
const headers = fj.hosting.headers || [];
if (!headers.some((h) => (h.source || '').includes('*.md'))) {
  headers.push({
    source: '**/*.md',
    headers: [
      { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
      { key: 'X-Robots-Tag', value: 'noindex, follow' },
    ],
  });
}
if (!headers.some((h) => h.source === '/engine-manifest.json')) {
  headers.push({
    source: '/engine-manifest.json',
    headers: [{ key: 'Content-Type', value: 'application/json; charset=utf-8' }],
  });
}
fj.hosting.headers = headers;
write('firebase.json', `${JSON.stringify(fj, null, 2)}\n`);

// --- registry ---
let registry = read('seo/registry-data.mjs');
registry = registry.replaceAll('"/tools.html"', '"/tools"');
registry = registry.replaceAll('"/pricing.html"', '"/pricing"');
registry = registry.replace(
  `"canonicalPath": "/pro.html",
    "legacyPaths": [],
    "role": "pro",
    "locale": "en",
    "publicationStatus": "published",
    "indexDirective": "index,follow",
    "sitemapEligible": true,
    "llmEligible": true,`,
  `"canonicalPath": "/pro.html",
    "legacyPaths": ["/pro", "/pro.html"],
    "role": "pro",
    "locale": "en",
    "publicationStatus": "redirect",
    "indexDirective": "noindex,follow",
    "sitemapEligible": false,
    "llmEligible": false,`,
);
registry = registry.replace(
  '"h1": "Engineering glossary built for retrieval, not filler"',
  '"h1": "Industrial Engineering Glossary"',
);
registry = registry.replace(
  '"title": "Exclusive Engineering Guides | SectorCalc"',
  '"title": "Industrial Engineering Calculation Guides | SectorCalc"',
);
registry = registry.replace(
  '"description": "Enterprise engineering guides with money-parity answer chains for tolerance, CNC, bearings, labor, weld, ISO fits, finish, bend, and punch."',
  '"description": "Method selection, calculation methodology, worked examples, model boundaries and standards context for SectorCalc industrial calculators."',
);
registry = registry.replace(
  '"h1": "Engineering guides at money-page depth"',
  '"h1": "Industrial Engineering Calculation Guides"',
);
registry = registry.replace(
  '"title": "Pricing — SectorCalc"',
  '"title": "Engineering Calculation Credits — No Subscription | SectorCalc"',
);
registry = registry.replace(
  '"h1": "Pricing"',
  '"h1": "Engineering Calculation Credits — No Subscription"',
);
if (!registry.includes('"id": "trust"')) {
  const insert = `  {
    "id": "trust",
    "sourceFile": "public/trust/index.html",
    "canonicalPath": "/trust",
    "legacyPaths": [],
    "role": "legal",
    "locale": "en",
    "publicationStatus": "published",
    "indexDirective": "index,follow",
    "sitemapEligible": true,
    "llmEligible": true,
    "title": "Trust — SectorCalc",
    "description": "SectorCalc trust center: operator identity, security, privacy, terms, refunds, status and evidence policy.",
    "h1": "Trust",
    "primaryIntent": "sectorcalc trust center",
    "queryCluster": "trust-hub",
    "primaryEntity": "trust",
    "topicalCluster": "site",
    "revenueTier": "C",
    "conversionEvent": null,
    "parentHub": "/",
    "relatedRoutes": ["/about", "/security", "/privacy", "/terms", "/refund", "/status", "/case-studies", "/contact"],
    "contentSources": ["/trust"],
    "schemaTypes": ["WebPage", "BreadcrumbList"],
    "imageAssets": [],
    "quality": {
      "formulaVerified": true,
      "contentReviewed": true,
      "canonicalVerified": true,
      "sourceVerified": true,
      "languageVerified": true,
      "demoVerified": true,
      "noPlaceholder": true,
      "noRegenerationPending": true,
      "calculatorWorks": true
    }
  },
  {
    "id": "account",
    "sourceFile": "account.html",
    "canonicalPath": "/account",
    "legacyPaths": ["/account.html"],
    "role": "account",
    "locale": "en",
    "publicationStatus": "published",
    "indexDirective": "noindex,follow",
    "sitemapEligible": false,
    "llmEligible": false,
    "title": "Account — SectorCalc",
    "description": "SectorCalc account, wallet and session management.",
    "h1": "Account",
    "primaryIntent": "sectorcalc account",
    "queryCluster": "account",
    "primaryEntity": "account",
    "topicalCluster": "site",
    "revenueTier": "A",
    "conversionEvent": "wallet_view",
    "parentHub": "/",
    "relatedRoutes": ["/pricing", "/login"],
    "contentSources": ["/account"],
    "schemaTypes": ["WebPage"],
    "imageAssets": [],
    "quality": {
      "formulaVerified": true,
      "contentReviewed": true,
      "canonicalVerified": true,
      "sourceVerified": true,
      "languageVerified": true,
      "demoVerified": true,
      "noPlaceholder": true,
      "noRegenerationPending": true,
      "calculatorWorks": true
    }
  },
  {
    "id": "login",
    "sourceFile": "login.html",
    "canonicalPath": "/login",
    "legacyPaths": ["/login.html"],
    "role": "account",
    "locale": "en",
    "publicationStatus": "published",
    "indexDirective": "noindex,follow",
    "sitemapEligible": false,
    "llmEligible": false,
    "title": "Sign in — SectorCalc",
    "description": "Sign in to SectorCalc to unlock credit-backed calculation sessions.",
    "h1": "Sign in",
    "primaryIntent": "sectorcalc login",
    "queryCluster": "login",
    "primaryEntity": "login",
    "topicalCluster": "site",
    "revenueTier": "A",
    "conversionEvent": "signin_started",
    "parentHub": "/",
    "relatedRoutes": ["/account", "/pricing"],
    "contentSources": ["/login"],
    "schemaTypes": ["WebPage"],
    "imageAssets": [],
    "quality": {
      "formulaVerified": true,
      "contentReviewed": true,
      "canonicalVerified": true,
      "sourceVerified": true,
      "languageVerified": true,
      "demoVerified": true,
      "noPlaceholder": true,
      "noRegenerationPending": true,
      "calculatorWorks": true
    }
  },
`;
  registry = registry.replace('export const PAGES = [\n', `export const PAGES = [\n${insert}`);
}
write('seo/registry-data.mjs', registry);

for (const lang of ['de', 'ja', 'zh']) {
  const p = join(ROOT, 'public', lang);
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

console.log('[OK] canonical URL migration applied');
