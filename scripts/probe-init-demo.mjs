import { chromium } from 'playwright';
const tools = ['quote-pricing', 'true-labor-cost', 'tolerance-stack-up', 'weld-thickness'];
const browser = await chromium.launch({ headless: true });
for (const tool of tools) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('https://sectorcalc.com/calculator/' + tool, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(() => {
    const prev = window.__scDemoCalcPass;
    window.__scDemoCalcPass = true;
    try {
      if (typeof window.validateAndCalc === 'function') window.validateAndCalc();
      if (typeof window.generateReport === 'function') window.generateReport();
    } catch (e) { return { err: e.message }; }
    finally { window.__scDemoCalcPass = prev; }
    const report = document.querySelector('#reportArea');
    return {
      hasReport: !!(report && report.querySelector('.sc-report-hd')),
      len: report ? report.innerHTML.length : 0,
      liveResult: document.querySelector('#liveResult')?.textContent,
      calcId: window.calcId || null
    };
  });
  console.log(tool, JSON.stringify(r));
  await page.close();
}
await browser.close();
