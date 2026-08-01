/**
 * Real-user keyboard injection for the two tools that showed NaN with no
 * pristine artifact: SC-028 surface-finish and SC-030 sheet-metal-bend.
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });

for (const slug of ['surface-finish', 'sheet-metal-bend']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(15000);
  const url = `https://sectorcalc.com/calculator/${slug}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Identify visible numeric inputs.
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

  const bodyText = () =>
    page.evaluate(() => (document.body.textContent || '').includes('NaN') || (document.body.textContent || '').includes('Infinity'));

  for (const id of inputs) {
    for (const [label, val] of [
      ['zero', '0'],
      ['negative', '-999'],
      ['nan', 'NaN'],
      ['inf', '1e308'],
      ['string', 'abc'],
      ['emoji', '🔧😀']
    ]) {
      const input = page.locator(`#${id}`);
      try {
        await input.click();
        await page.keyboard.press('Meta+A');
        await page.keyboard.press('Backspace');
        await page.keyboard.type(val, { delay: 15 });
        await input.press('Enter');
        await page.waitForTimeout(700);
      } catch (e) {
        console.log(`  ${id}=${label} TYPE-FAIL ${String(e).slice(0, 60)}`);
        continue;
      }
      const leak = await bodyText();
      if (leak) console.log(`  !! ${id}=${label} NaN/Inf LEAK`);
    }
    // restore sane
    const input = page.locator(`#${id}`);
    await input.click().catch(() => {});
    await page.keyboard.press('Meta+A').catch(() => {});
    await page.keyboard.type('10', { delay: 10 }).catch(() => {});
    await input.press('Enter').catch(() => {});
    await page.waitForTimeout(500);
  }
  console.log(`== ${slug} DONE`);
  await page.close();
}
await browser.close();
