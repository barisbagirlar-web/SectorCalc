import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://sectorcalc.com/login.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
try {
  await page.fill('#email', process.env.E2E_AUTH_EMAIL || 'teb232@gmail.com');
  await page.fill('#password', process.env.E2E_AUTH_PASS || 'Deneme1974');
  await Promise.all([
    page.waitForURL(/account/, { timeout: 20000 }).catch(() => {}),
    page.click('#auth-submit')
  ]);
  await page.waitForTimeout(3000);
  console.log('LOGIN OK', page.url());
} catch (e) {
  console.log('LOGIN-ERR', e.message.split('\n')[0]);
}

for (const slug of ['true-labor-cost', 'quote-pricing', 'tolerance-stack-up']) {
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `/tmp/${slug}-auth.png` });
  const r = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, select')).filter((el) => {
      const t = el.getAttribute('type');
      if (t && ['hidden', 'submit', 'button'].includes(t)) return false;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return !(cs.display === 'none' || cs.visibility === 'hidden' || rect.height === 0);
    });
    const editable = inputs.filter((el) => el.tagName === 'SELECT' ? !el.disabled : !el.readOnly).length;
    return {
      url: location.pathname,
      visibleInputs: inputs.length,
      editable,
      gateActive: !!document.querySelector('.sc-pro-gate-active, .sc-session-feedback'),
      sessionFeedback: !!document.querySelector('.sc-session-feedback'),
      report: (document.querySelector('#reportArea, .sc-report-hd') ? 'report-area' : ''),
      sidebarTop: document.querySelector('.sc-sidebar') ? Math.round(document.querySelector('.sc-sidebar').getBoundingClientRect().top) : null,
      firstInputTop: inputs.length ? Math.round(inputs[0].getBoundingClientRect().top) : null,
      layout: (document.querySelector('.sc-layout') || document.querySelector('.grid') || document.querySelector('.wrap'))?.className?.slice(0, 30) || null
    };
  });
  console.log(JSON.stringify(r));
}
await browser.close();
