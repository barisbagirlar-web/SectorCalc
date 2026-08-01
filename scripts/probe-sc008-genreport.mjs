import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(120000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
// Wait for the auto demo report to fully finish (main thread idle).
await page.waitForTimeout(8000);

// Measure how long clicking genReport blocks the main thread (rAF delay).
const r = await page.evaluate(() => {
  return new Promise((resolve) => {
    const btn = document.getElementById('genReport');
    if (!btn) return resolve({ error: 'no genReport btn' });
    const before = performance.now();
    btn.click();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve({ blockMs: Math.round(performance.now() - before) });
      });
    });
  });
});
console.log('genReport click main-thread block:', JSON.stringify(r));

// Now, after report is up, time a re-render (second generateReport).
const r2 = await page.evaluate(() => {
  return new Promise((resolve) => {
    const btn = document.getElementById('genReport');
    const before = performance.now();
    btn.click();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve({ blockMs2: Math.round(performance.now() - before) });
      });
    });
  });
});
console.log('genReport click #2 block:', JSON.stringify(r2));

await browser.close();
