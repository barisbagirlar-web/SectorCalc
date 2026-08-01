import { chromium } from 'playwright';

const SLUGS = [
  'bearing-frequencies', 'bearing-life-l10', 'belt-chain-drive', 'sheet-metal-bend',
  'bolt-torque-preload', 'bolted-joint', 'cycle-time-cost', 'iso-286-fits',
  'weld-heat-input', 'hydraulic-cylinder', 'true-labor-cost', 'machine-hour-rate',
  'cnc-feeds-speeds', 'oee-teep', 'pipe-wall-thickness', 'pressure-vessel-shell',
  'punching-force', 'quote-pricing', 'tolerance-stack-up', 'shackle-eyebolt',
  'shaft-design', 'sling-capacity', 'surface-finish', 'tap-thread-milling',
  'weld-thickness'
];

const VIEWPORT_H = 720;
const browser = await chromium.launch({ headless: true });

// Login once, share cookie context
const ctx = await browser.newContext({ viewport: { width: 375, height: VIEWPORT_H } });
const loginPage = await ctx.newPage();
await loginPage.goto('https://sectorcalc.com/login.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
try {
  await loginPage.fill('#email', process.env.E2E_AUTH_EMAIL || 'teb232@gmail.com');
  await loginPage.fill('#password', process.env.E2E_AUTH_PASS || 'Deneme1974');
  await Promise.all([
    loginPage.waitForURL(/account/, { timeout: 20000 }).catch(() => {}),
    loginPage.click('#auth-submit')
  ]);
  await loginPage.waitForTimeout(3000);
} catch (e) {
  console.log('LOGIN-ERR', e.message.split('\n')[0]);
}

for (const slug of SLUGS) {
  const page = await ctx.newPage();
  try {
    await page.goto(`https://sectorcalc.com/calculator/${slug}`, {
      waitUntil: 'domcontentloaded',
      timeout: 25000
    });
    await page.waitForTimeout(4000);
  } catch {
    console.log(`HTTP-ERR | ${slug}`);
    await page.close();
    continue;
  }

  const r = await page.evaluate(() => {
    const controls = Array.from(
      document.querySelectorAll('.grid input, .grid select, .sc-sidebar input, .sc-sidebar select, .sc-layout input, .sc-layout select, .wrap input, .wrap select, .panel input, .panel select')
    ).filter((el) => {
      const t = el.getAttribute('type');
      if (t && ['hidden', 'submit', 'button'].includes(t)) return false;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return !(cs.display === 'none' || cs.visibility === 'hidden' || rect.height === 0);
    });
    const editable = controls.filter((el) => {
      if (el.tagName === 'SELECT') return !el.disabled;
      return !el.readOnly;
    }).length;
    const gateActive = !!document.querySelector('.sc-pro-gate-active, [class*="session-active"]');
    return {
      count: controls.length,
      editable,
      gateActive,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      firstTop: controls.length ? Math.round(controls[0].getBoundingClientRect().top + window.scrollY) : null
    };
  });

  const aboveFold = r.firstTop !== null && r.firstTop < VIEWPORT_H;
  const flag = r.count >= 2 && aboveFold && !r.overflow ? 'OK  ' : 'FAIL';
  console.log(`${flag} | ${slug} | controls=${r.count} editable=${r.editable} gateActive=${r.gateActive} firstTop=${r.firstTop} overflow=${r.overflow}`);
  await page.close();
}

await ctx.close();
await browser.close();
