/**
 * Confirm NaN/Infinity reports are pristine-CSS artifacts, not real leaks:
 * check body.textContent of a PRISTINE page (no hostile input) for the 8 tools
 * the adversarial matrix flagged.
 */
import { chromium } from 'playwright';

const TOOLS = [
  ['SC-020', 'cnc-feeds-speeds'],
  ['SC-021', 'bearing-life-l10'],
  ['SC-028', 'surface-finish'],
  ['SC-030', 'sheet-metal-bend'],
  ['SC-031', 'sling-capacity'],
  ['SC-032', 'shackle-eyebolt'],
  ['SC-039', 'punching-force'],
  ['SC-040', 'hydraulic-cylinder']
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(15000);

for (const [code, slug] of TOOLS) {
  const url = `https://sectorcalc.com/calculator/${slug}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3500);
  const info = await page.evaluate(() => {
    const t = document.body.textContent || '';
    const find = (token) => {
      const where = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const txt = n.textContent || '';
        if (txt.includes(token)) {
          const parent = n.parentElement;
          let line = txt.trim().replace(/\s+/g, ' ').slice(0, 60);
          const chain = [];
          let el = parent;
          for (let i = 0; i < 4 && el; i++) {
            chain.unshift(el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : '') + (el.id ? '#' + el.id : ''));
            el = el.parentElement;
          }
          if (line) where.push(`[${chain.join(' > ')}] "${line}"`);
        }
      }
      return where.slice(0, 4);
    };
    return { hasNaN: t.includes('NaN'), hasInf: t.includes('Infinity'), nanWhere: find('NaN'), infWhere: find('Infinity') };
  });
  const artifact = info.hasNaN || info.hasInf;
  console.log(`${code} ${slug.padEnd(22)} pristineNaN=${info.hasNaN} pristineInf=${info.hasInf} → ${artifact ? 'ARTIFACT (CSS/static text)' : 'CLEAN'}`);
  if (info.nanWhere.length) console.log(`   NaN at: ${info.nanWhere.join(' | ')}`);
  if (info.infWhere.length) console.log(`   Inf at: ${info.infWhere.join(' | ')}`);
}
await browser.close();
