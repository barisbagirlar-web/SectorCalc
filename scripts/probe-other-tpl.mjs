import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
for (const slug of ['bolt-torque-preload', 'cnc-feeds-speeds', 'bearing-frequencies']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(4000);
  const r = await page.evaluate(() => {
    const report = document.querySelector('#reportArea, .sc-report, [id*="report"], [id*="Report"], .panel .t, .chartbox');
    const res = document.querySelector('#res, #results, .result, .live-result, #outputArea');
    return {
      reportSel: report ? (report.id || report.className).toString().slice(0, 40) : null,
      reportText: report ? (report.textContent || '').replace(/\s+/g, ' ').slice(0, 80) : null,
      resSel: res ? (res.id || res.className).toString().slice(0, 40) : null,
      resText: res ? (res.textContent || '').replace(/\s+/g, ' ').slice(0, 80) : null,
      gridH: document.querySelector('.grid') ? Math.round(document.querySelector('.grid').getBoundingClientRect().height) : null,
      btnTexts: Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim().slice(0, 20)).filter(t => /report|calc|generate/i.test(t)).slice(0, 5)
    };
  });
  console.log(`=== ${slug} ===`);
  console.log(JSON.stringify(r, null, 1));
  await page.close();
}
await browser.close();
