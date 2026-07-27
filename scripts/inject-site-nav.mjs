#!/usr/bin/env node
/**
 * Inject the shared SectorCalc site header into every public HTML page.
 * Also forces canonical calculator form-field CSS on every *-pro.html page,
 * including tools added later that are not yet in the explicit PAGES list.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PARTIAL = readFileSync(join(ROOT, 'content/partials/site-header.html'), 'utf8').trim();

const FORM_FIELDS_VERSION = 5;
const STUDY_VERSION = 4;
const THEME_VERSION = 12;
const NAV_VERSION = 5;
const AUTH_NAV_SCRIPT = `<script type="module" src="/src/auth-nav.ts"></script>`;
const NAV_ASSETS = `
<link rel="stylesheet" href="./sc-site-nav.css?v=${NAV_VERSION}">
<script src="./sc-site-nav.js?v=2" defer></script>
${AUTH_NAV_SCRIPT}
`.trim();
const THEME_ASSETS = `
<link rel="stylesheet" href="./sc-theme.css?v=${THEME_VERSION}">
<script src="./sc-theme.js?v=${THEME_VERSION}" defer></script>
`.trim();

const FORM_FIELDS_ASSET =
  `<link rel="stylesheet" href="./sc-form-fields.css?v=${FORM_FIELDS_VERSION}">`;

const STUDY_ASSETS = `
<link rel="stylesheet" href="./sc-study.css?v=${STUDY_VERSION}">
<script src="./sc-study.js?v=${STUDY_VERSION}" defer></script>
`.trim();

/** Explicit page configs (nav strip + tool badge). New tools auto-register below. */
const PAGES = [
  { page: 'index.html', strip: 'home', badge: null },
  { page: 'tools.html', strip: 'topbar', badge: null },
  { page: 'pro.html', strip: 'topbar', badge: null },
  { page: 'pricing.html', strip: 'pricing', badge: null },
  { page: 'login.html', strip: 'topbar', badge: null },
  { page: 'account.html', strip: 'topbar', badge: null },
  { page: 'machining-pro.html', strip: 'topbar', badge: 'SC-020 · Feeds & Speeds' },
  { page: 'bearing-pro.html', strip: 'topbar', badge: 'SC-021 · Bearing Life L10' },
  { page: 'tap-thread-pro.html', strip: 'topbar', badge: 'SC-022 · Tap & Thread Milling' },
  { page: 'cycle-cost-pro.html', strip: 'topbar', badge: 'SC-023 · Cycle Time & Cost per Part' },
  { page: 'bearing-freq-pro.html', strip: 'topbar', badge: 'SC-024 · Bearing Frequencies (BPFO/BPFI)' },
  { page: 'belt-chain-pro.html', strip: 'topbar', badge: 'SC-025 · Belt & Chain Drive Sizing' },
  { page: 'shaft-pro.html', strip: 'topbar', badge: 'SC-026 · Shaft Design (Torsion + Bending)' },
  { page: 'fits-pro.html', strip: 'topbar', badge: 'SC-027 · Fits & Clearances (ISO 286)' },
  { page: 'surface-finish-pro.html', strip: 'topbar', badge: 'SC-028 · Surface Finish (Ra/Rz)' },
  { page: 'heat-input-pro.html', strip: 'topbar', badge: 'SC-029 · Weld Heat Input & t8/5' },
  { page: 'bend-pro.html', strip: 'topbar', badge: 'SC-030 · Bend & K-Factor' },
  { page: 'sling-pro.html', strip: 'topbar', badge: 'SC-031 · Sling Capacity & Angle' },
  { page: 'shackle-eyebolt-pro.html', strip: 'topbar', badge: 'SC-032 · Shackle & Eye Bolt' },
  { page: 'pressure-vessel-pro.html', strip: 'topbar', badge: 'SC-033 · Pressure Vessel Shell (ASME VIII)' },
  { page: 'pipe-wall-pro.html', strip: 'topbar', badge: 'SC-034 · Pipe Wall (ASME B31.3)' },
  { page: 'bolt-pro.html', strip: 'topbar', badge: 'SC-035 · Bolt Torque & Preload (VDI 2230)' },
  { page: 'bolted-joint-pro.html', strip: 'topbar', badge: 'SC-036 · Bolted Joint Verification (VDI 2230)' },
  { page: 'oee-pro.html', strip: 'topbar', badge: 'SC-037 · OEE' },
  { page: 'machine-rate-pro.html', strip: 'topbar', badge: 'SC-038 · Machine Hour Rate' },
  { page: 'punching-pro.html', strip: 'topbar', badge: 'SC-039 · Punching Force & Die Clearance' },
  { page: 'hydraulic-pro.html', strip: 'topbar', badge: 'SC-040 · Hydraulic Cylinder Sizing' },
  {
    page: 'sc008-pro.html',
    strip: 'lit',
    badge: 'SC-008 · Tolerance Stack-Up',
    toolStrip: '<div class="sc-tool-strip"><b>SC-008 · Tolerance Stack-Up</b><span>Engineering preview · Decimal engine · Not for production approval</span></div>'
  },
  {
    page: 'labor-pro.html',
    strip: 'lit',
    badge: 'SC-010 · True Labor Cost',
    toolStrip: '<div class="sc-tool-strip"><b>SC-010 · True Labor Cost</b><span>Engineering preview · Decimal engine · Not for production approval</span></div>'
  },
  {
    page: 'quote-pro.html',
    strip: 'lit',
    badge: 'SC-012 · Quote Pricing',
    toolStrip: '<div class="sc-tool-strip"><b>SC-012 · Quote Pricing</b><span>Engineering preview · Decimal engine · Not for production approval</span></div>'
  },
  {
    page: 'weld-pro.html',
    strip: 'lit',
    badge: 'SC-001 · Weld Thickness',
    toolStrip: '<div class="sc-tool-strip"><b>SC-001 · Weld Thickness</b><span>Engineering preview · Decimal engine · Not for production approval</span></div>'
  }
];

function detectStrip(html) {
  if (html.includes('class="sc-layout"') || html.includes("class='sc-layout'")) return 'lit';
  if (html.includes('class="topbar"')) return 'topbar';
  return 'topbar';
}

function autoRegisterProPages() {
  const known = new Set(PAGES.map((p) => p.page));
  const found = readdirSync(ROOT).filter((f) => f.endsWith('-pro.html'));
  for (const page of found) {
    if (known.has(page)) continue;
    const html = readFileSync(join(ROOT, page), 'utf8');
    PAGES.push({ page, strip: detectStrip(html), badge: null });
    console.warn(`[WARN] Auto-registered ${page} — add an explicit PAGES entry in inject-site-nav.mjs`);
  }
}

function ensureAssets(html, page = '') {
  let out = html;
  // Drop legacy body-end auth-nav mounts (SEO/CVW injects rewrite </body> and can wipe them)
  out = out.replace(/\s*<script type="module" src="\/src\/auth-nav\.ts"><\/script>\s*/g, '\n');
  if (!out.includes('sc-site-nav.css')) {
    out = out.replace('</head>', `${NAV_ASSETS}\n</head>`);
  } else {
    out = out.replace(/sc-site-nav\.css\?v=\d+/g, `sc-site-nav.css?v=${NAV_VERSION}`);
    if (!out.includes('auth-nav')) {
      if (/sc-site-nav\.js[^"']*["'][^>]*>/.test(out)) {
        out = out.replace(
          /(<script[^>]+sc-site-nav\.js[^>]*><\/script>)/,
          `$1\n${AUTH_NAV_SCRIPT}`
        );
      } else {
        out = out.replace('</head>', `${AUTH_NAV_SCRIPT}\n</head>`);
      }
    }
  }
  if (!out.includes('sc-theme.css')) {
    out = out.replace('</head>', `${THEME_ASSETS}\n</head>`);
  } else {
    out = out
      .replace(/sc-theme\.css\?v=\d+/g, `sc-theme.css?v=${THEME_VERSION}`)
      .replace(/sc-theme\.js\?v=\d+/g, `sc-theme.js?v=${THEME_VERSION}`);
  }
  // Always ensure form-field readability CSS (independent of nav)
  if (!out.includes('sc-form-fields.css')) {
    out = out.replace('</head>', `${FORM_FIELDS_ASSET}\n</head>`);
  } else {
    out = out.replace(
      /sc-form-fields\.css\?v=\d+/g,
      `sc-form-fields.css?v=${FORM_FIELDS_VERSION}`
    );
  }
  // Study toolbar only on calculator pages (not home/tools/pricing that merely link to *-pro)
  if (String(page).endsWith('-pro.html')) {
    if (!out.includes('sc-study.css')) {
      out = out.replace('</head>', `${STUDY_ASSETS}\n</head>`);
    } else {
      out = out
        .replace(/sc-study\.css\?v=\d+/g, `sc-study.css?v=${STUDY_VERSION}`)
        .replace(/sc-study\.js\?v=\d+/g, `sc-study.js?v=${STUDY_VERSION}`);
    }
  } else {
    out = out
      .replace(/\s*<link rel="stylesheet" href="\.\/sc-study\.css[^"]*">\s*/g, '\n')
      .replace(/\s*<script src="\.\/sc-study\.js[^"]*" defer><\/script>\s*/g, '\n');
  }
  return out;
}

function stripOldNav(html, mode) {
  html = html.replace(/<!--SC-SITE-NAV-START-->[\s\S]*?<!--SC-SITE-NAV-END-->\n?/g, '');
  html = html.replace(/<div class="sc-tool-strip">[\s\S]*?<\/div>\n?/g, '');
  // Always drop leftover shared headers so inject cannot double-mount.
  html = html.replace(/<header class="site-header"[\s\S]*?<\/header>\s*/i, '');
  html = html.replace(/<div class="mobile-nav-overlay" id="mobileNav"[\s\S]*?<\/div>\s*/i, '');

  if (mode === 'topbar') {
    // Topbar contains nested .badge divs — close at the topbar that precedes .wrap
    html = html.replace(/<div class="topbar">[\s\S]*?<\/div>\s*(?=<div class="wrap")/i, '');
  }
  if (mode === 'pricing') {
    html = html.replace(/<header>[\s\S]*?<\/header>\s*/i, '');
  }
  if (mode === 'lit') {
    // keep .sc-header in DOM but CSS hides it; remove duplicate if we already converted
  }
  return html;
}

function setBodyBadge(html, badge) {
  if (!badge) {
    return html.replace(/<body([^>]*)>/i, (m, attrs) => {
      const cleaned = attrs.replace(/\s*data-tool-badge="[^"]*"/, '');
      return `<body${cleaned}>`;
    });
  }
  if (/<body[^>]*data-tool-badge=/.test(html)) {
    return html.replace(/data-tool-badge="[^"]*"/, `data-tool-badge="${badge}"`);
  }
  return html.replace(/<body([^>]*)>/i, `<body$1 data-tool-badge="${badge}">`);
}

function insertNav(html, block) {
  // Always mount at the top of <body> (never after late theme toggles).
  return html.replace(/<body([^>]*)>/i, `<body$1>\n${block}\n`);
}

autoRegisterProPages();

let ok = 0;
for (const row of PAGES) {
  const path = join(ROOT, row.page);
  if (!existsSync(path)) {
    console.error('[FAIL] missing', row.page);
    process.exit(1);
  }
  let html = readFileSync(path, 'utf8');
  html = ensureAssets(html, row.page);
  html = stripOldNav(html, row.strip);
  // Header owns #themeToggle — drop legacy floating / sidebar duplicates (avoid dual IDs)
  html = html.replace(/<button[^>]*\bid=["']themeToggle["'][^>]*>[\s\S]*?<\/button>\s*/gi, '');
  html = setBodyBadge(html, row.badge);
  let block = PARTIAL;
  if (row.toolStrip) block = `${PARTIAL}\n${row.toolStrip}`;
  html = insertNav(html, block);
  writeFileSync(path, html);
  ok++;
  console.log(`[OK] ${row.page}`);
}
console.log(`[PASS] Site header injected on ${ok} pages`);
