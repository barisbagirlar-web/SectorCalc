import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(120000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);

// Force the demo pass so compute() runs the full MC path, then time it.
const r = await page.evaluate(() => {
  const w = window;
  const out = {};
  w.__scDemoCalcPass = true;
  const t0 = performance.now();
  w.compute();
  out.computeFullMs = Math.round(performance.now() - t0);
  // time a raw simulate if loadPreset/compute gives us a handle — compute already did MC
  // Now measure a second compute (JIT warm)
  const t1 = performance.now();
  w.compute();
  out.computeFull2Ms = Math.round(performance.now() - t1);
  w.__scDemoCalcPass = false;
  return out;
});
console.log('PAGE FULL COMPUTE:', JSON.stringify(r));

// Also check what MC_RUNS the live page uses, and precision config.
const cfg = await page.evaluate(() => {
  // decimal.js is bundled; inspect via a probe: run a quick 1000-sample normal sim inline
  // by measuring how long window.compute actually needs... instead inspect module internals.
  const w = window;
  return {
    hasCalcData: !!w.calcData,
    scStudy: typeof w.SCStudy?.restoreDemoSnapshot,
    scStudyLoadSample: typeof w.SCStudy?.loadSample
  };
});
console.log('CONFIG:', JSON.stringify(cfg));

await browser.close();
