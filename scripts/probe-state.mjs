import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
// login
await page.goto('https://sectorcalc.com/login.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.fill('#email', process.env.E2E_AUTH_EMAIL || 'teb232@gmail.com');
await page.fill('#password', process.env.E2E_AUTH_PASS || 'Deneme1974');
await Promise.all([page.waitForURL(/account/, { timeout: 20000 }).catch(() => {}), page.click('#auth-submit')]);
await page.waitForTimeout(3000);

for (const slug of ['true-labor-cost', 'quote-pricing', 'tolerance-stack-up']) {
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
  await page.waitForTimeout(5000);
  const r = await page.evaluate(() => {
    const q = (sel) => document.querySelector(sel);
    const rect = (el) => el ? { top: Math.round(el.getBoundingClientRect().top), h: Math.round(el.getBoundingClientRect().height), w: Math.round(el.getBoundingClientRect().width) } : null;
    // Left sidebar form area and right report area
    const sidebar = q('.sc-sidebar');
    const reportArea = q('#reportArea');
    const inputs = Array.from(document.querySelectorAll('.sc-sidebar input, .sc-sidebar select, .grid input, .grid select'))
      .filter(el => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && el.getBoundingClientRect().height > 0; });
    const visibleInputs = inputs.length;
    const firstInput = inputs[0] ? rect(inputs[0]) : null;
    const gate = q('.sc-pro-gate');
    const gateState = gate ? gate.getAttribute('data-state') || gate.className : null;
    const demoBanner = q('.sc-demo-report');
    const active = q('.sc-pro-gate-active');
    return {
      sidebar: rect(sidebar),
      reportArea: rect(reportArea),
      visibleInputs,
      firstInput,
      gateState,
      hasGate: !!gate,
      hasActive: !!active,
      hasDemoBanner: !!demoBanner,
      studyBar: !!q('[data-sc-study]'),
      bodyClasses: document.body.className.slice(0, 80)
    };
  });
  console.log(`=== ${slug} ===`);
  console.log(JSON.stringify(r, null, 1));
}
await browser.close();
