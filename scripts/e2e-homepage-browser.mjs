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

const profiles = [
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
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
      if (message.type() === "error") consoleErrors.push(message.text());
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
      assert(primaryBox && primaryBox.height >= 44, `${profile.name}: primary CTA touch target is below 44px`);
      assert(secondaryBox && secondaryBox.height >= 44, `${profile.name}: secondary CTA touch target is below 44px`);
      assert(primaryBox.y + primaryBox.height <= profile.height + 1, `${profile.name}: primary CTA is outside the initial viewport`);

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

      const layout = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
      }));
      assert(
        Math.max(layout.documentWidth, layout.bodyWidth) <= layout.viewportWidth + 1,
        `${profile.name}: horizontal overflow detected (${JSON.stringify(layout)})`,
      );

      assert(await page.locator(".sc-report-preview").isVisible(), `${profile.name}: decision report preview is hidden`);
      const productCards = page.locator(".sc-product-card");
      assert(await productCards.count() === 3, `${profile.name}: expected three product-path cards`);
      if (profile.name === "tablet-768") {
        const productGridBox = await page.locator(".sc-product-grid").boundingBox();
        const lastProductCardBox = await productCards.last().boundingBox();
        assert(productGridBox && lastProductCardBox, "tablet-768: product grid geometry unavailable");
        assert(
          lastProductCardBox.width >= productGridBox.width - 2,
          `tablet-768: orphan product card leaves an empty column (${lastProductCardBox.width}/${productGridBox.width})`,
        );
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
        primaryCtaContrast: Number(primaryCtaRatio.toFixed(2)),
        proHeadingContrast: Number(proHeadingRatio.toFixed(2)),
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
