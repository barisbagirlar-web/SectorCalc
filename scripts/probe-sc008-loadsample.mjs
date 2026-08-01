import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(150000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);

// Time SCStudy.loadSample() directly (bridge-independent) — this triggers
// loadPreset + compute + generateReport. Then time generateReport alone via #genReport.
const r = await page.evaluate(async () => {
  const w = window;
  const out = {};
  // Bridge-independent: call the tool's own report path through SCStudy if present.
  if (typeof w.SCStudy?.loadSample === 'function') {
    const t0 = performance.now();
    w.SCStudy.loadSample();
    out.loadSampleMs = Math.round(performance.now() - t0);
  }
  return out;
});
console.log('SCStudy.loadSample:', JSON.stringify(r));

// Now measure the pure report generation via a second loadSample (warm JIT).
const r2 = await page.evaluate(async () => {
  const w = window;
  const t0 = performance.now();
  w.SCStudy.loadSample();
  return { warmLoadSampleMs: Math.round(performance.now() - t0) };
});
console.log('warm loadSample:', JSON.stringify(r2));

await browser.close();
