/**
 * Measure a COLD compute on SC-008 (a brand-new simulation key after the
 * page-load demo run) so we see the real per-input cost, not a cache hit.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(60000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.waitForTimeout(5000);

const r = await page.evaluate(() => {
  const w = window;
  const el = document.getElementById('specUpper');
  // New spec limit -> different simulation key than the page-load demo run.
  el.value = '0.200';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return new Promise((resolve) => {
    // Wait out the 350ms input debounce, then time the cold compute directly.
    setTimeout(() => {
      w.__scDemoCalcPass = true;
      const t0 = performance.now();
      w.compute();
      const coldMs = Math.round(performance.now() - t0);
      w.__scDemoCalcPass = false;
      const live = document.getElementById('liveResult')?.textContent ?? '';
      resolve({ coldMs, live: live.replace(/\s+/g, ' ').trim().slice(0, 60) });
    }, 500);
  });
});
console.log('COLD COMPUTE:', JSON.stringify(r));

// Also time a full loadSample (what the demo bridge does) on top of warm cache.
const r2 = await page.evaluate(() => {
  const w = window;
  const t0 = performance.now();
  w.SCStudy.loadSample();
  return { loadSampleWarmMs: Math.round(performance.now() - t0) };
});
console.log('LOAD-SAMPLE WARM:', JSON.stringify(r2));

await browser.close();
