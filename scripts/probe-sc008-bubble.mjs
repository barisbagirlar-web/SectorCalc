import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(150000);

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(8000);

// Block the bridge's capture handler on #genReport so ONLY the tool's own
// bubble handler runs (which calls generateReport after ensureEntitled).
const r = await page.evaluate(() => {
  const t0 = performance.now();
  // Install our own capture listener FIRST so we can stopImmediatePropagation
  // and prevent the demo-report bridge from running restoreGoldenDemoAndCalculate.
  document.addEventListener(
    'click',
    (e) => {
      if (e.target && e.target.closest && e.target.closest('#genReport')) {
        e.stopImmediatePropagation();
      }
    },
    true
  );
  const btn = document.getElementById('genReport');
  btn.click();
  const bubbleOnly = Math.round(performance.now() - t0);
  return { bubbleOnly };
});
console.log('BUBBLE-ONLY click (bridge blocked):', JSON.stringify(r));

await browser.close();
