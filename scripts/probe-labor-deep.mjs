import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('https://sectorcalc.com/calculator/true-labor-cost', { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.waitForTimeout(3500);
const s1 = await page.evaluate(() => ({
  isEntitled: window.__scProGate ? window.__scProGate.isEntitled() : 'no-gate',
  enforce: window.__scProGate ? window.__scProGate.enforce : 'no-gate',
  hasReport: !!(document.querySelector('#reportArea')?.querySelector('.sc-report-hd')),
  liveResult: document.querySelector('#liveResult')?.textContent,
  validateAndCalcWrapped: window.validateAndCalc.toString().includes('__scDemoCalcPass')
}));
// Simulate what sc-study loadSample does
const s2 = await page.evaluate(() => {
  window.__scDemoCalcPass = true;
  try {
    window.SCStudy.loadSample();
  } finally {
    window.__scDemoCalcPass = false;
  }
  return {
    hasReport: !!(document.querySelector('#reportArea')?.querySelector('.sc-report-hd')),
    len: document.querySelector('#reportArea')?.innerHTML.length,
    liveResult: document.querySelector('#liveResult')?.textContent,
    demoBanner: !!(document.querySelector('#reportArea')?.querySelector('.sc-demo-report'))
  };
});
console.log(JSON.stringify({ s1, s2 }, null, 1));
await browser.close();
