import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(150000);

const network = [];
page.on('request', (r) => {
  const u = r.url();
  if (u.includes('fonts.gstatic') || u.includes('google-analytics') || u.includes('googletagmanager')) return;
  network.push(`${Date.now() % 100000} REQ ${r.method()} ${u.slice(0, 130)}`);
});
page.on('response', (r) => {
  const u = r.url();
  if (u.includes('fonts.gstatic') || u.includes('google-analytics') || u.includes('googletagmanager')) return;
  network.push(`${Date.now() % 100000} RES ${r.status()} ${u.slice(0, 130)}`);
});

await page.goto('https://sectorcalc.com/calculator/tolerance-stack-up', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(6000);
network.length = 0; // clear load-time noise

const t0 = Date.now();
await page.locator('#genReport').click();
console.log('click resolved in', Date.now() - t0, 'ms');
console.log('NETWORK during click:');
console.log(network.join('\n') || '(none)');

await browser.close();
