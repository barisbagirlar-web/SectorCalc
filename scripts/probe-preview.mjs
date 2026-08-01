import { chromium } from 'playwright';
const tools = ['quote-pricing', 'true-labor-cost', 'tolerance-stack-up', 'weld-thickness'];
const browser = await chromium.launch({ headless: true });
for (const tool of tools) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:4199/calculator/' + tool, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(4000);
  const r = await page.evaluate(() => {
    const report = document.querySelector('#reportArea');
    return {
      hasReport: !!(report && report.querySelector('.sc-report-hd')),
      demoBanner: !!(report && report.querySelector('.sc-demo-report')),
      emptyVisible: !!(report && report.querySelector('.sc-empty') && getComputedStyle(report.querySelector('.sc-empty')).display !== 'none'),
      len: report ? report.innerHTML.length : 0,
      liveResult: document.querySelector('#liveResult')?.textContent || document.querySelector('#liveResult2')?.textContent,
      errs: window.__scProbeErrs || null
    };
  });
  console.log(tool, JSON.stringify(r));
  await page.close();
}
await browser.close();
