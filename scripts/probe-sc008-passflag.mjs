/**
 * Isolate: does __scDemoCalcPass=true change loadSample timing?
 * Load path: loadSample -> loadPreset -> compute -> syncReportIfOpen -> generateReport (what-ifs).
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

  // 1. loadSample WITHOUT pass flags
  let s = t();
  w.SCStudy.loadSample();
  out.loadSampleNoPass = Math.round(t() - s);

  // 2. loadSample WITH pass flags (bridge path)
  w.__scDemoCalcPass = true;
  w.__scDemoReportPass = true;
  s = t();
  w.SCStudy.loadSample();
  out.loadSampleWithPass = Math.round(t() - s);
  w.__scDemoCalcPass = false;
  w.__scDemoReportPass = false;

  // 3. pure compute with pass
  w.__scDemoCalcPass = true;
  s = t();
  w.compute();
  out.computeWithPass = Math.round(t() - s);
  w.__scDemoCalcPass = false;

  // 4. raw click now (warm cache)
  s = t();
  document.getElementById('genReport').click();
  out.clickWarm = Math.round(t() - s);

  return out;
});
console.log('PASS-FLAG ISOLATION:', JSON.stringify(r));
await browser.close();
