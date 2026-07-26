#!/usr/bin/env node
/**
 * Inject related-tools mesh before </body> on every *-pro.html (idempotent).
 * Hrefs use SEO registry pretty canonical paths (/calculator/*), never legacy *-pro.html.
 * Prefers registry relatedRoutes; falls back to a safe default mesh.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { toolCanonicalBySourceFile, calculators, publishedCalculators } from '../seo/registry.mjs';

const ROOT = process.cwd();
const CSS_HREF = '/sc-related-tools.css?v=1';
const CANON = toolCanonicalBySourceFile();
const BY_PATH = new Map(publishedCalculators().map((p) => [p.canonicalPath, p]));

function pretty(file) {
  const path = CANON[file];
  if (!path) throw new Error(`registry missing canonical for related tool ${file}`);
  return path;
}

const DEFAULT = [
  ['machining-pro.html', 'SC-020 Feeds & Speeds', 'Tolerance inputs from machining capability data'],
  ['bearing-pro.html', 'SC-021 Bearing Life', 'Validate fit assumptions after stack closure'],
  ['fits-pro.html', 'SC-027 Fits & Clearances', 'ISO 286 hole/shaft fit selection'],
  ['surface-finish-pro.html', 'SC-028 Surface Finish', 'Ra, Rz capability for stack surfaces'],
];

function linksFor(page) {
  const calc = publishedCalculators().find((p) => p.sourceFile === page);
  if (!calc?.relatedRoutes?.length) return DEFAULT;
  const out = [];
  for (const route of calc.relatedRoutes) {
    const other = BY_PATH.get(route);
    if (!other) continue;
    out.push([
      other.sourceFile,
      `${other.id} ${other.short || other.name}`,
      (other.description || other.short || '').slice(0, 96),
    ]);
  }
  return out.length ? out : DEFAULT;
}

function card([file, title, desc]) {
  const href = pretty(file);
  return `    <a href="${href}" class="related-card">
      <div class="rt-title">${title}</div>
      <div class="rt-desc">${desc}</div>
    </a>`;
}

function block(page) {
  const links = linksFor(page);
  return `<!--SC-RELATED-TOOLS-START-->
<section class="related-tools-section" aria-labelledby="related-tools-heading">
  <h2 id="related-tools-heading">Related Calculators</h2>
  <div class="related-grid">
${links.map(card).join('\n')}
  </div>
</section>
<!--SC-RELATED-TOOLS-END-->`;
}

function ensureCss(html) {
  if (html.includes('sc-related-tools.css')) {
    return html.replace(/sc-related-tools\.css\?v=\d+/g, 'sc-related-tools.css?v=1');
  }
  return html.replace('</head>', `<link rel="stylesheet" href="${CSS_HREF}">\n</head>`);
}

const pages = readdirSync(ROOT).filter((f) => f.endsWith('-pro.html'));
let n = 0;
for (const page of pages) {
  const path = join(ROOT, page);
  if (!existsSync(path)) continue;
  let html = readFileSync(path, 'utf8');
  html = html.replace(/<!--SC-RELATED-TOOLS-START-->[\s\S]*?<!--SC-RELATED-TOOLS-END-->\n?/g, '');
  html = ensureCss(html);
  const snippet = block(page);
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `${snippet}\n</body>`);
  } else {
    html += `\n${snippet}\n`;
  }
  writeFileSync(path, html);
  n++;
  console.log(`[OK] related-tools → ${page} (${CANON[page]})`);
}
console.log(`[PASS] Related tools injected on ${n}/${calculators().length} calculator pages with registry relatedRoutes`);
