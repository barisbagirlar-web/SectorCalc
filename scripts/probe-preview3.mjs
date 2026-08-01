import { chromium } from 'playwright';
const tools = [
  ['quote-pricing', '/quote-pro.html'],
  ['true-labor-cost', '/labor-pro.html'],
  ['tolerance-stack-up', '/sc008-pro.html'],
  ['weld-thickness', '/weld-pro.html']
];
const browser = await chromium.launch({ headless: true });
for (const [name, url] of tools) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => console.log('PAGE-ERR', name, String(e).slice(0, 150)));
  await page.goto('http://localhost:4199' + url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(4500);
  const r = await page.evaluate(() => {
    const report = document.querySelector('#reportArea');
    return {
      hasReport: !!(report && report.querySelector('.sc-report-hd')),
      demoBanner: !!(report && report.querySelector('.sc-demo-report')),
      len: report ? report.innerHTML.length : -1,
      liveResult: document.querySelector('#liveResult')?.textContent,
      calcId: window.calcId || null
    };
  });
  console.log(name, JSON.stringify(r));
  await page.close();
}
await browser.close();
