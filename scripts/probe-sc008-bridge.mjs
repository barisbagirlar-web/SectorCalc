/**
 * Time the bridge's restoreGoldenDemoAndCalculate as the capture handler would
 * run it, and inspect w.calculate/w.compute types on the live SC-008 page.
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

  out.types = {
    calculate: typeof w.calculate,
    compute: typeof w.compute,
    validateAndCalc: typeof w.validateAndCalc,
    loadSample: typeof w.SCStudy?.loadSample,
    restore: typeof w.SCStudy?.restoreDemoSnapshot,
    genReport: typeof w.generateReport
  };

  // Replicate exactly what the bridge capture does for #genReport.
  w.__scDemoCalcPass = true;
  w.__scDemoReportPass = true;
  let s = t();
  if (typeof w.SCStudy?.loadSample === 'function') w.SCStudy.loadSample();
  const calculate = w.calculate || w.compute || w.validateAndCalc;
  out.calculateChosen = typeof calculate;
  if (typeof calculate === 'function') calculate();
  out.restoreMs = Math.round(t() - s);
  w.__scDemoCalcPass = false;
  w.__scDemoReportPass = false;

  return out;
});
console.log('BRIDGE REPLICA:', JSON.stringify(r));
await browser.close();
