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
const browser = await chromium.launch({ headless: true });
for (const slug of SLUGS) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForTimeout(3500);
  } catch { console.log(`HTTP-ERR | ${slug}`); await page.close(); continue; }
  const r = await page.evaluate(() => {
    const report = document.querySelector('#reportArea');
    const hasHd = !!(report && report.querySelector('.sc-report-hd'));
    const empty = report ? report.querySelector('.sc-empty') : null;
    const emptyVisible = empty ? getComputedStyle(empty).display !== 'none' : false;
    const rect = report ? report.getBoundingClientRect() : null;
    return { hasReport: hasHd, emptyVisible, reportTop: rect ? Math.round(rect.top + window.scrollY) : null, reportH: rect ? Math.round(rect.height) : null };
  });
  const flag = r.hasReport ? 'HAS-REPORT' : r.emptyVisible ? 'EMPTY-PLACEHOLDER' : 'NO-REPORT-AREA';
  console.log(`${flag} | ${slug} | reportTop=${r.reportTop} h=${r.reportH}`);
  await page.close();
}
await browser.close();
