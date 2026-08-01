import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(30000);

const t0 = Date.now();
const resp = await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 25000 });
console.log('HTTP:', resp?.status(), 'load:', Date.now() - t0, 'ms');

// Measure when the report area becomes populated — this is when main thread
// finishes the blocking demo Monte Carlo on page open.
const t1 = Date.now();
try {
  await page.waitForFunction(() => {
    const el = document.querySelector('#reportArea .sc-report-hd, #reportArea .sc-report-title');
    return !!el;
  }, { timeout: 60000 });
  console.log('report rendered at:', Date.now() - t1, 'ms after domcontentloaded');
} catch {
  console.log('report never rendered within 60s');
}

// Measure input responsiveness: type a normal value and see how long the sync
// compute blocks the main thread.
const t2 = Date.now();
const blocked = await page.evaluate(() => {
  return new Promise((resolve) => {
    const before = performance.now();
    const el = document.getElementById('specUpper');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, '0.200');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    // measure blocking: requestAnimationFrame won't fire while main thread is busy
    requestAnimationFrame(() => {
      resolve(performance.now() - before);
    });
  });
});
console.log('input->compute block time:', Math.round(blocked), 'ms');

// Now measure report generation click on top of that.
const t3 = Date.now();
await page.evaluate(() => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
});
console.log('idle checkpoint');

await browser.close();
