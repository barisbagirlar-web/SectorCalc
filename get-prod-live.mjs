import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[error] ${msg.text()}`);
    }
  });
  page.on('pageerror', error => console.log('PAGE UNCAUGHT ERROR:', error.message));
  
  console.log("Navigating to https://sectorcalc.com");
  await page.goto('https://sectorcalc.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  const bodyText = await page.evaluate(() => document.body.textContent.slice(0, 500));
  console.log("Body text:", bodyText);
  
  await browser.close();
  process.exit(0);
})();
