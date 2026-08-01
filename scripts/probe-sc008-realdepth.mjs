import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(90000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 25000 });

// What does the report area contain right at load, and when does live data appear?
const early = await page.evaluate(() => {
  const ra = document.querySelector('#reportArea');
  const hd = document.querySelector('#reportArea .sc-report-hd');
  const card = document.querySelector('#reportArea .sc-card-res');
  return {
    reportAreaExists: !!ra,
    reportHd: !!hd,
    card: !!card,
    reportHdText: hd ? hd.textContent.slice(0, 60) : null,
    reportAreaLen: ra ? (ra.textContent || '').length : 0,
    hasStaticReport: ra ? (ra.textContent || '').includes('Monte Carlo') : false
  };
});
console.log('EARLY:', JSON.stringify(early, null, 1));

// Now measure a manual click on Generate Report — real engine path.
const t0 = Date.now();
await page.evaluate(() => {
  const el = document.getElementById('genReport');
  el && el.click();
});
await page.waitForFunction(() => {
  const el = document.querySelector('#reportArea .sc-report-hd');
  return !!el;
}, { timeout: 60000 });
console.log('genReport click -> report present:', Date.now() - t0, 'ms');

// Measure how long the Monte Carlo actually takes by timing a normal recompute.
const t1 = Date.now();
await page.evaluate(() => {
  return new Promise((resolve) => {
    const el = document.getElementById('cpkTarget');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, '1.50');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
});
console.log('cpkTarget change -> main thread free:', Date.now() - t1, 'ms');

await browser.close();
