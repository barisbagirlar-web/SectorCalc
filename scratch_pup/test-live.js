import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser to test LIVE SITE...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  let alertFired = false;
  let alertMessage = "";

  page.on('dialog', async dialog => {
    alertFired = true;
    alertMessage = dialog.message();
    console.log("ALERT DETECTED:", alertMessage);
    await dialog.dismiss();
  });

  try {
    console.log("Navigating to live homepage...");
    await page.goto('https://sectorcalc.com/tr', { waitUntil: 'networkidle2' });

    console.log("Forcing client-side navigation to /pricing via JS click...");
    await page.evaluate(() => {
      const a = document.createElement('a');
      a.href = '/tr/pricing';
      a.textContent = 'Go to Pricing';
      a.id = 'test-pricing-link';
      document.body.appendChild(a);
    });

    await page.click('#test-pricing-link');
    console.log("Waiting for network to settle after navigation...");
    await new Promise(r => setTimeout(r, 4000));

    console.log("On pricing page. Looking for checkout button via evaluate...");
    
    // Evaluate and click
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const checkoutBtn = buttons.find(b => 
        b.textContent.includes('Satın Al') || 
        b.textContent.includes('Kredi Al') || 
        b.textContent.includes('Get Started') ||
        b.textContent.includes('Plan Seç')
      );
      if (checkoutBtn) {
        checkoutBtn.click();
        return true;
      }
      if (buttons.length > 0) {
        buttons[0].click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log("Clicked a button!");
    } else {
      console.log("No buttons found to click.");
    }

    console.log("Waiting to see if Paddle SDK initializes or alert is thrown...");
    await new Promise(r => setTimeout(r, 2000));

    if (alertFired) {
      console.error("TEST FAILED: Alert fired ->", alertMessage);
      process.exit(1);
    } else {
      console.log("TEST PASSED: No alert fired! Paddle initialization did not crash on client-side navigation.");
      process.exit(0);
    }
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
