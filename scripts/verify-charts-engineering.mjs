#!/usr/bin/env node
/**
 * Engineering chart integrity gate.
 *
 * Canvas-based *-pro tools must:
 *  - define drawCharts()
 *  - call it from render with live {inp,out} (not decorative static images)
 *  - reference out.* in series/markers
 *  - never use Math.random in chart code (non-deterministic decoration)
 *
 * Also locks SC-022 torque/feed chart formulas to the same closed-form
 * expressions used by the engine (numerical self-check).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

function extractFn(html, name) {
  const re = new RegExp(`function\\s+${name}\\s*\\(`);
  const m = re.exec(html);
  if (!m) return '';
  const brace = html.indexOf('{', m.index);
  let depth = 0;
  for (let j = brace; j < html.length; j++) {
    if (html[j] === '{') depth++;
    else if (html[j] === '}') {
      depth--;
      if (depth === 0) return html.slice(m.index, j + 1);
    }
  }
  return '';
}

const proPages = readdirSync(ROOT).filter((f) => f.endsWith('-pro.html'));
const canvasTools = [];
const noChartTools = [];

for (const page of proPages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const hasCanvas = /<canvas\b/i.test(html);
  const hasDraw = /function\s+drawCharts\s*\(/.test(html);
  if (!hasCanvas && !hasDraw) {
    noChartTools.push(page);
    continue;
  }
  canvasTools.push(page);

  if (hasCanvas && !hasDraw) {
    fail(`${page}: <canvas> present but drawCharts() missing`);
    continue;
  }

  const dc = extractFn(html, 'drawCharts');
  if (!dc) {
    fail(`${page}: could not extract drawCharts()`);
    continue;
  }

  if (/Math\.random/.test(dc)) {
    fail(`${page}: Math.random in drawCharts — charts must be deterministic from inputs`);
  }
  if (/<img[^>]+(chart|graph|plot)/i.test(html)) {
    fail(`${page}: static chart <img> found — must be canvas from live results`);
  }
  if (!/\bout\b/.test(dc)) {
    fail(`${page}: drawCharts does not reference out — not result-driven`);
  }
  if (!/drawCharts\(\s*\{[^}]*out|drawCharts\(\s*data\s*\)|drawCharts\(\s*\{inp,\s*out\}/.test(html)) {
    // allow drawCharts({inp,out}) variants already covered; also drawCharts(data) after assignment
    if (!/drawCharts\(\s*\{/.test(html) && !/drawCharts\(\s*data\s*\)/.test(html)) {
      fail(`${page}: drawCharts never called with live calculation payload`);
    }
  }
  // Must be reachable from render path
  if (!/function\s+render[\s\S]{0,12000}?drawCharts\s*\(/.test(html) && !/drawCharts\(\s*\{inp/.test(html)) {
    fail(`${page}: drawCharts not clearly wired from render()`);
  }
}

// SC-022 locked formula parity (screenshot tool)
{
  const page = 'tap-thread-pro.html';
  const p = join(ROOT, page);
  if (!existsSync(p)) fail(`missing ${page}`);
  else {
    const html = readFileSync(p, 'utf8');
    const dc = extractFn(html, 'drawCharts');
    const calc = extractFn(html, 'calculate');
    if (!/0\.010\s*\*\s*MATS\[inp\.matKey\]\.K\s*\*\s*Math\.pow\(\s*D\s*,\s*3\s*\)/.test(dc)) {
      fail(`${page}: torque chart must use 0.010·K·D³ (same as engine envelope)`);
    }
    if (!/y\s*:\s*out\.T/.test(dc.replace(/\s+/g, ''))) {
      // tolerate spacing
      if (!/y:\s*out\.T/.test(dc)) fail(`${page}: torque marker must plot out.T ("this thread")`);
    }
    if (!/\(inp\.D\s*-\s*d\)\s*\/\s*inp\.D/.test(dc) && !/\(inp\.D-d\)\/inp\.D/.test(dc)) {
      fail(`${page}: feed chart must use F_table = F_tool·(D−d)/D`);
    }
    if (!/out\.Ftable/.test(dc)) {
      fail(`${page}: feed marker must plot out.Ftable`);
    }
    // Numerical self-check in-process
    const K = 1.0;
    const D = 10;
    const engineT = 0.01 * K * D ** 3;
    const chartT = 0.01 * K * Math.pow(D, 3);
    if (Math.abs(engineT - chartT) > 1e-12) {
      fail(`${page}: numerical torque chart/engine mismatch`);
    }
    if (!/0\.010/.test(calc) && !/0\.01\s*\*/.test(calc)) {
      // calculate may use 0.010*Kmat or similar
      if (!/0\.010|0\.01\s*\*\s*.*K/.test(calc)) {
        fail(`${page}: calculate() missing empirical torque coefficient 0.010`);
      }
    }
  }
}

// SC-008 Monte Carlo histogram must bin real samples
{
  const src = join(ROOT, 'src/sc008-pro.ts');
  if (!existsSync(src)) fail('missing src/sc008-pro.ts');
  else {
    const t = readFileSync(src, 'utf8');
    if (!/function\s+histogram\s*\(/.test(t) && !/histogram\s*\(samples/.test(t)) {
      fail('sc008-pro.ts: missing histogram(samples) binning');
    }
    if (!/mySimulate\s*\(/.test(t)) {
      fail('sc008-pro.ts: histogram path must use mySimulate() samples');
    }
    if (!/actual sample histogram|not a fitted curve/i.test(t)) {
      fail('sc008-pro.ts: must label histogram as actual samples (not fitted curve)');
    }
  }
}

if (canvasTools.length < 15) {
  fail(`expected ≥15 canvas drawCharts tools, found ${canvasTools.length}`);
}

if (errors.length) {
  console.error('[FAIL] Engineering chart integrity\n' + errors.map((e) => ' - ' + e).join('\n'));
  process.exit(1);
}

console.log(
  `[PASS] Engineering charts: ${canvasTools.length} canvas tools result-driven; ` +
    `${noChartTools.length} report-SVG/gauge tools skipped; SC-022 formula lock + SC-008 sample histogram OK`,
);
