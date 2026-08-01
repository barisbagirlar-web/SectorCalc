import { chromium } from 'playwright';
const tools = ['true-labor-cost', 'tolerance-stack-up', 'weld-thickness'];
const browser = await chromium.launch({ headless: true });
for (const tool of tools) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('https://sectorcalc.com/calculator/' + tool, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3500);
  const before = await page.evaluate(() => {
    const report = document.querySelector('#reportArea');
    return {
      hasReport: !!(report && report.querySelector('.sc-report-hd')),
      emptyVisible: !!(report && report.querySelector('.sc-empty') && getComputedStyle(report.querySelector('.sc-empty')).display !== 'none'),
      len: report ? report.innerHTML.length : 0,
      calcBtn: !!document.querySelector('#calcBtn, [data-action="calc"]')
    };
  });
  let clicked = false;
  const btn = page.locator('[data-sc-study="load-sample"], .sc-study-btn, button:has-text("Load Demo"), button:has-text("Load Sample")');
  if (await btn.count() > 0) { await btn.first().click({ timeout: 5000 }).catch(() => {}); clicked = true; }
  await page.waitForTimeout(2500);
  const after = await page.evaluate(() => {
    const report = document.querySelector('#reportArea');
    return {
      hasReport: !!(report && report.querySelector('.sc-report-hd')),
      emptyVisible: !!(report && report.querySelector('.sc-empty') && getComputedStyle(report.querySelector('.sc-empty')).display !== 'none'),
      len: report ? report.innerHTML.length : 0,
      demoBanner: !!(report && report.querySelector('.sc-demo-report')),
      liveResult: document.querySelector('#liveResult')?.textContent
    };
  });
  console.log(tool, '| clicked=' + clicked, '| before:', JSON.stringify(before), '| after:', JSON.stringify(after));
  await page.close();
}
await browser.close();
