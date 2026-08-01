/**
 * Measure 3 consecutive #genReport clicks. If the sim LRU cache works, the
 * 2nd/3rd clicks should be dramatically faster than the 1st (which warms the
 * cache). Measures main-thread blocking via double-rAF.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(120000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(10000);

const block = (page) =>
  page.evaluate(() => {
    return new Promise((resolve) => {
      const btn = document.getElementById('genReport');
      const before = performance.now();
      btn.click();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve(Math.round(performance.now() - before));
        });
      });
    });
  });

for (let i = 1; i <= 4; i++) {
  const ms = await block(page);
  console.log(`click #${i}: main-thread block ${ms}ms`);
  await page.waitForTimeout(500);
}

await browser.close();
