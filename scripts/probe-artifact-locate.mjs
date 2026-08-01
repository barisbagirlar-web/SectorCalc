/**
 * Locate literal "NaN"/"Infinity" strings on pristine pages for the 4 artifact
 * tools, and report whether they are user-visible (not inside CSS/style text).
 */
import { chromium } from 'playwright';

const TOOLS = [
  ['SC-020', 'cnc-feeds-speeds'],
  ['SC-021', 'bearing-life-l10'],
  ['SC-039', 'punching-force'],
  ['SC-040', 'hydraulic-cylinder']
];

const browser = await chromium.launch({ headless: true });

for (const [code, slug] of TOOLS) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(15000);
  const url = `https://sectorcalc.com/calculator/${slug}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(3000);
  const info = await page.evaluate(() => {
    const hits = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent || '';
      if (t.includes('NaN') || t.includes('Infinity')) {
        const parent = n.parentElement;
        // Skip style/script text nodes (CSS comments, config strings).
        const inStyle = parent && parent.closest('style, script, template');
        const visible = parent && parent.getClientRects().length > 0 && getComputedStyle(parent).display !== 'none';
        const text = t.replace(/\s+/g, ' ').trim().slice(0, 60);
        const loc = parent ? (parent.className || parent.id || parent.tagName) : '?';
        hits.push({ inStyle: !!inStyle, visible: !!visible, loc, text });
      }
    }
    return hits.slice(0, 8);
  });
  const visibleHits = info.filter((h) => !h.inStyle && h.visible);
  console.log(
    `${code} ${slug.padEnd(20)} total=${info.length} userVisible=${visibleHits.length}`
  );
  for (const h of info.slice(0, 6)) {
    console.log(
      `   ${h.inStyle ? '[style]' : h.visible ? '[VISIBLE]' : '[hidden]'} @${h.loc} :: ${JSON.stringify(h.text)}`
    );
  }
  await page.close();
}

await browser.close();
