import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE-ERR:', m.text().slice(0, 120)); });
await page.goto('https://sectorcalc.com/calculator/quote-pricing', { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.waitForTimeout(3500);
const before = await page.evaluate(() => {
  const report = document.querySelector('#reportArea');
  return {
    hasReport: !!(report && report.querySelector('.sc-report-hd')),
    emptyVisible: !!(report && report.querySelector('.sc-empty') && getComputedStyle(report.querySelector('.sc-empty')).display !== 'none'),
    reportHTMLlen: report ? report.innerHTML.length : 0
  };
});
// Click Load Demo Data
const btn = page.locator('[data-sc-study="load-sample"], .sc-study-btn, button:has-text("Load Demo"), button:has-text("Load Sample")');
const cnt = await btn.count();
let clicked = false;
if (cnt > 0) { await btn.first().click({ timeout: 5000 }).catch(() => {}); clicked = true; }
await page.waitForTimeout(2500);
const after = await page.evaluate(() => {
  const report = document.querySelector('#reportArea');
  return {
    hasReport: !!(report && report.querySelector('.sc-report-hd')),
    emptyVisible: !!(report && report.querySelector('.sc-empty') && getComputedStyle(report.querySelector('.sc-empty')).display !== 'none'),
    reportHTMLlen: report ? report.innerHTML.length : 0,
    demoBanner: !!(report && report.querySelector('.sc-demo-report')),
    liveResult: document.querySelector('#liveResult')?.textContent,
    calcData: typeof window.calcData !== 'undefined' && !!window.calcData
  };
});
console.log(JSON.stringify({ clicked, before, after }, null, 1));
await browser.close();
