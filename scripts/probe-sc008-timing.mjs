import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(120000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
// Give the auto demo report a chance to finish so the page is idle.
await page.waitForTimeout(3000);

// Instrument: wrap compute timing with performance.now inside the page.
const r = await page.evaluate(async () => {
  const out = {};
  const w = window;
  const orig = w.compute;
  if (typeof orig !== 'function') return { error: 'no compute on window' };
  const t0 = performance.now();
  w.compute();
  out.computeMs = Math.round(performance.now() - t0);

  // Now time generateReport if exposed
  if (typeof w.generateReport === 'function') {
    const t1 = performance.now();
    w.generateReport();
    out.generateReportMs = Math.round(performance.now() - t1);
  } else {
    out.generateReportMs = 'n/a';
  }
  return out;
});
console.log('PAGE TIMING:', JSON.stringify(r));

// Also count how many numeric inputs exist and dimensions count
const meta = await page.evaluate(() => ({
  dims: document.querySelectorAll('#dimList .sc-dim').length,
  engine: window.ENGINE_VERSION || 'n/a'
}));
console.log('META:', JSON.stringify(meta));

await browser.close();
