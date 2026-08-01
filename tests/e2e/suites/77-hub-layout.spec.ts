import { test, expect } from '@playwright/test';

/**
 * Hub layout regression guard.
 * The /topics page (main.sc-guides-hub) must render inside the same
 * 1100px container as every other hub (.sc-guides-main). A missing
 * max-width on .sc-guides-hub previously stretched content edge-to-edge.
 */
test.describe('Hub layout regression', () => {
  test('topics: constrained container, no horizontal overflow @critical', async ({ page }) => {
    await page.goto('/topics', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4500);

    const info = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const main = document.querySelector('main') as HTMLElement;
      const mr = main.getBoundingClientRect();
      const cs = getComputedStyle(main);
      const overflow = document.documentElement.scrollWidth > vw + 1;
      const cards = Array.from(document.querySelectorAll('.sc-guide-card')).map((c) => {
        const r = (c as HTMLElement).getBoundingClientRect();
        return { l: Math.round(r.left), r: Math.round(r.right) };
      });
      return {
        vw,
        mainWidth: Math.round(mr.width),
        maxWidth: cs.maxWidth,
        overflow,
        cardCount: cards.length,
        cardMinLeft: cards.length ? Math.min(...cards.map((c) => c.l)) : -1,
        cardMaxRight: cards.length ? Math.max(...cards.map((c) => c.r)) : -1
      };
    });

    expect(info.maxWidth).toBe('1100px');
    expect(info.mainWidth).toBeLessThanOrEqual(1100);
    expect(info.overflow).toBe(false);
    expect(info.cardMinLeft).toBeGreaterThanOrEqual(0);
    expect(info.cardMaxRight).toBeLessThanOrEqual(info.vw - 8);
  });

  test('sibling hubs remain inside the same container @critical', async ({ page }) => {
    for (const path of ['/glossary', '/compare', '/guides']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const info = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const main = document.querySelector('main') as HTMLElement;
        const cs = getComputedStyle(main);
        return {
          path: location.pathname,
          vw,
          maxWidth: cs.maxWidth,
          overflow: document.documentElement.scrollWidth > vw + 1
        };
      });
      expect(info.maxWidth, `${info.path} container`).toBe('1100px');
      expect(info.overflow, `${info.path} overflow`).toBe(false);
    }
  });
});
