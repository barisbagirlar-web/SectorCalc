#!/usr/bin/env node
/**
 * 360 navigation audit (n8n-style edge check):
 * every internal href must resolve to an existing file or on-page anchor.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const BASE_PAGES = [
  'index.html',
  'pricing.html',
  'pro.html',
  'tools.html',
  'calculator.html',
  'calculator2.html',
  'calculator3.html',
  'calculator4.html'
];
const PRO_PAGES = readdirSync(ROOT)
  .filter((f) => f.endsWith('-pro.html'))
  .sort();
const PAGES = [...BASE_PAGES, ...PRO_PAGES];

const EXPECTED = {
  'index.html': {
    mustInclude: [
      '/calculator/tolerance-stack-up',
      '/calculator/quote-pricing',
      '/calculator/true-labor-cost',
      '/calculator/weld-thickness',
      '/calculator/cnc-feeds-speeds',
      '/calculator/bearing-life-l10',
      '/tools.html',
      '/pricing.html',
      '/glossary',
      '/compare',
      '/guides',
      '#decide',
      '#method',
      '#standards',
      '#evidence',
      '#verify'
    ],
    // mobile overlay must expose the catalog (n8n edge: phone path ≠ desktop footer only)
    mustHaveIds: [
      'main-content',
      'decide',
      'method',
      'standards',
      'pricing',
      'evidence',
      'verify',
      'run',
      'testimonials',
      'mobileMenuBtn',
      'mobileNav'
    ]
  },
  'pricing.html': {
    mustInclude: ['/', '/tools.html', '/glossary', '/guides', '/compare']
  },
  'pro.html': {
    mustInclude: ['/', '/pricing.html', '/tools.html', '/glossary', '/guides', '/compare']
  },
  'tools.html': {
    mustInclude: ['/', '/pricing.html', '/glossary', '/compare', '/guides', '/calculator/tolerance-stack-up']
  }
};
const issues = [];

// Firebase hosting rewrites: pretty URL -> physical file (see firebase.json).
const REWRITE_TARGETS = {
  'calculator/tolerance-stack-up': 'sc008-pro.html',
  'calculator/cnc-feeds-speeds': 'machining-pro.html',
  'calculator/tap-thread-milling': 'tap-thread-pro.html',
  'calculator/cycle-time-cost': 'cycle-cost-pro.html',
  'calculator/bearing-life-l10': 'bearing-pro.html',
  'calculator/bearing-frequencies': 'bearing-freq-pro.html',
  'calculator/belt-chain-drive': 'belt-chain-pro.html',
  'calculator/shaft-design': 'shaft-pro.html',
  'calculator/iso-286-fits': 'fits-pro.html',
  'calculator/surface-finish': 'surface-finish-pro.html',
  'calculator/weld-thickness': 'weld-pro.html',
  'calculator/weld-heat-input': 'heat-input-pro.html',
  'calculator/sheet-metal-bend': 'bend-pro.html',
  'calculator/punching-force': 'punching-pro.html',
  'calculator/sling-capacity': 'sling-pro.html',
  'calculator/shackle-eyebolt': 'shackle-eyebolt-pro.html',
  'calculator/pressure-vessel-shell': 'pressure-vessel-pro.html',
  'calculator/pipe-wall-thickness': 'pipe-wall-pro.html',
  'calculator/hydraulic-cylinder': 'hydraulic-pro.html',
  'calculator/bolt-torque-preload': 'bolt-pro.html',
  'calculator/bolted-joint': 'bolted-joint-pro.html',
  'calculator/true-labor-cost': 'labor-pro.html',
  'calculator/quote-pricing': 'quote-pro.html',
  'calculator/oee-teep': 'oee-pro.html',
  'calculator/machine-hour-rate': 'machine-rate-pro.html',
  glossary: 'public/glossary/index.html',
  compare: 'public/compare/index.html',
  guides: 'public/guides/index.html',
  blog: 'public/blog/index.html',
  'case-studies': 'public/case-studies/index.html',
  about: 'public/about/index.html',
  contact: 'public/contact/index.html',
  privacy: 'public/privacy/index.html',
  terms: 'public/terms/index.html',
  resources: 'public/resources/index.html',
};

function resolveTarget(target) {
  if (REWRITE_TARGETS[target]) return REWRITE_TARGETS[target];
  // /glossary/slug -> public/glossary/slug.html
  for (const folder of ['glossary', 'compare', 'guides', 'blog', 'topics', 'case-studies', 'about', 'contact', 'privacy', 'terms', 'resources']) {
    if (target === folder || target.startsWith(`${folder}/`)) {
      if (target === folder) return `public/${folder}/index.html`;
      const rest = target.slice(folder.length + 1).replace(/\/$/, '');
      if (!rest) return `public/${folder}/index.html`;
      if (rest.endsWith('.html')) return `public/${target}`;
      return `public/${folder}/${rest}.html`;
    }
  }
  return target;
}
function anchorsIn(html) {
  const ids = new Set();
  for (const m of html.matchAll(/\bid=["']([^"']+)["']/g)) ids.add(m[1]);
  for (const m of html.matchAll(/\bname=["']([^"']+)["']/g)) ids.add(m[1]);
  return ids;
}

function checkPage(page) {
  const path = join(ROOT, page);
  if (!existsSync(path)) {
    issues.push(`${page}: FILE MISSING`);
    return;
  }
  const html = readFileSync(path, 'utf8');
  const ids = anchorsIn(html);
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/g)].map((m) => m[1]);

  for (const href of hrefs) {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('javascript:')) continue;
    if (href.includes('${')) continue; // JS template literals in inline scripts
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (id && !ids.has(id)) issues.push(`${page}: dead anchor ${href}`);
      continue;
    }
    let target = href.split('?')[0].split('#')[0];
    if (target === '/' || target === '') target = 'index.html';
    if (target.startsWith('/')) target = target.slice(1);
    if (!target) continue;
    target = resolveTarget(target);
    const atRoot = existsSync(join(ROOT, target));
    const atPublic = existsSync(join(ROOT, 'public', target));
    const atResolved = existsSync(join(ROOT, target));
    if (!atRoot && !atPublic && !atResolved) issues.push(`${page}: dead link ${href} -> ${target}`);
  }

  const req = EXPECTED[page];
  if (req) {
    for (const need of req.mustInclude || []) {
      if (!hrefs.includes(need) && !html.includes(`href="${need}"`) && !html.includes(`href='${need}'`)) {
        issues.push(`${page}: missing required link ${need}`);
      }
    }
    for (const id of req.mustHaveIds || []) {
      if (!ids.has(id)) issues.push(`${page}: missing required id #${id}`);
    }
  }

  // Pro pages must link home + pricing + shared form-field layout
  if (page.endsWith('-pro.html')) {
    if (!hrefs.some((h) => h === '/')) issues.push(`${page}: no home link (/)`);
    if (!hrefs.some((h) => h === '/pricing.html')) issues.push(`${page}: no pricing link`);
    if (!html.includes('sc-tool-guide.css')) issues.push(`${page}: missing sc-tool-guide.css`);
    if (!html.includes('sc-tool-guide.js')) issues.push(`${page}: missing sc-tool-guide.js`);
    if (!html.includes('id="sc-guide"')) issues.push(`${page}: missing #sc-guide SEO section`);
    if (!/<link[^>]+sc-form-fields\.css/i.test(html)) issues.push(`${page}: missing sc-form-fields.css`);
    // Engagement mounts under CALCULATE / Generate Report via sc-tool-guide.js (data-sc-engage-slot=form)
  }

  // Site pages (not legacy calculator redirects) must ship the shared theme engine
  if (!page.startsWith('calculator')) {
    if (!html.includes('id="themeToggle"')) issues.push(`${page}: missing #themeToggle`);
    if (!html.includes('sc-theme.css')) issues.push(`${page}: missing sc-theme.css`);
    if (!html.includes('sc-theme.js')) issues.push(`${page}: missing sc-theme.js`);
    if (!html.includes('sectorcalc-theme')) issues.push(`${page}: missing theme boot key`);
    if (!html.includes('sc-site-nav.css')) issues.push(`${page}: missing sc-site-nav.css`);
    if (!html.includes('sc-site-nav.js')) issues.push(`${page}: missing sc-site-nav.js`);
    if (!html.includes('id="siteHeader"')) issues.push(`${page}: missing shared #siteHeader`);
    if (!html.includes('auth-nav')) issues.push(`${page}: missing auth-nav session module`);
    if (!/<link[^>]+sc-form-fields\.css/i.test(html)) issues.push(`${page}: missing sc-form-fields.css`);
    // 4-tile brand favicon set (cache-busted)
    if (!/<link[^>]+rel=["']icon["'][^>]+favicon\.ico/i.test(html)) {
      issues.push(`${page}: missing favicon.ico link`);
    }
    if (!/<link[^>]+rel=["']icon["'][^>]+favicon\.svg/i.test(html)) {
      issues.push(`${page}: missing favicon.svg link`);
    }
    if (!/<link[^>]+rel=["']apple-touch-icon["']/i.test(html)) {
      issues.push(`${page}: missing apple-touch-icon link`);
    }
    if (!/<link[^>]+rel=["']manifest["'][^>]+site\.webmanifest/i.test(html)) {
      issues.push(`${page}: missing site.webmanifest link`);
    }
  }

  // Live calculators must ship the English study toolbar assets
  if (page.endsWith('-pro.html')) {
    if (!html.includes('sc-study.css')) issues.push(`${page}: missing sc-study.css`);
    if (!html.includes('sc-study.js')) issues.push(`${page}: missing sc-study.js`);
  }
}

for (const page of PAGES) checkPage(page);

// Category map on homepage (role cards)
const index = readFileSync(join(ROOT, 'index.html'), 'utf8');
const roleMap = [
  ['Engineering', '/calculator/tolerance-stack-up'],
  ['Estimating', '/calculator/quote-pricing'],
  ['Costing', '/calculator/true-labor-cost'],
  ['Fabrication', '/calculator/weld-thickness'],
  ['Machining', '/calculator/cnc-feeds-speeds'],
  ['Bearings', '/calculator/bearing-life-l10'],
  ['Quality', '/calculator/tolerance-stack-up']
];
for (const [role, href] of roleMap) {
  // Match role label inside the same <a>…</a> card as the href (prettier may expand SVGs).
  const needle = `href="${href}"`;
  let from = 0;
  let wired = false;
  while (from < index.length) {
    const idx = index.indexOf(needle, from);
    if (idx < 0) break;
    const openEnd = index.indexOf('>', idx);
    if (openEnd < 0) break;
    const close = index.indexOf('</a>', openEnd);
    const card = index.slice(idx, close > openEnd ? close : openEnd + 2500);
    if (card.includes(`switch-role">${role}<`) || card.includes(`>${role}</span>`)) {
      wired = true;
      break;
    }
    from = idx + needle.length;
  }
  if (!wired) issues.push(`index.html: role "${role}" not wired to ${href}`);
}

if (!index.includes('id="mobileMenuBtn"') || !index.includes('id="mobileNav"')) {
  issues.push('index.html: mobile nav hamburger missing');
}
if (!index.includes('id="main-content"')) {
  issues.push('index.html: skip-link target #main-content missing');
}

const discovery = [
  'robots.txt',
  'sitemap.xml',
  'sitemap-images.xml',
  'sitemap-videos.xml',
  'llms.txt',
  'llm.txt',
  'site.webmanifest',
  '404.html',
  'assets/js/cvw-monitor.js',
  'assets/images/sectorcalc-og-1200x630.jpg'
];
for (const f of discovery) {
  if (!existsSync(join(ROOT, 'public', f))) issues.push(`public/${f}: FILE MISSING`);
}
const brandIcons = [
  'favicon.ico',
  'favicon.svg',
  'favicon-32.png',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'sectorcalc-mark.png'
];
for (const f of brandIcons) {
  if (!existsSync(join(ROOT, 'public', f))) issues.push(`public/${f}: FILE MISSING`);
}

if (issues.length) {
  console.error('[FAIL] Navigation audit\n' + issues.map((i) => ' - ' + i).join('\n'));
  process.exit(1);
}
console.log(`[PASS] Navigation audit: ${PAGES.length} pages, category map OK`);
// list dist presence
const dist = join(ROOT, 'dist');
if (existsSync(dist)) {
  const missing = PAGES.filter((p) => !existsSync(join(dist, p)));
  if (missing.length) {
    console.error('[FAIL] dist missing: ' + missing.join(', '));
    process.exit(1);
  }
  const missingDiscovery = discovery.filter((f) => !existsSync(join(dist, f)));
  if (missingDiscovery.length) {
    console.error('[FAIL] dist missing discovery files: ' + missingDiscovery.join(', '));
    process.exit(1);
  }
  for (const asset of ['sc-theme.css', 'sc-theme.js', 'sc-form-fields.css']) {
    if (!existsSync(join(dist, asset))) {
      console.error('[FAIL] dist missing theme/form asset: ' + asset);
      process.exit(1);
    }
  }
  for (const asset of [
    'vendor/three/three.module.min.js',
    'vendor/three/RoomEnvironment.js',
    'sc-hero-cell.js'
  ]) {
    if (!existsSync(join(dist, asset))) {
      console.error('[FAIL] dist missing hero asset: ' + asset);
      process.exit(1);
    }
  }
  for (const asset of brandIcons) {
    if (!existsSync(join(dist, asset))) {
      console.error('[FAIL] dist missing brand icon: ' + asset);
      process.exit(1);
    }
  }
  for (const asset of ['sc-study.js', 'sc-study.css']) {
    if (!existsSync(join(dist, asset))) {
      console.error('[FAIL] dist missing study toolbar asset: ' + asset);
      process.exit(1);
    }
  }
  console.log('[PASS] dist contains all audited pages + discovery files');
}
