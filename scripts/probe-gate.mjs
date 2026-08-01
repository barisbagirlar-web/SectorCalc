import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('https://sectorcalc.com/calculator/quote-pricing', { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.waitForTimeout(4000);
const r = await page.evaluate(() => {
  return {
    hasScProGate: typeof window.__scProGate !== 'undefined',
    isEntitled: window.__scProGate ? window.__scProGate.isEntitled() : 'n/a',
    gateRoot: !!document.querySelector('#sc-pro-gate-root'),
    gateChildren: document.querySelector('#sc-pro-gate-root') ? document.querySelector('#sc-pro-gate-root').children.length : 0,
    gateMountText: (document.querySelector('#sc-pro-gate-root')?.textContent || '').replace(/\s+/g, ' ').slice(0, 60),
    inputsReadonly: Array.from(document.querySelectorAll('input')).filter(i => i.readOnly).length,
    inputsTotal: Array.from(document.querySelectorAll('input')).filter(i => i.getAttribute('type') !== 'hidden').length
  };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
