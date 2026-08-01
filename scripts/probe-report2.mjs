import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
for (const slug of ['true-labor-cost', 'quote-pricing', 'tolerance-stack-up']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(4000);
  const before = await page.evaluate(() => {
    const empty = document.querySelector('.sc-empty');
    const main = document.querySelector('.sc-main-inner, #reportArea');
    const cs = (el) => el ? { display: getComputedStyle(el).display, visibility: getComputedStyle(el).visibility, h: Math.round(el.getBoundingClientRect().height), top: Math.round(el.getBoundingClientRect().top) } : null;
    return { empty: cs(empty), main: cs(main), mainChildren: main ? main.children.length : 0, emptyText: empty ? empty.textContent.replace(/\s+/g, ' ').slice(0, 80) : null, hasLocked: !!document.querySelector('.sc-locked, [class*="locked"]') };
  });
  // Click Load Demo Data
  await page.click('[data-sc-study="sample"]').catch(() => console.log(slug, 'no sample btn'));
  await page.waitForTimeout(2000);
  const after = await page.evaluate(() => {
    const empty = document.querySelector('.sc-empty');
    const main = document.querySelector('.sc-main-inner, #reportArea');
    const cs = (el) => el ? { display: getComputedStyle(el).display, visibility: getComputedStyle(el).visibility, h: Math.round(el.getBoundingClientRect().height) } : null;
    return { empty: cs(empty), main: cs(main), hasReport: !!document.querySelector('.sc-report-hd, .sc-card-res'), reportText: main ? main.textContent.replace(/\s+/g, ' ').slice(0, 150) : null };
  });
  console.log(`=== ${slug} ===`);
  console.log('before:', JSON.stringify(before));
  console.log('after sample click:', JSON.stringify(after));
  await page.close();
}
await browser.close();
