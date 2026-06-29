import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  const html = await page.evaluate(() => {
    const errorOverlay = document.querySelector('nextjs-portal');
    if (errorOverlay && errorOverlay.shadowRoot) {
      return errorOverlay.shadowRoot.innerHTML;
    }
    return null;
  });
  
  if (html) {
    import('fs').then(fs => fs.writeFileSync('next-error.html', html));
    console.log("Wrote next-error.html");
  } else {
    console.log("No nextjs-portal found.");
  }
  
  await browser.close();
  process.exit(0);
})();
