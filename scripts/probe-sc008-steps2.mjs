/**
 * Step-by-step timing of the bridge click path on live SC-008:
 *  1. SCStudy.loadSample()            (loadPreset + generateReport)
 *  2. window.compute()                (bridge calls it after loadSample)
 *  3. native #genReport handler       (what the user actually triggers)
 * Isolate where the ~4.5s goes.
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

  // 1. loadSample
  if (typeof w.SCStudy?.loadSample === 'function') {
    let t0 = performance.now();
    w.SCStudy.loadSample();
    out.loadSampleMs = Math.round(performance.now() - t0);
  }

  // 2. compute (forced demo pass so it runs fully)
  w.__scDemoCalcPass = true;
  let t0 = performance.now();
  w.compute();
  out.computeMs = Math.round(performance.now() - t0);
  w.__scDemoCalcPass = false;

  // 3. A second compute — cache should now be warm.
  w.__scDemoCalcPass = true;
  t0 = performance.now();
  w.compute();
  out.compute2Ms = Math.round(performance.now() - t0);
  w.__scDemoCalcPass = false;

  return out;
});
console.log('STEPS:', JSON.stringify(r));
await browser.close();
