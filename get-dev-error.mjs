import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if(msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
    }
  });
  page.on('pageerror', error => console.log('PAGE UNCAUGHT ERROR:', error.message));
  
  console.log("Navigating to http://localhost:3006");
  try {
    await page.goto('http://localhost:3006', { waitUntil: 'networkidle', timeout: 30000 });
  } catch(e) {
    console.log("Navigation timeout or error:", e.message);
  }
  
  await page.waitForTimeout(5000);
  
  const nextError = await page.evaluate(() => {
    const errorOverlay = document.querySelector('nextjs-portal');
    if (errorOverlay && errorOverlay.shadowRoot) {
      return errorOverlay.shadowRoot.textContent;
    }
    return null;
  });
  if (nextError) {
    console.log("Next Error Overlay / Text:", nextError);
  }
  
  await browser.close();
  process.exit(0);
})();
