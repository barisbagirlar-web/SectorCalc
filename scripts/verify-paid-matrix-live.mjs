import { chromium } from 'playwright';

const PAID_TOOLS = [
  ['SC-008', '/calculator/tolerance-stack-up'],
  ['SC-010', '/calculator/true-labor-cost'],
  ['SC-012', '/calculator/quote-pricing'],
  ['SC-020', '/calculator/cnc-feeds-speeds'],
  ['SC-021', '/calculator/bearing-life-l10'],
  ['SC-022', '/calculator/tap-thread-milling'],
  ['SC-023', '/calculator/cycle-time-cost'],
  ['SC-024', '/calculator/bearing-frequencies'],
  ['SC-025', '/calculator/belt-chain-drive'],
  ['SC-026', '/calculator/shaft-design'],
  ['SC-029', '/calculator/weld-heat-input'],
  ['SC-031', '/calculator/sling-capacity'],
  ['SC-032', '/calculator/shackle-eyebolt'],
  ['SC-033', '/calculator/pressure-vessel-shell'],
  ['SC-034', '/calculator/pipe-wall-thickness'],
  ['SC-035', '/calculator/bolt-torque-preload'],
  ['SC-036', '/calculator/bolted-joint'],
  ['SC-037', '/calculator/oee-teep'],
  ['SC-038', '/calculator/machine-hour-rate'],
  ['SC-040', '/calculator/hydraulic-cylinder']
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(15000);

const results = [];
for (const [toolId, slug] of PAID_TOOLS) {
  const row = { toolId, slug, http: 0, report: false, verdict: false, kpi: false, liveResult: false, empty: false, locked: false, demoBanner: false, text: null };
  try {
    const resp = await page.goto(`https://sectorcalc.com${slug}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
    row.http = resp ? resp.status() : 0;
    await page.waitForTimeout(3500);
    row.report = await page.locator('#reportArea .sc-report-title, #reportArea .sc-report-hd, #reportArea .sc-card-res').count().then(c => c > 0);
    row.verdict = await page.locator('#verdict').count().then(c => c > 0);
    row.kpi = await page.locator('#kpis .kpi, #kpiRow .kpi').count().then(c => c > 0);
    row.liveResult = await page.locator('#liveResult').count().then(c => c > 0);
    row.empty = await page.locator('.sc-empty, .empty-state').count().then(c => c > 0);
    row.locked = await page.locator('.sc-lock, .lock-gate, [data-lock]').count().then(c => c > 0);
    row.demoBanner = await page.locator('.sc-demo-report').count().then(c => c > 0);
    const verdictTxt = await page.locator('#verdict').first().textContent().catch(() => null);
    const liveTxt = await page.locator('#liveResult').first().textContent().catch(() => null);
    const kpiTxt = await page.locator('#kpis .kpi, #kpiRow .kpi').first().textContent().catch(() => null);
    const reportTxt = await page.locator('#reportArea').first().textContent().catch(() => null);
    row.text = (verdictTxt || liveTxt || kpiTxt || reportTxt || '').replace(/\s+/g, ' ').trim().slice(0, 90);
  } catch (e) {
    row.text = 'ERROR: ' + String(e).slice(0, 120);
  }
  results.push(row);
  console.log(`${row.http === 200 ? 'OK ' : 'HTTP' + row.http} ${toolId} ${slug.padEnd(38)} report=${row.report} verdict=${row.verdict} kpi=${row.kpi} live=${row.liveResult} empty=${row.empty} locked=${row.locked} demo=${row.demoBanner} :: ${row.text}`);
  if (row.text && row.text.startsWith('ERROR')) console.log(`   ^^ ${toolId} PAGE FAILED`);
}

await browser.close();

const pass = results.filter(r => r.http === 200 && (r.report || r.verdict || (r.kpi && r.liveResult)) && !r.empty && !r.locked);
console.log('\n================ SUMMARY ================');
console.log(`PASS: ${pass.length}/${results.length}`);
const failed = results.filter(r => !(r.http === 200 && (r.report || r.verdict || (r.kpi && r.liveResult)) && !r.empty && !r.locked));
for (const f of failed) console.log(`FAIL: ${f.toolId} ${f.slug} -> ${f.text}`);
