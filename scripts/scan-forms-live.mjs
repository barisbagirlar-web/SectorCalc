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

const VIEWPORT_H = 900;
const browser = await chromium.launch({ headless: true });

for (const slug of SLUGS) {
  const page = await browser.newPage({ viewport: { width: 1280, height: VIEWPORT_H } });
  try {
    await page.goto(`https://sectorcalc.com/calculator/${slug}`, {
      waitUntil: 'domcontentloaded',
      timeout: 25000
    });
    await page.waitForTimeout(3500);
  } catch (e) {
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
    let firstTop = Infinity;
    for (const el of controls) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top < firstTop) firstTop = top;
    }
    const calcArea = document.querySelector('.grid, .sc-sidebar, .sc-layout, .wrap .panel, .sc-eng-paper .wrap');
    const calcTop = calcArea ? calcArea.getBoundingClientRect().top + window.scrollY : null;
    return { controlCount: controls.length, firstControlTop: firstTop === Infinity ? null : Math.round(firstTop), calcTop: calcTop ? Math.round(calcTop) : null };
  });

  const aboveFold = r.firstControlTop !== null && r.firstControlTop < VIEWPORT_H;
  const flag = r.controlCount >= 2 && aboveFold ? 'OK  ' : 'FAIL';
  console.log(`${flag} | ${slug} | controls=${r.controlCount} | firstControlTop=${r.firstControlTop} | calcTop=${r.calcTop}`);
  await page.close();
}

await browser.close();
