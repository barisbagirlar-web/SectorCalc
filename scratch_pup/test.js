import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
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
    console.log("Navigating to homepage to test routing...");
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle2' });

    console.log("Forcing client-side navigation to /pricing via JS click on a created link...");
    await page.evaluate(() => {
      const a = document.createElement('a');
      a.href = '/en/pricing';
      a.textContent = 'Go to Pricing';
      a.id = 'test-pricing-link';
      document.body.appendChild(a);
    });

    await page.click('#test-pricing-link');
    // Wait for the URL to change to indicate navigation started
    await page.waitForFunction('window.location.pathname.includes("pricing")');
    // Wait for network to be idle
    await new Promise(r => setTimeout(r, 3000)); // wait for rendering and scripts

    console.log("On pricing page. Looking for checkout button...");
    
    // In SectorCalc, the buttons usually have text like "Satın Al", "Kredi Al", "Get Started".
    await page.waitForSelector('button');
    const buttons = await page.$$('button');
    let checkoutBtn = null;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Al') || text.includes('Kredi') || text.includes('Purchase') || text.includes('Started') || text.includes('$')) {
        checkoutBtn = btn;
        break;
      }
    }

    if (!checkoutBtn && buttons.length > 0) {
      console.log("No specific buy button found. Clicking the first button on the page.");
      checkoutBtn = buttons[0];
    }

    if (checkoutBtn) {
      console.log("Clicking checkout button...");
      await checkoutBtn.click();
    } else {
      console.log("No buttons found on the page to click.");
    }

    // Wait a bit to see if alert fires
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
