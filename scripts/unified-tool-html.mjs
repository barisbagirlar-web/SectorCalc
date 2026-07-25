import { basename } from 'node:path';

const TOOL_CODES = Object.freeze({
  'weld-pro.html': 'SC-001',
  'labor-pro.html': 'SC-010',
  'quote-pro.html': 'SC-012',
  'machining-pro.html': 'SC-020',
  'bearing-pro.html': 'SC-021',
  'tap-thread-pro.html': 'SC-022',
  'cycle-cost-pro.html': 'SC-023',
  'bearing-freq-pro.html': 'SC-024',
  'belt-chain-pro.html': 'SC-025',
  'shaft-pro.html': 'SC-026',
  'fits-pro.html': 'SC-027',
  'surface-finish-pro.html': 'SC-028',
  'heat-input-pro.html': 'SC-029',
  'bend-pro.html': 'SC-030',
  'sling-pro.html': 'SC-031',
  'shackle-eyebolt-pro.html': 'SC-032',
  'pressure-vessel-pro.html': 'SC-033',
  'pipe-wall-pro.html': 'SC-034',
  'bolt-pro.html': 'SC-035',
  'bolted-joint-pro.html': 'SC-036',
  'oee-pro.html': 'SC-037',
  'machine-rate-pro.html': 'SC-038',
  'punching-pro.html': 'SC-039',
  'hydraulic-pro.html': 'SC-040'
});

function capture(html, pattern, fallback) {
  return html.match(pattern)?.[0] ?? fallback;
}

function titleText(html, code) {
  const raw = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!raw) return `${code} Industrial Calculator`;
  return raw.replace(/\s*(?:—|\||-)\s*SectorCalc(?:\s+Pro)?\s*$/i, '').trim();
}

function descriptionText(html, code) {
  return (
    html.match(/<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["']([^"']*)["'][^>]*>/i)?.[1]?.trim() ??
    `${code} deterministic industrial engineering calculator with universal units, visible formulas, assumptions, warnings and an A1-A5 audit trail.`
  );
}

function guideBlock(html) {
  return html.match(/<!--SC-GUIDE-START-->[\s\S]*?<!--SC-GUIDE-END-->/i)?.[0] ?? '';
}

function buildHtml(file, code, original) {
  const title = capture(original, /<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${code} Industrial Calculator — SectorCalc Pro</title>`);
  const description = capture(
    original,
    /<meta\b[^>]*\bname=["']description["'][^>]*>/i,
    `<meta name="description" content="${code} deterministic industrial engineering calculator with universal units and A1-A5 audit trail.">`
  );
  const canonical = capture(
    original,
    /<link\b[^>]*\brel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="https://sectorcalc.com/${file}">`
  );
  const pageTitle = titleText(original, code);
  const pageSummary = descriptionText(original, code);
  const guide = guideBlock(original);
  const guideAssets = guide
    ? '<link rel="stylesheet" href="./sc-tool-guide.css?v=3"><script src="./sc-tool-guide.js?v=3" defer></script>'
    : '';
  const dwg = `${code}-001`;

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
<script>(function(){try{var t=localStorage.getItem('sectorcalc-theme');if(t!=='dark'&&t!=='light')t=(matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${title}
${description}
${canonical}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./sectorcalc-engineering.css">
<link rel="stylesheet" href="./sc-site-nav.css?v=1">
<link rel="stylesheet" href="./sc-form-fields.css?v=4">
<script src="./sc-site-nav.js?v=1" defer></script>
${guideAssets}
<style>
.theme-calc-runtime{min-height:100vh;padding:1.25rem 1rem 2rem;background:var(--cs-bg,#fff);color:var(--cs-text,#1a1a1a)}
.cs-runtime-sheet{max-width:1440px;margin:0 auto;border:2px solid var(--cs-border,#1A3A5C);background:#fff;position:relative}
.cs-runtime-header{display:flex;justify-content:space-between;gap:1.5rem;align-items:flex-start;padding:1.5rem 2rem;border-bottom:2px solid var(--cs-border,#1A3A5C);background:#FAFBFC}
.cs-runtime-header h1{margin:0 0 .35rem;font-size:1.55rem;color:var(--cs-border,#1A3A5C)}
.cs-runtime-sub{font-family:var(--font-mono,ui-monospace,monospace);font-size:.68rem;color:#888;text-transform:uppercase;letter-spacing:.1em}
.cs-runtime-meta{text-align:right;font-family:var(--font-mono,ui-monospace,monospace);font-size:.65rem;color:#666;line-height:1.55}
.cs-runtime-meta .eng{font-size:.85rem;font-weight:700;color:var(--cs-accent,#1A3A5C);margin-bottom:.2rem}
.cs-runtime-nav{display:flex;flex-wrap:wrap;background:var(--cs-accent,#1A3A5C)}
.cs-runtime-nav a{color:#fff;text-decoration:none;font-family:var(--font-mono,ui-monospace,monospace);font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;padding:.7rem 1.1rem;border-right:1px solid rgba(255,255,255,.15)}
.cs-runtime-nav a:hover{background:rgba(255,255,255,.1)}
.cs-runtime-body{padding:1.25rem 1.5rem 2rem}
.cs-stamp{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 1rem}
.cs-stamp span{font-family:var(--font-mono,ui-monospace,monospace);font-size:.62rem;text-transform:uppercase;letter-spacing:.08em;border:1px solid rgba(26,58,92,.25);padding:.25rem .55rem;color:var(--cs-accent,#1A3A5C);background:#FAFBFC}
@media(max-width:900px){.cs-runtime-header{flex-direction:column}.cs-runtime-meta{text-align:left}}
</style>
</head>
<body class="theme-calc-runtime" data-tool-code="${code}">
<header class="site-header" id="siteHeader" role="banner">
  <a href="/" class="brand" aria-label="SectorCalc Home"><span class="brand-mark"><img class="logo-light" src="/sectorcalc-logo.png" alt="SectorCalc" width="183" height="48"><img class="logo-dark" src="/sectorcalc-logo-dark.png?v=2" alt="" width="183" height="48" aria-hidden="true"></span></a>
  <nav class="main-nav" role="navigation" aria-label="Main navigation"><ul><li><a href="/tools.html">Tools</a></li><li><a href="/#method">Method</a></li><li><a href="/#standards">Standards</a></li><li><a href="/pricing.html">Pricing</a></li></ul><span class="sc-nav-tool" aria-hidden="true">${code}</span><a href="/tools.html" class="btn btn-primary">All Calculators</a></nav>
  <button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav"><span></span><span></span><span></span></button>
</header>
<div class="mobile-nav-overlay" id="mobileNav" role="dialog" aria-label="Mobile menu" aria-hidden="true"><a href="/tools.html">All Tools</a><a href="/#method">Method</a><a href="/#standards">Standards</a><a href="/pricing.html">Pricing</a></div>
<div class="cs-runtime-sheet">
  <div class="cs-runtime-header">
    <div>
      <h1 id="toolTitle">${pageTitle}</h1>
      <div class="cs-runtime-sub">Deterministic · ISO 3864 · Audit Trail · Engineering preview</div>
      <p id="toolSummary" style="margin:.75rem 0 0;max-width:52rem;color:#555;font-size:.92rem">${pageSummary}</p>
      <div class="decision" style="margin-top:12px"><b>Decision:</b> <span id="decisionText">Run the stated engineering model, review its assumptions and warnings, then make the release decision against the governing standard and verified source data.</span></div>
    </div>
    <div class="cs-runtime-meta">
      <div class="eng" id="engineBadge">Loading deterministic engine…</div>
      <div>DWG NO: ${dwg}</div>
      <div>SCALE: NTS · REV: A</div>
      <div>ENGINE VERSION: <span id="toolCode">${code}</span></div>
      <div>DATE: 2026-07-25</div>
      <div class="units-global" style="margin-top:10px;justify-content:flex-end"><button id="metricBtn" class="active">All Metric</button><button id="imperialBtn">All Imperial</button></div>
    </div>
  </div>
  <nav class="cs-runtime-nav" aria-label="Drawing navigation">
    <a href="/">← Home</a>
    <a href="/tools.html">Tools Index</a>
    <a href="/sc008-pro.html">SC-008</a>
    <a href="/machining-pro.html">SC-020</a>
    <a href="/labor-pro.html">SC-010</a>
    <a href="/weld-pro.html">SC-001</a>
    <a href="/pricing.html">Pricing</a>
  </nav>
  <div class="cs-runtime-body">
    <div class="cs-stamp">
      <span>DWG NO ${dwg}</span>
      <span>SCALE NTS</span>
      <span>REV A</span>
      <span>ISO 3864</span>
      <span>Audit Trail A1–A5</span>
      <span>Deterministic</span>
    </div>
    <div class="toolstrip" style="display:none"><b><span>${code}</span> · SectorCalc Pro</b><span class="engine">hidden</span></div>
    <main class="wrap" style="padding:0;max-width:none">
      <section class="layout">
        <aside class="panel input-panel"><div class="panel-h">1 · Engineering Inputs <span>DWG SEC-A · Universal units</span></div><div class="panel-b"><div id="fields"></div><div class="actions"><button class="btn primary" id="calcBtn">CALCULATE &amp; AUDIT</button><button class="btn light" id="save1">Save S1</button><button class="btn light" id="load1">Load S1</button><button class="btn light" id="save2">Save S2</button><button class="btn light" id="load2">Load S2</button></div></div></aside>
        <section><div id="verdict" class="verdict pass"></div><div id="warnings"></div><div id="kpis" class="kpis"></div>
          <div class="panel"><div class="panel-h">2 · Calculation Results <span>DWG SEC-B · Engine-owned</span></div><div class="panel-b"><table id="resultTable"></table></div></div>
          <div class="panel" style="margin-top:18px"><div class="panel-h">3 · Engineering Charts</div><div class="panel-b charts"><div class="chart"><b>Sensitivity — same engine contract</b><canvas id="sensitivity" width="560" height="270"></canvas></div><div class="chart"><b>Normalized Decision Risk</b><canvas id="riskChart" width="560" height="270"></canvas></div></div></div>
          <div class="panel" style="margin-top:18px"><div class="panel-h">Canonical Input Snapshot</div><div class="panel-b" id="inputPreview"></div></div>
          <div class="panel audit"><div class="panel-h">4 · Audit / Review — A1–A5 <span class="toolbar"><button id="copyBtn">Copy Audit</button><button id="jsonBtn">JSON</button><button id="printBtn">PDF / Print</button></span></div><div class="panel-b">
            <details open><summary>A1 · Engine Identity &amp; Integrity</summary><div class="body" id="auditEngine"></div></details>
            <details open><summary>A2 · Input Snapshot — entered + canonical</summary><div class="body" id="auditInputs"></div></details>
            <details><summary>A3 · Formulas Applied</summary><div class="body" id="auditFormulas"></div></details>
            <details><summary>A4 · Engineering Assumptions / Model Boundary</summary><div class="body" id="auditAssumptions"></div></details>
            <details open><summary>A5 · Warnings &amp; Limit Checks</summary><div class="body" id="auditWarnings"></div></details>
          </div></div>
        </section>
      </section>
    </main>
  </div>
  <div class="cs-audit-footer" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0;border-top:2px solid var(--cs-border,#1A3A5C);font-family:var(--font-mono,ui-monospace,monospace);font-size:.68rem">
    <div style="padding:.75rem 1rem;border-right:1px solid rgba(26,58,92,.12)"><div style="color:#888;text-transform:uppercase;font-size:.55rem;letter-spacing:.1em">DWG NO</div><div style="font-weight:700;color:var(--cs-accent,#1A3A5C)">${dwg}</div></div>
    <div style="padding:.75rem 1rem;border-right:1px solid rgba(26,58,92,.12)"><div style="color:#888;text-transform:uppercase;font-size:.55rem;letter-spacing:.1em">SCALE</div><div style="font-weight:700">NTS</div></div>
    <div style="padding:.75rem 1rem;border-right:1px solid rgba(26,58,92,.12)"><div style="color:#888;text-transform:uppercase;font-size:.55rem;letter-spacing:.1em">REV</div><div style="font-weight:700">A</div></div>
    <div style="padding:.75rem 1rem;border-right:1px solid rgba(26,58,92,.12)"><div style="color:#888;text-transform:uppercase;font-size:.55rem;letter-spacing:.1em">ENGINE VERSION</div><div style="font-weight:700">${code}</div></div>
    <div style="padding:.75rem 1rem;border-right:1px solid rgba(26,58,92,.12)"><div style="color:#888;text-transform:uppercase;font-size:.55rem;letter-spacing:.1em">ISO 3864</div><div style="font-weight:700">Safety colors</div></div>
    <div style="padding:.75rem 1rem;border-right:1px solid rgba(26,58,92,.12)"><div style="color:#888;text-transform:uppercase;font-size:.55rem;letter-spacing:.1em">Audit Trail</div><div style="font-weight:700">A1–A5</div></div>
    <div style="padding:.75rem 1rem"><div style="color:#888;text-transform:uppercase;font-size:.55rem;letter-spacing:.1em">Deterministic</div><div style="font-weight:700">YES</div></div>
  </div>
</div>
${guide}
<button class="theme" id="themeToggle" type="button" title="Toggle light/dark">◐ Theme</button>
<footer>SectorCalc Pro · Deterministic Decimal calculation · DWG / SCALE / REV / ENGINE VERSION / ISO 3864 / Audit Trail terminology. Governing standards and exact manufacturer/material data remain authoritative.</footer>
<script type="module" src="/src/industrial-tool.ts"></script>
</body>
</html>`;
}

export function unifiedToolHtmlPlugin() {
  return {
    name: 'sectorcalc-unified-tool-html',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const file = basename(ctx.filename || ctx.originalUrl || '');
        const code = TOOL_CODES[file];
        if (!code) return html;
        return buildHtml(file, code, html);
      }
    }
  };
}

export const UNIFIED_TOOL_CODES = TOOL_CODES;
