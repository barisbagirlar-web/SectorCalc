import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', error => console.log('PAGE UNCAUGHT ERROR:', error.message));
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  await browser.close();
  process.exit(0);
})();
