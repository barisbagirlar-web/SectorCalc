/**
 * Live instrument SC-008: measure compute() duration and detect whether the
 * deterministic simulation LRU cache is hitting on repeated calls. Also time
 * what-if branches inside generateReport if reachable.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(120000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(8000);

const r = await page.evaluate(async () => {
  const w = window;
  const out = { hasCompute: typeof w.compute === 'function', hasGen: typeof w.generateReport === 'function' };

  // Detect the sim cache Map by scanning sc008 bundle globals is unreliable;
  // instead infer behavior: force two identical compute() runs and compare.
  w.__scDemoCalcPass = true;
  const t0 = performance.now();
  w.compute();
  const t1 = performance.now();
  w.compute();
  const t2 = performance.now();
  w.__scDemoCalcPass = false;

  out.computeFirstMs = Math.round(t1 - t0);
  out.computeSecondMs = Math.round(t2 - t1);
  out.ratio = (t1 - t0) > 0 ? Number(((t2 - t1) / (t1 - t0)).toFixed(3)) : null;

  // Now measure a raw genReport click main-thread block again (fresh).
  const btn = document.getElementById('genReport');
  const t3 = performance.now();
  btn.click();
  const t4 = performance.now();
  out.genReportBlockMs = Math.round(t4 - t3);
  return out;
});
console.log('INSTRUMENT:', JSON.stringify(r, null, 1));
await browser.close();
