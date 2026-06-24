import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log("Navigating to http://localhost:3005");
  await page.goto('http://localhost:3005', { waitUntil: 'networkidle' });
  
  // Wait a moment for hydration to complete
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
