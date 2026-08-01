import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(60000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(5000);

// Inspect the live dimension config used by the running simulation.
const cfg = await page.evaluate(() => {
  const dims = Array.from(document.querySelectorAll('#dimList .sc-dim')).map((row) => ({
    name: row.querySelector('input[data-f="name"]')?.value,
    nominal: row.querySelector('input[data-f="nominal"]')?.value,
    tolerance: row.querySelector('input[data-f="tolerance"]')?.value,
    dist: row.querySelector('select[data-f="dist"]')?.value
  }));
  return {
    dims,
    specUpper: document.getElementById('specUpper')?.value,
    specLower: document.getElementById('specLower')?.value,
    cpkTarget: document.getElementById('cpkTarget')?.value,
    mcSeed: document.getElementById('mcSeed')?.value,
    mcRuns: window.__mcRuns || window.MC_RUNS || 'n/a'
  };
});
console.log('LIVE PRESET CONFIG:', JSON.stringify(cfg, null, 1));
await browser.close();
