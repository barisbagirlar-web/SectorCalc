import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
for (const slug of ['bolt-torque-preload', 'quote-pricing']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`https://sectorcalc.com/calculator/${slug}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const r = await page.evaluate(() => {
    // Find all visible textual inputs anywhere in the doc
    const all = Array.from(document.querySelectorAll('input')).map((i, idx) => ({
      idx,
      id: i.id,
      type: i.type,
      readOnly: i.readOnly,
      hidden: getComputedStyle(i).display === 'none' || getComputedStyle(i).visibility === 'hidden' ||
        (i.getBoundingClientRect().height === 0 && getComputedStyle(i).display !== 'inline'),
      parent: i.closest('div')?.className?.toString().slice(0, 40) || '',
      containerChain: Array.from(i.closest('.grid, .panel, .sidebar, .sc-sidebar, .form, .calc, .wrap') ? [i.closest('.grid, .panel, .sidebar, .sc-sidebar, .form, .calc, .wrap')] : []).map(e => e.className?.toString().slice(0,30))
    }));
    const grid = document.querySelector('.grid');
    const gridDisplay = grid ? getComputedStyle(grid).display : null;
    const gridRect = grid ? grid.getBoundingClientRect() : null;
    return {
      totalInputs: all.length,
      visibleInputs: all.filter(i => !i.hidden).length,
      readonlyInputs: all.filter(i => i.readOnly).length,
      grid: { exists: !!grid, display: gridDisplay, rect: gridRect ? { w: Math.round(gridRect.width), h: Math.round(gridRect.height), top: Math.round(gridRect.top) } : null },
      first6: all.slice(0, 6)
    };
  });
  console.log(`\n=== ${slug} ===`);
  console.log(JSON.stringify(r, null, 1));
  await page.close();
}
await browser.close();
