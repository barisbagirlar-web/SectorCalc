/**
 * Measure restoreDemoSnapshot cost and whether it fires input events that
 * trigger compute() repeatedly.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(120000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(10000);

const r = await page.evaluate(() => {
  const w = window;
  const out = {};
  const t = () => performance.now();

  // Instrument compute: count calls during restoreDemoSnapshot.
  const nativeCompute = w.compute;
  let calls = 0;
  w.compute = () => { calls += 1; return nativeCompute(); };

  // Warm cache first.
  w.SCStudy.loadSample();
  const warmBefore = calls;
  calls = 0;

  let s = t();
  w.SCStudy.restoreDemoSnapshot();
  out.restoreMs = Math.round(t() - s);
  out.computeCallsDuringRestore = calls;

  w.compute = nativeCompute;
  return out;
});
console.log('RESTORE-DEEP:', JSON.stringify(r));
await browser.close();
