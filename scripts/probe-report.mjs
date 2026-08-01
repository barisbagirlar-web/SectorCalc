import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
for (const slug of ['true-labor-cost', 'quote-pricing', 'tolerance-stack-up']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(4000);
  const r = await page.evaluate(() => {
    const area = document.querySelector('#reportArea, .report-area, #liveResult');
    const getText = (sel) => {
      const el = document.querySelector(sel);
      return el ? (el.textContent || '').replace(/\s+/g, ' ').slice(0, 100) : null;
    };
    return {
      reportAreaExists: !!area,
      reportAreaText: area ? (area.textContent || '').replace(/\s+/g, ' ').slice(0, 120) : null,
      emptyPlaceholder: !!document.querySelector('.sc-empty'),
      emptyText: getText('.sc-empty'),
      hasCard: !!document.querySelector('.sc-card-res'),
      hasReportHd: !!document.querySelector('.sc-report-hd'),
      liveResult: getText('#liveResult'),
      // report area region pixel color
      reportRect: area ? { top: Math.round(area.getBoundingClientRect().top), h: Math.round(area.getBoundingClientRect().height) } : null,
      demoReport: !!document.querySelector('.sc-demo-report'),
      sampleBtn: !!document.querySelector('[data-sc-study="sample"]')
    };
  });
  console.log(`=== ${slug} ===`);
  console.log(JSON.stringify(r, null, 1));
  await page.close();
}
await browser.close();
