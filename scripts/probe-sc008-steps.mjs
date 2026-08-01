import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(150000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(8000);

const steps = await page.evaluate(() => {
  const w = window;
  const out = {};
  const t0 = performance.now();
  w.SCStudy.loadSample(); // loadPreset + generateReport (what-if'ler dahil)
  out.loadSample = Math.round(performance.now() - t0);

  const t1 = performance.now();
  w.__scDemoCalcPass = true;
  w.compute();
  out.compute = Math.round(performance.now() - t1);
  w.__scDemoCalcPass = false;

  const t2 = performance.now();
  const btn = document.getElementById('genReport');
  btn.click();
  out.click = Math.round(performance.now() - t2);
  return out;
});
console.log('STEPS:', JSON.stringify(steps));
await browser.close();
