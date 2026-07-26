#!/usr/bin/env node
/**
 * Inject related-tools mesh before </body> on every *-pro.html (idempotent).
 * Hrefs use SEO registry pretty canonical paths (/calculator/*), never legacy *-pro.html.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { toolCanonicalBySourceFile, calculators } from '../seo/registry.mjs';

const ROOT = process.cwd();
const CSS_HREF = '/sc-related-tools.css?v=1';
const CANON = toolCanonicalBySourceFile();

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

const MATRIX = {
  'sc008-pro.html': DEFAULT,
  'machining-pro.html': [
    ['sc008-pro.html', 'SC-008 Tolerance Stack-Up', 'Close the loop from capability to stack'],
    ['bearing-pro.html', 'SC-021 Bearing Life', 'Life check after spindle loads'],
    ['machine-rate-pro.html', 'SC-038 Machine Hour Rate', 'Cost the cut after feeds & speeds'],
    ['oee-pro.html', 'SC-037 OEE', 'Availability and performance of the cell'],
  ],
  'bearing-pro.html': [
    ['sc008-pro.html', 'SC-008 Tolerance Stack-Up', 'Stack the fit before L10'],
    ['machining-pro.html', 'SC-020 Feeds & Speeds', 'Machine the raceway correctly'],
    ['bearing-freq-pro.html', 'SC-024 Bearing Frequencies', 'BPFO/BPFI after life sizing'],
    ['fits-pro.html', 'SC-027 Fits & Clearances', 'ISO 286 seat selection'],
  ],
  'weld-pro.html': [
    ['heat-input-pro.html', 'SC-029 Weld Heat Input', 't8/5 and heat input from parameters'],
    ['bend-pro.html', 'SC-030 Bend & K-Factor', 'Form after weld allowance'],
    ['sling-pro.html', 'SC-031 Sling Capacity', 'Lift the fabricated assembly'],
    ['pressure-vessel-pro.html', 'SC-033 Pressure Vessel', 'Shell thickness after weld design'],
  ],
  'machine-rate-pro.html': [
    ['machining-pro.html', 'SC-020 Feeds & Speeds', 'Cycle inputs for rate build-up'],
    ['oee-pro.html', 'SC-037 OEE', 'Effective hours in the rate'],
    ['cycle-cost-pro.html', 'SC-023 Cycle Time & Cost', 'Part cost from rate × time'],
    ['quote-pro.html', 'SC-012 Quote Pricing', 'Sell price from true cost'],
  ],
  'oee-pro.html': [
    ['machine-rate-pro.html', 'SC-038 Machine Hour Rate', 'Convert OEE into $/hr'],
    ['cycle-cost-pro.html', 'SC-023 Cycle Time & Cost', 'Cost at realized OEE'],
    ['labor-pro.html', 'SC-010 True Labor Cost', 'Labor burden in the cell'],
    ['quote-pro.html', 'SC-012 Quote Pricing', 'Margin after OEE reality'],
  ],
};

function card([file, title, desc]) {
  const href = pretty(file);
  return `    <a href="${href}" class="related-card">
      <div class="rt-title">${title}</div>
      <div class="rt-desc">${desc}</div>
    </a>`;
}

function block(page) {
  const links = MATRIX[page] || DEFAULT;
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
console.log(`[PASS] Related tools injected on ${n}/${calculators().length} calculator pages with pretty canonical hrefs`);
