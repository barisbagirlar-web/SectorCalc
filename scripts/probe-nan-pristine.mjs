/**
 * Definitive check: does pristine live SC-020 body contain the literal string
 * "NaN"? If yes, the adversarial matrix's NaN finding is a false positive
 * caused by hidden/static content, not a calculation leak.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(15000);

for (const slug of ['cnc-feeds-speeds', 'bearing-life-l10', 'sling-capacity', 'punching-force', 'hydraulic-cylinder']) {
  const url = `https://sectorcalc.com/calculator/${slug}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3500);
  const info = await page.evaluate(() => {
    const t = document.body.textContent || '';
    const where = [];
    const idx = t.indexOf('NaN');
    if (idx >= 0) {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        if ((n.textContent || '').includes('NaN')) {
          const parent = n.parentElement;
          const line = (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70);
          const cls = parent ? parent.className || parent.id : '';
          if (line) where.push(`[${cls}] ${line}`);
        }
      }
    }
    return { hasNaN: t.includes('NaN'), hasInf: t.includes('Infinity'), where: where.slice(0, 6) };
  });
  console.log(`${slug.padEnd(22)} hasNaN=${info.hasNaN} hasInf=${info.hasInf}${info.where.length ? ' :: ' + JSON.stringify(info.where) : ''}`);
}

await browser.close();
