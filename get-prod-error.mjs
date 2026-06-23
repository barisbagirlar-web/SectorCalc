import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ locale: 'tr-TR' });
  const page = await context.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('https://sectorcalc.com', { waitUntil: 'networkidle' });
  await browser.close();
})();
