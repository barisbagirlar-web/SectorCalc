/**
 * Pinpoint the NaN leak for SC-028 surface-finish and SC-030 sheet-metal-bend:
 * which element shows it, and does an empty input (the real user path for
 * type=number rejecting letters) produce the same result.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });

for (const slug of ['surface-finish', 'sheet-metal-bend']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(15000);
  const url = `https://sectorcalc.com/calculator/${slug}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input'))
      .filter((el) => {
        const t = el.getAttribute('type');
        if (t && ['hidden', 'submit', 'button', 'checkbox', 'radio'].includes(t)) return false;
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getBoundingClientRect().height > 0;
      })
      .slice(0, 4)
      .map((el) => el.id || el.name || el.className);
  });
  console.log(`\n== ${slug} inputs:`, JSON.stringify(inputs));

  const findNaN = () =>
    page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const hits = [];
      let n;
      while ((n = walker.nextNode())) {
        const txt = n.textContent || '';
        if (txt.includes('NaN')) {
          let el = n.parentElement;
          const chain = [];
          for (let i = 0; i < 5 && el; i++) {
            chain.unshift(el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : '') + (el.id ? '#' + el.id : ''));
            el = el.parentElement;
          }
          hits.push(chain.join(' > ') + ' :: "' + txt.trim().replace(/\s+/g, ' ').slice(0, 70) + '"');
        }
      }
      return hits.slice(0, 5);
    });

  for (const id of inputs) {
    // Clear the input to empty (real user path: type=number rejects letters)
    const input = page.locator(`#${id}`);
    try {
      await input.click();
      await page.keyboard.press('Meta+A');
      await page.keyboard.press('Backspace');
      await input.press('Enter');
      await page.waitForTimeout(700);
    } catch (e) {}
    const hits = await findNaN();
    if (hits.length) {
      console.log(`  !! CLEAR ${id} → NaN at:`);
      for (const h of hits) console.log(`      ${h}`);
    }
    // restore
    await input.click().catch(() => {});
    await page.keyboard.press('Meta+A').catch(() => {});
    await page.keyboard.type('10', { delay: 10 }).catch(() => {});
    await input.press('Enter').catch(() => {});
    await page.waitForTimeout(400);
  }
  await page.close();
}
await browser.close();
