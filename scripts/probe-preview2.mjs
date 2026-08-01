import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE-ERR:', m.text().slice(0, 300)); });
page.on('pageerror', (e) => console.log('PAGE-ERR:', String(e).slice(0, 300)));
page.on('requestfailed', (r) => console.log('REQ-FAIL:', r.url().slice(0, 150), r.failure()?.errorText));
await page.goto('http://localhost:4199/calculator/true-labor-cost', { waitUntil: 'load', timeout: 25000 });
await page.waitForTimeout(5000);
const r = await page.evaluate(() => ({
  reportLen: document.querySelector('#reportArea')?.innerHTML.length,
  hasReport: !!(document.querySelector('#reportArea')?.querySelector('.sc-report-hd')),
  liveResult: document.querySelector('#liveResult')?.textContent,
  calcId: window.calcId || null,
  scripts: Array.from(document.querySelectorAll('script[src]')).map(s => s.src.split('/').pop()).slice(0, 8)
}));
console.log(JSON.stringify(r, null, 1));
await browser.close();
