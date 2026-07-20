#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = (process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const artifactsDir = "artifacts/break-even-browser-e2e";
const expectedHeading = "Know the cost. See the risk. Make the call.";
const expectedTitle = "Industrial calculators for cost, risk, production and engineering decisions.";

mkdirSync(artifactsDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseRgb(value) {
  const match = String(value).match(/rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*(\d+(?:\.\d+)?))?\)/i);
  if (!match) throw new Error(`Unsupported CSS color: ${value}`);
  return {
    red: Number(match[1]),
    green: Number(match[2]),
    blue: Number(match[3]),
    alpha: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function relativeLuminance({ red, green, blue }) {
  const channels = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

function assertRange(value, min, max, label) {
  assert(value >= min && value <= max, `${label}: ${value.toFixed(2)} is outside ${min}-${max}`);
}

function assertEqualHeights(boxes, indexes, label, tolerance = 2) {
  const heights = indexes.map((index) => boxes[index]?.height).filter((value) => Number.isFinite(value));
  assert(heights.length === indexes.length, `${label}: geometry unavailable`);
  const delta = Math.max(...heights) - Math.min(...heights);
  assert(delta <= tolerance, `${label}: height delta ${delta.toFixed(2)}px exceeds ${tolerance}px`);
}

function controlGap(first, second) {
  const horizontalOverlap = Math.min(first.right, second.right) - Math.max(first.left, second.left);
  const verticalOverlap = Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top);

  if (verticalOverlap > 0) {
    return Math.max(second.left - first.right, first.left - second.right, 0);
  }
  if (horizontalOverlap > 0) {
    return Math.max(second.top - first.bottom, first.top - second.bottom, 0);
  }

  const horizontalGap = Math.max(second.left - first.right, first.left - second.right, 0);
  const verticalGap = Math.max(second.top - first.bottom, first.top - second.bottom, 0);
  return Math.hypot(horizontalGap, verticalGap);
}

async function readBoxes(locator) {
  return locator.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };
  }));
}

async function readHeadingMetrics(locator) {
  return locator.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    const styles = window.getComputedStyle(element);
    const fontSize = Number.parseFloat(styles.fontSize);
    const lineHeight = Number.parseFloat(styles.lineHeight);
    return {
      id: element.id,
      text: String(element.textContent ?? "").replace(/\s+/g, " ").trim(),
      fontSize,
      lineHeight,
      width: rect.width,
      height: rect.height,
      lineCount: Number.isFinite(lineHeight) && lineHeight > 0 ? Math.ceil((rect.height - 0.5) / lineHeight) : null,
    };
  }));
}

const profiles = [
  {
    name: "desktop-1440",
    width: 1440,
    height: 900,
    heroRange: [72, 78],
    sectionRange: [38, 53],
    hierarchyMinimum: 1.3,
    maxHeadingLines: 4,
    sectionPaddingRange: [86, 94],
  },
  {
    name: "desktop-1280",
    width: 1280,
    height: 800,
    heroRange: [64, 70],
    sectionRange: [37, 53],
    hierarchyMinimum: 1.25,
    maxHeadingLines: 4,
    sectionPaddingRange: [80, 86],
  },
  {
    name: "compact-1024",
    width: 1024,
    height: 768,
    heroRange: [51, 58],
    sectionRange: [32, 45],
    hierarchyMinimum: 1.2,
    maxHeadingLines: 4,
    sectionPaddingRange: [70, 74],
  },
  {
    name: "tablet-768",
    width: 768,
    height: 1024,
    heroRange: [48, 55],
    sectionRange: [32, 43],
    hierarchyMinimum: 1.16,
    maxHeadingLines: 5,
    sectionPaddingRange: [70, 74],
  },
  {
    name: "mobile-390",
    width: 390,
    height: 844,
    heroRange: [42, 46],
    sectionRange: [28, 36],
    hierarchyMinimum: 1.23,
    maxHeadingLines: 7,
    sectionPaddingRange: [58, 62],
  },
  {
    name: "mobile-320",
    width: 320,
    height: 568,
    heroRange: [39, 42],
    sectionRange: [28, 36],
    hierarchyMinimum: 1.14,
    maxHeadingLines: 8,
    sectionPaddingRange: [58, 62],
  },
];

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const profile of profiles) {
    const context = await browser.newContext({
      viewport: { width: profile.width, height: profile.height },
      deviceScaleFactor: 1,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedSameOriginRequests = [];

    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const text = message.text();
      // Third-party billing SDKs may log CSP/network noise before headers warm; ignore known vendors.
      if (/cdn\.paddle\.com|js\.stripe\.com|googletagmanager|google-analytics/i.test(text)) return;
      consoleErrors.push(text);
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => {
      if (!request.url().startsWith(baseUrl)) return;
      const failure = request.failure()?.errorText ?? "unknown";
      const requestUrl = new URL(request.url());
      const expectedPrefetchAbort =
        request.method() === "GET" &&
        requestUrl.searchParams.has("_rsc") &&
        failure === "net::ERR_ABORTED";
      if (expectedPrefetchAbort) return;
      failedSameOriginRequests.push({
        url: request.url(),
        method: request.method(),
        failure,
      });
    });

    try {
      const response = await page.goto(`${baseUrl}/`, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      assert(response?.status() === 200, `${profile.name}: homepage returned HTTP ${response?.status()}`);

      const heading = page.locator("#home-title");
      await heading.waitFor({ state: "visible", timeout: 30_000 });
      const headingText = normalizeText(await heading.innerText());
      assert(headingText === expectedHeading, `${profile.name}: unexpected H1: ${headingText}`);
      assert((await page.title()).includes(expectedTitle), `${profile.name}: homepage title contract failed`);

      const primaryCta = page.getByRole("link", { name: "Open free calculators", exact: true });
      const secondaryCta = page.getByRole("link", { name: "Explore Pro decision tools", exact: true }).first();
      await primaryCta.waitFor({ state: "visible", timeout: 20_000 });
      await secondaryCta.waitFor({ state: "visible", timeout: 20_000 });
      assert(await primaryCta.getAttribute("href") === "/free-tools", `${profile.name}: primary CTA target drifted`);
      assert(await secondaryCta.getAttribute("href") === "/pro-tools", `${profile.name}: secondary CTA target drifted`);

      const primaryBox = await primaryCta.boundingBox();
      const secondaryBox = await secondaryCta.boundingBox();
      assert(primaryBox && primaryBox.width >= 48 && primaryBox.height >= 48, `${profile.name}: primary CTA touch target is below 48x48px`);
      assert(secondaryBox && secondaryBox.width >= 48 && secondaryBox.height >= 48, `${profile.name}: secondary CTA touch target is below 48x48px`);
      // First-paint CTA: enforce on tablet/desktop. Mobile hero copy is intentionally taller;
      // CTA remains visible below the fold with standard scroll (mobile-390/320).
      if (profile.width >= 768) {
        assert(
          primaryBox.y < profile.height,
          `${profile.name}: primary CTA top (${primaryBox.y.toFixed(1)}) is below the initial viewport (${profile.height})`,
        );
      }
      const primaryStyles = await primaryCta.evaluate((element) => {
        const styles = window.getComputedStyle(element);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
        };
      });
      assert(primaryStyles.display !== "none", `${profile.name}: primary CTA display is none`);
      assert(primaryStyles.visibility === "visible", `${profile.name}: primary CTA is not visible`);
      assert(Number(primaryStyles.opacity) >= 0.99, `${profile.name}: primary CTA opacity is below 0.99`);

      const foreground = parseRgb(primaryStyles.color);
      const background = parseRgb(primaryStyles.backgroundColor);
      assert(background.alpha === 1, `${profile.name}: primary CTA background is not opaque`);
      const primaryCtaRatio = contrastRatio(foreground, background);
      assert(primaryCtaRatio >= 4.5, `${profile.name}: primary CTA contrast ${primaryCtaRatio.toFixed(2)} is below 4.5:1`);

      const proHeading = page.locator("#pro-title");
      await proHeading.waitFor({ state: "visible", timeout: 20_000 });
      const proStyles = await proHeading.evaluate((element) => {
        const section = element.closest(".sc-pro-section");
        if (!section) throw new Error("Pro section container missing");
        return {
          color: window.getComputedStyle(element).color,
          backgroundColor: window.getComputedStyle(section).backgroundColor,
        };
      });
      const proHeadingRatio = contrastRatio(parseRgb(proStyles.color), parseRgb(proStyles.backgroundColor));
      assert(proHeadingRatio >= 4.5, `${profile.name}: Pro heading contrast ${proHeadingRatio.toFixed(2)} is below 4.5:1`);

      const proPrimaryCta = page.getByRole("link", { name: "View Pro decision tools", exact: true });
      await proPrimaryCta.waitFor({ state: "visible", timeout: 20_000 });
      const proPrimaryStyles = await proPrimaryCta.evaluate((element) => {
        const styles = window.getComputedStyle(element);
        return {
          text: String(element.textContent ?? "").replace(/\s+/g, " ").trim(),
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        };
      });
      assert(proPrimaryStyles.text.length > 0, `${profile.name}: Pro primary CTA is blank`);
      assert(proPrimaryStyles.width >= 48 && proPrimaryStyles.height >= 48, `${profile.name}: Pro primary CTA geometry is below 48x48px`);
      const proPrimaryCtaRatio = contrastRatio(
        parseRgb(proPrimaryStyles.color),
        parseRgb(proPrimaryStyles.backgroundColor),
      );
      assert(proPrimaryCtaRatio >= 4.5, `${profile.name}: Pro primary CTA contrast ${proPrimaryCtaRatio.toFixed(2)} is below 4.5:1`);

      const buttonAudit = await page.locator(".sc-landing .sc-button").evaluateAll((elements) => elements.map((element) => {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);
        return {
          text: String(element.textContent ?? "").replace(/\s+/g, " ").trim(),
          width: rect.width,
          height: rect.height,
          display: styles.display,
          visibility: styles.visibility,
          opacity: Number(styles.opacity),
        };
      }));
      for (const button of buttonAudit) {
        assert(button.text.length > 0, `${profile.name}: blank homepage button detected`);
        assert(button.width >= 48 && button.height >= 48, `${profile.name}: invalid 48x48px button geometry for ${button.text}`);
        assert(button.display !== "none" && button.visibility === "visible" && button.opacity >= 0.99, `${profile.name}: hidden button detected for ${button.text}`);
      }

      const actionRowControls = await page.locator(".sc-landing .sc-action-row").evaluateAll((rows) => rows.map((row) => (
        Array.from(row.querySelectorAll("a, button"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);
            return {
              text: String(element.textContent ?? "").replace(/\s+/g, " ").trim(),
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              visible: styles.display !== "none" && styles.visibility === "visible" && Number(styles.opacity) >= 0.99,
            };
          })
          .filter((control) => control.visible)
      )));
      for (const [rowIndex, controls] of actionRowControls.entries()) {
        for (let index = 1; index < controls.length; index += 1) {
          const gap = controlGap(controls[index - 1], controls[index]);
          assert(
            gap >= 8,
            `${profile.name}: action row ${rowIndex + 1} controls ${controls[index - 1].text} / ${controls[index].text} have only ${gap.toFixed(2)}px gap`,
          );
        }
      }

      const layout = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
      }));
      assert(
        Math.max(layout.documentWidth, layout.bodyWidth) <= layout.viewportWidth + 1,
        `${profile.name}: horizontal overflow detected (${JSON.stringify(layout)})`,
      );

      const heroMetrics = (await readHeadingMetrics(heading))[0];
      assert(heroMetrics, `${profile.name}: hero typography unavailable`);
      assertRange(heroMetrics.fontSize, profile.heroRange[0], profile.heroRange[1], `${profile.name}: hero font size`);
      assert(heroMetrics.lineCount === 3, `${profile.name}: hero must remain a three-line statement, got ${heroMetrics.lineCount}`);

      const sectionMetrics = await readHeadingMetrics(page.locator(".sc-landing h2"));
      assert(
        sectionMetrics.length >= 7 && sectionMetrics.length <= 9,
        `${profile.name}: expected 7–9 homepage H2 headings, got ${sectionMetrics.length}`,
      );
      for (const metric of sectionMetrics) {
        assertRange(metric.fontSize, profile.sectionRange[0], profile.sectionRange[1], `${profile.name}: ${metric.id || metric.text} font size`);
        assert(metric.lineCount !== null && metric.lineCount <= profile.maxHeadingLines, `${profile.name}: ${metric.id || metric.text} uses ${metric.lineCount} lines`);
      }
      const maximumSectionFont = Math.max(...sectionMetrics.map((metric) => metric.fontSize));
      const hierarchyRatio = heroMetrics.fontSize / maximumSectionFont;
      assert(
        hierarchyRatio >= profile.hierarchyMinimum,
        `${profile.name}: hero/H2 hierarchy ratio ${hierarchyRatio.toFixed(2)} is below ${profile.hierarchyMinimum}`,
      );

      const sectionPaddingTop = await page.locator(".sc-section").first().evaluate((element) => Number.parseFloat(window.getComputedStyle(element).paddingTop));
      assertRange(
        sectionPaddingTop,
        profile.sectionPaddingRange[0],
        profile.sectionPaddingRange[1],
        `${profile.name}: section padding`,
      );

      assert(await page.locator(".sc-report-preview").isVisible(), `${profile.name}: decision report preview is hidden`);
      const productCards = page.locator(".sc-product-card");
      assert(await productCards.count() === 3, `${profile.name}: expected three product-path cards`);
      const productBoxes = await readBoxes(productCards);
      if (profile.width >= 961) {
        assertEqualHeights(productBoxes, [0, 1, 2], `${profile.name}: product-card symmetry`);
      } else if (profile.width > 720) {
        const productGridBox = await page.locator(".sc-product-grid").boundingBox();
        const lastProductCardBox = await productCards.last().boundingBox();
        assert(productGridBox && lastProductCardBox, `${profile.name}: product grid geometry unavailable`);
        assert(
          lastProductCardBox.width >= productGridBox.width - 2,
          `${profile.name}: orphan product card leaves an empty column (${lastProductCardBox.width}/${productGridBox.width})`,
        );
        assertEqualHeights(productBoxes, [0, 1], `${profile.name}: first-row product-card symmetry`);
      }

      if (profile.width >= 961) {
        assertEqualHeights(await readBoxes(page.locator(".sc-case-card")), [0, 1, 2], `${profile.name}: case-card symmetry`);
        const sectorBoxes = await readBoxes(page.locator(".sc-sector-card"));
        assertEqualHeights(sectorBoxes, [0, 1, 2], `${profile.name}: sector row one symmetry`);
        assertEqualHeights(sectorBoxes, [3, 4, 5], `${profile.name}: sector row two symmetry`);
      } else if (profile.width > 720) {
        const sectorBoxes = await readBoxes(page.locator(".sc-sector-card"));
        assertEqualHeights(sectorBoxes, [0, 1], `${profile.name}: sector row one symmetry`);
        assertEqualHeights(sectorBoxes, [2, 3], `${profile.name}: sector row two symmetry`);
        assertEqualHeights(sectorBoxes, [4, 5], `${profile.name}: sector row three symmetry`);
      }

      if (profile.width > 720) {
        assertEqualHeights(await readBoxes(page.locator(".sc-principle-grid article")), [0, 1, 2], `${profile.name}: trust-card symmetry`);
      }

      assert(await page.getByText("Trace AI audit-grounded copilot", { exact: false }).count() === 0, `${profile.name}: demo Trace AI leaked onto homepage`);
      assert(await page.getByText("Ready to streamline your calculations?", { exact: true }).count() === 0, `${profile.name}: duplicate generic footer CTA leaked onto homepage`);
      assert(await page.locator('a[href="#"]').count() === 0, `${profile.name}: placeholder link detected`);

      await page.waitForTimeout(400);
      assert(consoleErrors.length === 0, `${profile.name}: console errors: ${consoleErrors.join(" | ")}`);
      assert(pageErrors.length === 0, `${profile.name}: page errors: ${pageErrors.join(" | ")}`);
      assert(
        failedSameOriginRequests.length === 0,
        `${profile.name}: failed same-origin requests: ${JSON.stringify(failedSameOriginRequests)}`,
      );

      await page.screenshot({
        path: `${artifactsDir}/homepage-${profile.name}.png`,
        fullPage: true,
      });

      results.push({
        profile,
        status: "PASS",
        heading: headingText,
        heroMetrics,
        sectionMetrics,
        hierarchyRatio: Number(hierarchyRatio.toFixed(2)),
        sectionPaddingTop,
        primaryCtaContrast: Number(primaryCtaRatio.toFixed(2)),
        proHeadingContrast: Number(proHeadingRatio.toFixed(2)),
        proPrimaryCtaContrast: Number(proPrimaryCtaRatio.toFixed(2)),
        layout,
        consoleErrors,
        pageErrors,
        failedSameOriginRequests,
      });
    } catch (error) {
      await page.screenshot({
        path: `${artifactsDir}/homepage-${profile.name}-failure.png`,
        fullPage: true,
      }).catch(() => undefined);
      results.push({
        profile,
        status: "FAIL",
        error: error instanceof Error ? error.stack : String(error),
        consoleErrors,
        pageErrors,
        failedSameOriginRequests,
      });
      throw error;
    } finally {
      await context.close();
    }
  }

  writeFileSync(
    `${artifactsDir}/homepage-responsive-result.json`,
    JSON.stringify({ status: "PASS", results }, null, 2),
  );
  console.log("HOMEPAGE_RESPONSIVE_BROWSER_QA=PASS");
} catch (error) {
  writeFileSync(
    `${artifactsDir}/homepage-responsive-result.json`,
    JSON.stringify({ status: "FAIL", results }, null, 2),
  );
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
