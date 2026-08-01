/**
 * Manually replicate the bridge's armLocalReportPass sequence and time each
 * piece, to find where the real ~4.5s lives.
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

  w.__scDemoCalcPass = true;
  w.__scDemoReportPass = true;

  // loadSample: loadPreset + _demoReportOpen + generateReport
  let s = t();
  w.SCStudy.loadSample();
  out.loadSample = Math.round(t() - s);

  // compute (bridge calls calculate after loadSample)
  s = t();
  w.compute();
  out.compute = Math.round(t() - s);

  // generateReport via window (wrapped by bridge) — is it exposed?
  out.generateReportType = typeof w.generateReport;

  // Manually re-run generateReport if it's a function (bridge wrapper):
  if (typeof w.generateReport === 'function') {
    s = t();
    w.generateReport();
    out.generateReportWrapped = Math.round(t() - s);
  }

  w.__scDemoCalcPass = false;
  w.__scDemoReportPass = false;
  return out;
});
console.log('REPLICATED:', JSON.stringify(r));
await browser.close();
