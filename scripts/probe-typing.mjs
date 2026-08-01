import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://sectorcalc.com/login.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.fill('#email', process.env.E2E_AUTH_EMAIL || 'teb232@gmail.com');
await page.fill('#password', process.env.E2E_AUTH_PASS || 'Deneme1974');
await Promise.all([page.waitForURL(/account/, { timeout: 20000 }).catch(() => {}), page.click('#auth-submit')]);
await page.waitForTimeout(3000);

for (const slug of ['true-labor-cost', 'quote-pricing', 'tolerance-stack-up']) {
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(5000);
  // Try typing into first input
  const firstInputId = await page.evaluate(() => {
    const i = Array.from(document.querySelectorAll('input')).find((el) => {
      const t = el.getAttribute('type');
      if (t && ['hidden', 'submit', 'button'].includes(t)) return false;
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getBoundingClientRect().height > 0;
    });
    return i?.id || null;
  });
  let typed = null;
  if (firstInputId) {
    try {
      await page.fill('#' + firstInputId, '123');
      typed = await page.inputValue('#' + firstInputId);
    } catch (e) {
      typed = 'FILL-ERR: ' + e.message.split('\n')[0];
    }
  }
  const session = await page.evaluate(() => {
    const gate = document.querySelector('.sc-pro-gate-active');
    return {
      activeText: gate ? gate.textContent.replace(/\s+/g, ' ').slice(0, 90) : null,
      locked: document.body.classList.contains('sc-demo-locked'),
      readonlyInputs: Array.from(document.querySelectorAll('input')).filter((el) => {
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && el.getBoundingClientRect().height > 0 && el.readOnly;
      }).length
    };
  });
  console.log(`=== ${slug} === firstInput=${firstInputId} typed=${JSON.stringify(typed)} active="${session.activeText}" locked=${session.locked} readonlyInputs=${session.readonlyInputs}`);
}
await browser.close();
