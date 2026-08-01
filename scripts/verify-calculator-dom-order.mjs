#!/usr/bin/env node
/**
 * Calculator-first DOM order release gate.
 *
 * Verifies every calculator page keeps the semantic order mandated by the
 * CALCULATOR-FIRST DOM ORDER RELEASE:
 *
 *   <body>
 *     site navigation
 *     calculator header
 *     calculator access/session bar
 *     calculator form and results     ← before guide
 *     methodology / evidence
 *     extended guide content          ← sc-guide-shell, after form
 *     related tools
 *     footer
 *   </body>
 *
 * Guards (fail closed):
 *  1. Exactly one <head> and one </head>.
 *  2. Exactly one <body> and one </body>.
 *  3. No block content element (<div>/<section>/<main>/<article>/<aside>/<nav>/<footer>)
 *     inside <head>.
 *  4. Guide block (SC-GUIDE-START) sits inside <body>.
 *  5. Calculator layout (.sc-layout) appears before the guide block.
 *  6. Guide block ends before </body>.
 *  7. H1 appears inside <body>.
 *  8. Calculator pages without a guide are still valid (guide optional).
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const TARGET = process.argv.includes('--dist') ? join(ROOT, 'dist') : ROOT;
const BLOCK_IN_HEAD = ['<div', '<section', '<main', '<article', '<aside', '<nav', '<footer'];
// Generator-managed pages: guide is injected at SC-GUIDE-MOUNT, so the mount
// marker is mandatory there (fail closed if an author forgets it). In dist the
// marker is replaced by the injected guide, so it is only checked on source.
const GENERATOR_MANAGED = new Set([
  'sc008-pro.html',
  'labor-pro.html',
  'quote-pro.html',
  'weld-pro.html',
  'machining-pro.html',
  'bearing-pro.html',
  'fits-pro.html',
  'surface-finish-pro.html',
  'bend-pro.html',
  'punching-pro.html',
]);
// Calculator form markers, in priority order. All calculator pages must place
// the form before the guide; not every page uses .sc-layout.
const FORM_MARKERS = ['class="sc-layout"', 'id="calcBtn"', 'sc-pro-gate-root', 'id="aEngine"', '<form'];
const errors = [];
const fail = (m) => errors.push(m);

function formPos(html) {
  for (const m of FORM_MARKERS) {
    const p = html.indexOf(m);
    if (p >= 0) return p;
  }
  return -1;
}

const pages = readdirSync(TARGET).filter((f) => f.endsWith('-pro.html')).sort();
if (!pages.length) {
  console.error(`[FAIL] no calculator pages found in ${TARGET}`);
  process.exit(1);
}

const report = [];
for (const file of pages) {
  const path = join(TARGET, file);
  if (!existsSync(path)) continue;
  const html = readFileSync(path, 'utf8');

  const headPos = html.indexOf('<head');
  const headEndPos = html.indexOf('</head>');
  const bodyPos = html.indexOf('<body');
  const bodyEndPos = html.indexOf('</body>');
  const guidePos = html.indexOf('<!--SC-GUIDE-START-->');
  const guideEndPos = html.indexOf('<!--SC-GUIDE-END-->');
  const layoutPos = formPos(html);
  const mountPos = html.indexOf('<!--SC-GUIDE-MOUNT-->');
  const h1Pos = html.indexOf('<h1');

  // 1–2. Exactly one head / body pair.
  const headCount = (html.match(/<head(?:\s[^>]*)?>/g) || []).length;
  const headEndCount = (html.match(/<\/head>/g) || []).length;
  const bodyCount = (html.match(/<body(?:\s[^>]*)?>/g) || []).length;
  const bodyEndCount = (html.match(/<\/body>/g) || []).length;
  if (headCount !== 1) fail(`${file}: expected exactly one <head>, got ${headCount}`);
  if (headEndCount !== 1) fail(`${file}: expected exactly one </head>, got ${headEndCount}`);
  if (bodyCount !== 1) fail(`${file}: expected exactly one <body>, got ${bodyCount}`);
  if (bodyEndCount !== 1) fail(`${file}: expected exactly one </body>, got ${bodyEndCount}`);

  if (headPos >= 0 && headEndPos > headPos) {
    // 3. No block content element inside head.
    const head = html.slice(headPos, headEndPos + 7);
    for (const needle of BLOCK_IN_HEAD) {
      if (head.includes(needle)) fail(`${file}: block element ${needle.trim()} found inside <head>`);
    }
  }

  if (bodyPos >= 0 && bodyEndPos > bodyPos) {
    // 7. H1 inside body.
    if (h1Pos < 0 || h1Pos < bodyPos || h1Pos > bodyEndPos) {
      fail(`${file}: H1 missing or not inside <body>`);
    }
    if (guidePos >= 0) {
      // 4. Guide block inside body.
      if (guidePos < bodyPos) fail(`${file}: SC-GUIDE-START before <body>`);
      if (guidePos > bodyEndPos) fail(`${file}: SC-GUIDE-START after </body>`);
      // 5. Calculator form/layout before guide.
      if (layoutPos >= 0) {
        if (layoutPos < bodyPos) fail(`${file}: calculator form marker before <body>`);
        if (guidePos > bodyEndPos || guidePos < layoutPos) {
          fail(`${file}: guide must appear after calculator form (guide ${guidePos}, form ${layoutPos})`);
        }
      }
      // 6. Guide ends before </body>.
      if (guideEndPos < 0 || guideEndPos > bodyEndPos) {
        fail(`${file}: SC-GUIDE-END missing or after </body>`);
      }
    }

    // 8. Generator-managed pages must carry the mount marker (fail closed).
    // Only enforced on source — dist replaces the marker with the guide block.
    if (!process.argv.includes('--dist') && GENERATOR_MANAGED.has(file) && mountPos < 0) {
      fail(`${file}: missing SC-GUIDE-MOUNT marker (generator-managed page)`);
    }
  }

  report.push({
    file,
    hasGuide: guidePos >= 0,
    hasMount: mountPos >= 0,
    guideInBody: guidePos >= 0 && guidePos > bodyPos && guidePos < bodyEndPos,
    guideAfterLayout: layoutPos >= 0 && guidePos > layoutPos,
    guideEndBeforeBodyEnd: guideEndPos >= 0 && guideEndPos < bodyEndPos,
    h1InBody: h1Pos >= bodyPos && h1Pos < bodyEndPos,
    headClean: !BLOCK_IN_HEAD.some(
      (n) => headPos >= 0 && headEndPos > headPos && html.slice(headPos, headEndPos + 7).includes(n),
    ),
  });
}

if (errors.length) {
  console.error('[FAIL] verify-calculator-dom-order\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const withGuide = report.filter((r) => r.hasGuide);
const beforeBody = report.filter((r) => r.hasGuide && !r.guideInBody);
const beforeCalc = report.filter((r) => r.hasGuide && !r.guideAfterLayout);
const missingMount = report.filter((r) => r.hasGuide && !r.hasMount);

console.log(`[PASS] calculator DOM order: ${pages.length} pages · guides ${withGuide.length}`);
console.log(
  `  valid=${report.length} guide-before-body=${beforeBody.length} ` +
    `guide-before-calculator=${beforeCalc.length} missing-mount-marker=${missingMount.length}`,
);
if (missingMount.length) {
  console.log(
    `  note: authored guides without SC-GUIDE-MOUNT (not generator-managed): ${missingMount
      .map((r) => r.file)
      .join(', ')}`,
  );
}
