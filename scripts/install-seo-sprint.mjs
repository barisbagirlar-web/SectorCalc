#!/usr/bin/env node
/**
 * Install & activate sectorcalc-seo-sprint package into the live site.
 *
 * Safe rules:
 * - Never overwrite working *-pro.html calculators with redirect stubs.
 * - Pretty /calculator/* URLs are served via Firebase rewrites.
 * - Content pages land in public/ and ship with dist via Vite.
 * - AggregateRating from sprint schema-template is NOT applied (inject-seo law).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_CANDIDATES = [
  path.join(ROOT, "sectorcalc-seo-sprint"),
  path.join(ROOT, "sectorcalc-seo-sprint (1)"),
];
const SRC = SRC_CANDIDATES.find((p) => fs.existsSync(p));
if (!SRC) {
  console.error("SEO sprint package not found under repo root.");
  process.exit(1);
}

const REDIRECT_MAP = {
  "sc008-pro.html": "calculator/tolerance-stack-up",
  "machining-pro.html": "calculator/cnc-feeds-speeds",
  "tap-thread-pro.html": "calculator/tap-thread-milling",
  "cycle-cost-pro.html": "calculator/cycle-time-cost",
  "bearing-pro.html": "calculator/bearing-life-l10",
  "bearing-freq-pro.html": "calculator/bearing-frequencies",
  "belt-chain-pro.html": "calculator/belt-chain-drive",
  "shaft-pro.html": "calculator/shaft-design",
  "fits-pro.html": "calculator/iso-286-fits",
  "surface-finish-pro.html": "calculator/surface-finish",
  "weld-pro.html": "calculator/weld-thickness",
  "heat-input-pro.html": "calculator/weld-heat-input",
  "bend-pro.html": "calculator/sheet-metal-bend",
  "punching-pro.html": "calculator/punching-force",
  "sling-pro.html": "calculator/sling-capacity",
  "shackle-eyebolt-pro.html": "calculator/shackle-eyebolt",
  "pressure-vessel-pro.html": "calculator/pressure-vessel-shell",
  "pipe-wall-pro.html": "calculator/pipe-wall-thickness",
  "hydraulic-pro.html": "calculator/hydraulic-cylinder",
  "bolt-pro.html": "calculator/bolt-torque-preload",
  "bolted-joint-pro.html": "calculator/bolted-joint",
  "labor-pro.html": "calculator/true-labor-cost",
  "quote-pro.html": "calculator/quote-pricing",
  "oee-pro.html": "calculator/oee-teep",
  "machine-rate-pro.html": "calculator/machine-hour-rate",
};

const TITLE_META = {
  "sc008-pro.html": {
    title:
      "SC-008 Tolerance Stack-Up Calculator | Deterministic Monte Carlo | SectorCalc",
    description:
      "Deterministic 1D tolerance stack-up with worst-case, RSS, and seeded Monte Carlo (10,000 iterations). Predicted Cpk, PPM, and full A1-A5 audit trail. Client-side only.",
    h1: "SC-008 Tolerance Stack-Up Calculator: Worst-Case, RSS, and Seeded Monte Carlo",
  },
  "machining-pro.html": {
    title: "SC-020 CNC Feeds & Speeds + Tool Life Calculator | SectorCalc",
    description:
      "Calculate cutting speed, feed rate, and Taylor tool life with chip thinning and deterministic Decimal engine. Full audit trail. Client-side only.",
    h1: "CNC Feeds & Speeds + Tool Life Calculator",
  },
  "tap-thread-pro.html": {
    title: "SC-022 Tap & Thread Milling Calculator | SectorCalc",
    description:
      "Thread milling and tapping parameters with pitch, lead angle, and torque estimation. Deterministic engine with visible formulas.",
    h1: "Tap & Thread Milling Calculator",
  },
  "cycle-cost-pro.html": {
    title: "SC-023 Cycle Time & Cost per Part Calculator | SectorCalc",
    description:
      "Calculate true cycle time, setup burden, and cost per good part with scrap rate and deterministic engine.",
    h1: "Cycle Time & Cost per Part Calculator",
  },
  "bearing-pro.html": {
    title: "SC-021 Bearing Life L10 / Lnm Calculator (ISO 281) | SectorCalc",
    description:
      "ISO 281 bearing life calculator with aISO adjustment, viscosity ratio kappa, and contamination factor eC. Deterministic audit trail.",
    h1: "Bearing Life L10 / Lnm Calculator (ISO 281)",
  },
  "bearing-freq-pro.html": {
    title: "SC-024 Bearing Defect Frequencies (BPFO/BPFI/BSF/FTF) | SectorCalc",
    description:
      "Calculate bearing defect frequencies for vibration analysis. BPFO, BPFI, BSF, FTF with deterministic formulas.",
    h1: "Bearing Defect Frequencies Calculator",
  },
  "belt-chain-pro.html": {
    title: "SC-025 Belt & Chain Drive Sizing Calculator | SectorCalc",
    description:
      "Belt and chain drive sizing with speed ratio, center distance, and tension calculations. Deterministic engine.",
    h1: "Belt & Chain Drive Sizing Calculator",
  },
  "shaft-pro.html": {
    title: "SC-026 Shaft Design Calculator (Torsion + Bending) | SectorCalc",
    description:
      "Shaft design with combined torsion and bending stress, fatigue factor, and safety margin. Deterministic audit trail.",
    h1: "Shaft Design Calculator (Torsion + Bending)",
  },
  "fits-pro.html": {
    title: "SC-027 ISO 286 Fits & Clearances Calculator | SectorCalc",
    description:
      "ISO 286 fit and clearance calculator with H7/g6, deviation tables, and interference/shrink fit analysis.",
    h1: "ISO 286 Fits & Clearances Calculator",
  },
  "surface-finish-pro.html": {
    title: "SC-028 Surface Finish Converter (Ra / Rz / Rmax) | SectorCalc",
    description:
      "Convert between Ra, Rz, Rmax, and other surface finish parameters. Deterministic reference values.",
    h1: "Surface Finish Converter (Ra / Rz)",
  },
  "weld-pro.html": {
    title: "SC-001 Weld Thickness Calculator | SectorCalc",
    description:
      "Fillet weld throat and leg sizing per AWS D1.1 and ISO standards. Deterministic formula visibility.",
    h1: "Weld Thickness Calculator",
  },
  "heat-input-pro.html": {
    title: "SC-029 Weld Heat Input & t8/5 Calculator | SectorCalc",
    description:
      "Calculate welding heat input and cooling time t8/5 for WPS/PQR screening. Deterministic engine.",
    h1: "Weld Heat Input & t8/5 Calculator",
  },
  "bend-pro.html": {
    title: "SC-030 Sheet Metal Bend & K-Factor Calculator | SectorCalc",
    description:
      "Sheet metal bend allowance, K-factor, and flat pattern calculation with material database.",
    h1: "Sheet Metal Bend & K-Factor Calculator",
  },
  "punching-pro.html": {
    title: "SC-039 Punching Force & Die Clearance Calculator | SectorCalc",
    description:
      "Punching force, stripping force, and die clearance for sheet metal operations. Deterministic.",
    h1: "Punching Force & Die Clearance Calculator",
  },
  "sling-pro.html": {
    title: "SC-031 Sling Capacity & Angle Verification Calculator | SectorCalc",
    description:
      "Sling capacity reduction at angles, multi-leg load sharing, and safe working load verification.",
    h1: "Sling Capacity & Angle Calculator",
  },
  "shackle-eyebolt-pro.html": {
    title: "SC-032 Shackle & Eye-Bolt Verification Calculator | SectorCalc",
    description:
      "Shackle and eye-bolt working load limit verification with angle derating and safety factors.",
    h1: "Shackle & Eye-Bolt Verification Calculator",
  },
  "pressure-vessel-pro.html": {
    title: "SC-033 ASME VIII Pressure Vessel Shell Calculator | SectorCalc",
    description:
      "ASME Section VIII Division 1 internal pressure shell thickness calculator. Deterministic audit trail.",
    h1: "ASME VIII Pressure Vessel Shell Calculator",
  },
  "pipe-wall-pro.html": {
    title: "SC-034 ASME B31.3 Pipe Wall / MAWP Calculator | SectorCalc",
    description:
      "ASME B31.3 pipe wall thickness and MAWP calculator with corrosion allowance and mill tolerance.",
    h1: "ASME B31.3 Pipe Wall / MAWP Calculator",
  },
  "hydraulic-pro.html": {
    title: "SC-040 Hydraulic Cylinder Sizing Calculator | SectorCalc",
    description:
      "Hydraulic cylinder bore, rod, and pressure sizing with force, velocity, and flow calculations.",
    h1: "Hydraulic Cylinder Sizing Calculator",
  },
  "bolt-pro.html": {
    title: "SC-035 Bolt Torque & Preload Calculator (VDI 2230) | SectorCalc",
    description:
      "VDI 2230 bolt torque and preload calculator with friction coefficients and tightening factor.",
    h1: "Bolt Torque & Preload Calculator (VDI 2230)",
  },
  "bolted-joint-pro.html": {
    title: "SC-036 Bolted Joint Verification (VDI 2230) | SectorCalc",
    description:
      "Bolted joint verification with axial stiffness, preload, and clamping force analysis per VDI 2230.",
    h1: "Bolted Joint Verification Calculator",
  },
  "labor-pro.html": {
    title: "SC-010 True Labor Cost Calculator | SectorCalc",
    description:
      "True loaded labor cost with statutory burden, benefits, overhead, and indirect time. Deterministic.",
    h1: "True Labor Cost Calculator",
  },
  "quote-pro.html": {
    title: "SC-012 Quote Pricing / Full-Cost Margin Calculator | SectorCalc",
    description:
      "Quote pricing with material, labor, overhead, markup, and margin analysis. Deterministic audit trail.",
    h1: "Quote Pricing / Full-Cost Margin Calculator",
  },
  "oee-pro.html": {
    title: "SC-037 OEE / TEEP / Capacity Loss Calculator | SectorCalc",
    description:
      "Overall Equipment Effectiveness, TEEP, and capacity loss breakdown with availability, performance, and quality.",
    h1: "OEE / TEEP / Capacity Loss Calculator",
  },
  "machine-rate-pro.html": {
    title: "SC-038 True Machine Hour Rate Calculator | SectorCalc",
    description:
      "True machine hour rate with depreciation, maintenance, power, and overhead allocation. Deterministic.",
    h1: "True Machine Hour Rate Calculator",
  },
};

const SEO_CSS = `/* SectorCalc SEO content pages — glossary / compare / guides */
:root {
  --bg: #0A1628;
  --text: #e2e8f0;
  --muted: #94a3b8;
  --blue: #0055A4;
  --orange: #E87722;
  --green: #22c55e;
  --card: rgba(255,255,255,0.03);
  --border: rgba(255,255,255,0.08);
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  background: radial-gradient(1200px 600px at 10% -10%, #12305a 0%, var(--bg) 55%);
  color: var(--text);
  line-height: 1.65;
}
a { color: #7dd3fc; text-decoration: none; }
a:hover { text-decoration: underline; }
.sc-header, .sc-footer {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 1rem 1.5rem; border-bottom: 1px solid var(--border);
}
.sc-footer { border-top: 1px solid var(--border); border-bottom: 0; margin-top: 3rem; flex-wrap: wrap; }
.sc-logo { font-weight: 800; color: #fff; letter-spacing: 0.02em; }
.sc-nav { display: flex; flex-wrap: wrap; gap: 0.9rem; }
.sc-glossary-page, .sc-compare-page, .sc-guide-page, .sc-content-page {
  max-width: 920px; margin: 0 auto; padding: 1.5rem;
}
.sc-breadcrumb ol { display: flex; flex-wrap: wrap; gap: 0.4rem; list-style: none; padding: 0; margin: 0 0 1.25rem; color: var(--muted); font-size: 0.9rem; }
.sc-breadcrumb li:not(:last-child)::after { content: "/"; margin-left: 0.4rem; color: #64748b; }
h1 { font-size: clamp(1.6rem, 3vw, 2.2rem); line-height: 1.2; margin: 0 0 1rem; }
h2 { margin-top: 2rem; }
.term-highlight { color: var(--orange); }
.definition-box, .sc-cta-panel, .sc-facts-table, .sc-term-card, .compare-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1.1rem 1.25rem;
}
.sc-facts-table { width: 100%; border-collapse: collapse; }
.sc-facts-table th, .sc-facts-table td { text-align: left; padding: 0.55rem 0.4rem; border-bottom: 1px solid var(--border); }
.sc-cta-buttons { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1rem 0; }
.sc-btn-primary, .sc-btn-secondary {
  display: inline-block; padding: 0.7rem 1rem; border-radius: 8px; font-weight: 700;
}
.sc-btn-primary { background: var(--orange); color: #111; }
.sc-btn-secondary { border: 1px solid var(--border); color: var(--text); }
.sc-term-grid, .compare-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
.sc-faq-item { border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem 1rem; margin: 0.6rem 0; background: var(--card); }
.sc-cta-note, .lead-definition { color: var(--muted); }
code { color: #fde68a; }
`;

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function patchContentHtml(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replace(
    /<link rel="stylesheet" href="\/assets\/css\/sectorcalc-base\.css">/g,
    '<link rel="stylesheet" href="/css/seo-content.css?v=1">',
  );
  // Prefer live calculator file URLs inside content CTAs only when rewrite not yet known by crawlers —
  // keep /calculator/* links; Firebase rewrites activate them.
  fs.writeFileSync(filePath, html);
}

function writeIndex(dir, title, blurb, links) {
  const items = links
    .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
    .join("\n        ");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | SectorCalc</title>
  <meta name="description" content="${blurb}">
  <link rel="canonical" href="https://sectorcalc.com/${dir}">
  <meta name="robots" content="index,follow">
  <link rel="stylesheet" href="/css/seo-content.css">
</head>
<body>
  <header class="sc-header">
    <a href="/" class="sc-logo">SectorCalc</a>
    <nav class="sc-nav">
      <a href="/tools.html">Tools</a>
      <a href="/glossary/">Glossary</a>
      <a href="/compare/">Compare</a>
      <a href="/guides/">Guides</a>
      <a href="/pricing.html">Pricing</a>
    </nav>
  </header>
  <main class="sc-content-page">
    <h1>${title}</h1>
    <p class="lead-definition">${blurb}</p>
    <ul>
        ${items}
    </ul>
  </main>
  <footer class="sc-footer">
    <p>Copyright 2026 SectorCalc. Deterministic industrial engineering calculators.</p>
  </footer>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, "public", dir, "index.html"), html);
}

function updateTitleMetaH1() {
  for (const [file, meta] of Object.entries(TITLE_META)) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) {
      console.warn("skip missing", file);
      continue;
    }
    let html = fs.readFileSync(full, "utf8");
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
    if (/name=["']description["']/i.test(html)) {
      html = html.replace(
        /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
        `<meta name="description" content="${meta.description}">`,
      );
      html = html.replace(
        /<meta\s+content=["'][\s\S]*?["']\s+name=["']description["']\s*\/?>/i,
        `<meta name="description" content="${meta.description}">`,
      );
    } else {
      html = html.replace(/<\/title>/i, `</title>\n<meta name="description" content="${meta.description}">`);
    }
    // Update visible header title when present (keeps layout class)
    html = html.replace(
      /(<h1 class="sc-header-title">)([\s\S]*?)(<\/h1>)/i,
      `$1${meta.h1}$3`,
    );
    fs.writeFileSync(full, html);
    console.log("title/meta/h1", file);
  }
}

function patchToolsInternalLinks() {
  const toolsPath = path.join(ROOT, "tools.html");
  if (!fs.existsSync(toolsPath)) return;
  let html = fs.readFileSync(toolsPath, "utf8");
  const markerStart = "<!--SC-SEO-SPRINT-LINKS-START-->";
  const markerEnd = "<!--SC-SEO-SPRINT-LINKS-END-->";
  const block = `${markerStart}
<section class="sc-seo-sprint-links" aria-label="Engineering resources">
  <h2>Engineering Resources</h2>
  <p>Glossary, comparison pages, and complete guides for shop-floor decision making.</p>
  <ul>
    <li><a href="/glossary">Engineering Glossary</a></li>
    <li><a href="/compare">SectorCalc vs Alternatives</a></li>
    <li><a href="/guides">Complete Engineering Guides</a></li>
  </ul>
</section>
${markerEnd}`;
  // Always remount inside .wrap immediately before <footer> — never as an orphan body child.
  html = html.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\n?`, "g"), "");
  if (html.includes("<footer>")) {
    html = html.replace("<footer>", `${block}\n  <footer>`);
  } else if (html.includes("</main>")) {
    html = html.replace("</main>", `${block}\n</main>`);
  } else {
    throw new Error("tools.html missing <footer> for Engineering Resources mount");
  }
  fs.writeFileSync(toolsPath, html);
  console.log("tools.html internal links updated");
}

function updateFirebase() {
  const firebasePath = path.join(ROOT, "firebase.json");
  const cfg = JSON.parse(fs.readFileSync(firebasePath, "utf8"));
  const hosting = cfg.hosting;

  const calcRedirects = Object.entries(REDIRECT_MAP).map(([oldFile, pretty]) => ({
    source: `/${oldFile}`,
    destination: `/${pretty}`,
    type: 301,
  }));

  // Keep existing non-pro redirects, replace pro.html redirects with sprint map.
  const keep = (hosting.redirects || []).filter(
    (r) =>
      !String(r.source).endsWith("-pro.html") &&
      !String(r.source).startsWith("/calculator/"),
  );
  hosting.redirects = [...keep, ...calcRedirects];

  const calcRewrites = Object.entries(REDIRECT_MAP).map(([oldFile, pretty]) => ({
    source: `/${pretty}`,
    destination: `/${oldFile}`,
  }));

  const contentDirs = ["glossary", "compare", "guides"];
  const contentRewrites = [];
  for (const dir of contentDirs) {
    const dirPath = path.join(ROOT, "public", dir);
    if (!fs.existsSync(dirPath)) continue;
    for (const name of fs.readdirSync(dirPath)) {
      if (!name.endsWith(".html") || name === "index.html") continue;
      const slug = name.replace(/\.html$/, "");
      contentRewrites.push({
        source: `/${dir}/${slug}`,
        destination: `/${dir}/${name}`,
      });
    }
    contentRewrites.push({
      source: `/${dir}`,
      destination: `/${dir}/index.html`,
    });
    contentRewrites.push({
      source: `/${dir}/`,
      destination: `/${dir}/index.html`,
    });
  }

  hosting.rewrites = [...calcRewrites, ...contentRewrites];
  fs.writeFileSync(firebasePath, JSON.stringify(cfg, null, 2) + "\n");
  console.log(
    `firebase.json: ${calcRedirects.length} redirects, ${hosting.rewrites.length} rewrites`,
  );
}

function installContent() {
  ensureDir(path.join(ROOT, "public", "css"));
  fs.writeFileSync(path.join(ROOT, "public", "css", "seo-content.css"), SEO_CSS);

  for (const dir of ["glossary", "compare", "guides"]) {
    copyDir(path.join(SRC, dir), path.join(ROOT, "public", dir));
    for (const name of fs.readdirSync(path.join(ROOT, "public", dir))) {
      if (name.endsWith(".html")) {
        patchContentHtml(path.join(ROOT, "public", dir, name));
      }
    }
  }

  // sitemap → public root (Vite copies to dist)
  fs.copyFileSync(
    path.join(SRC, "sitemap.xml"),
    path.join(ROOT, "public", "sitemap.xml"),
  );

  // Fix blog article locs in sitemap to existing .html files (live returns 404 without .html)
  let sitemap = fs.readFileSync(path.join(ROOT, "public", "sitemap.xml"), "utf8");
  sitemap = sitemap.replace(
    /https:\/\/sectorcalc\.com\/blog\/([a-z0-9-]+)(<\/loc>)/g,
    (m, slug, close) => {
      if (slug === "" || slug.endsWith(".html")) return m;
      const candidate = path.join(ROOT, "public", "blog", `${slug}.html`);
      if (fs.existsSync(candidate)) {
        return `https://sectorcalc.com/blog/${slug}.html${close}`;
      }
      return m;
    },
  );
  // Drop resource URLs that are not shipped in this sprint (avoid sitemap 404s)
  sitemap = sitemap.replace(
    /\n\s*<!-- RESOURCES[\s\S]*?(?=\n<\/urlset>)/,
    "\n\n",
  );
  fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), sitemap);

  // Index pages
  const glossaryLinks = fs
    .readdirSync(path.join(ROOT, "public", "glossary"))
    .filter((f) => f.endsWith(".html") && f !== "index.html")
    .map((f) => {
      const slug = f.replace(/\.html$/, "");
      return [`/glossary/${slug}`, slug.replace(/-/g, " ")];
    });
  const compareLinks = fs
    .readdirSync(path.join(ROOT, "public", "compare"))
    .filter((f) => f.endsWith(".html") && f !== "index.html")
    .map((f) => {
      const slug = f.replace(/\.html$/, "");
      return [`/compare/${slug}`, slug.replace(/-/g, " ")];
    });
  const guideLinks = fs
    .readdirSync(path.join(ROOT, "public", "guides"))
    .filter((f) => f.endsWith(".html") && f !== "index.html")
    .map((f) => {
      const slug = f.replace(/\.html$/, "");
      return [`/guides/${slug}`, slug.replace(/-/g, " ")];
    });

  writeIndex(
    "glossary",
    "Engineering Glossary",
    "Definitions for tolerance analysis, machining, bearings, welding, and manufacturing economics.",
    glossaryLinks,
  );
  writeIndex(
    "compare",
    "SectorCalc Comparisons",
    "How SectorCalc compares to spreadsheets, CAD modules, and classic shop calculators.",
    compareLinks,
  );
  writeIndex(
    "guides",
    "Complete Engineering Guides",
    "Long-form deterministic workflows for tolerance, CNC, bearings, weld sizing, and labor costing.",
    guideLinks,
  );

  // Keep package docs in repo for operators
  ensureDir(path.join(ROOT, "content", "seo-sprint"));
  for (const f of [
    "DEPLOY-CHECKLIST.txt",
    "redirect-map.txt",
    "schema-template.txt",
    "title-meta-h1-rewrites.txt",
    "redirect-template.html",
  ]) {
    const from = path.join(SRC, f);
    if (fs.existsSync(from)) {
      fs.copyFileSync(from, path.join(ROOT, "content", "seo-sprint", f));
    }
  }

  console.log("content installed from", path.basename(SRC));
}

function main() {
  console.log("Installing SEO sprint from:", SRC);
  installContent();
  updateTitleMetaH1();
  patchToolsInternalLinks();
  updateFirebase();
  console.log("DONE — next: python3 scripts/inject-seo.py && npm run build && firebase deploy --only hosting");
}

main();
