import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(150000);

let dialogs = 0;
page.on('dialog', async (d) => {
  dialogs++;
  console.log('DIALOG:', d.type(), d.message().slice(0, 80));
  await d.dismiss();
});
const network = [];
page.on('request', (r) => {
  if (!r.url().includes('sectorcalc.com') || r.url().includes('google') || r.url().includes('firebase')) return;
  network.push(['REQ', r.method(), r.url().slice(0, 100)].join(' '));
});
page.on('response', (r) => {
  network.push(['RES', r.status(), r.url().slice(0, 100)].join(' '));
});

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(6000);

const t0 = Date.now();
await page.locator('#genReport').click();
console.log('genReport Playwright click resolved in', Date.now() - t0, 'ms; dialogs:', dialogs);
console.log('NETWORK (last 30):');
console.log(network.slice(-30).join('\n'));

await browser.close();
