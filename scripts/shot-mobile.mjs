import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
for (const slug of ['true-labor-cost', 'quote-pricing', 'tolerance-stack-up']) {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `/tmp/${slug}-mobile.png`, fullPage: false });
  const r = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('.sc-sidebar input, .sc-sidebar select, .grid input, .grid select')).filter((el) => {
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getBoundingClientRect().height > 0;
    });
    const first = inputs[0];
    const sidebar = document.querySelector('.sc-sidebar');
    const report = document.querySelector('#reportArea');
    return {
      inputCount: inputs.length,
      firstTop: first ? Math.round(first.getBoundingClientRect().top) : null,
      sidebarTop: sidebar ? Math.round(sidebar.getBoundingClientRect().top) : null,
      reportTop: report ? Math.round(report.getBoundingClientRect().top) : null,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    };
  });
  console.log(`${slug} | ${JSON.stringify(r)}`);
  await page.close();
}
await browser.close();
