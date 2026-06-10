#!/usr/bin/env node
/**
 * Smoke-test tool feedback UI markers on premium routes + account feedback route.
 * Usage: node scripts/smoke-feedback-ui.mjs [--locale tr]
 */

import {
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
  parseLocaleArg,
} from "./smoke-utils.mjs";

const PREMIUM_SAMPLE_SLUGS = [
  "cnc-quote-risk-analyzer",
  "meal-planning-verdict",
  "cbam-compliance-verdict",
  "change-order-impact-analyzer",
];

const LOCALE_SAMPLES = ["en", "tr", "ar", "de", "fr", "es"];

async function checkFeedbackPanel(path) {
  const result = await fetchRouteWithRetry(path);
  const html = result.body ?? "";
  const hasMarker = html.includes('data-tool-feedback-panel="true"');
  return { ...result, hasMarker };
}

async function main() {
  const localeArg = parseLocaleArg(process.argv);
  const baseUrl = getBaseUrl();
  const failures = [];

  console.log(`=== Feedback UI Smoke (${baseUrl}) ===`);

  for (const slug of PREMIUM_SAMPLE_SLUGS) {
    const path = localePath(localeArg, `/tools/premium/${slug}`);
    const result = await checkFeedbackPanel(path);
    const label = result.ok && result.status === 200 && result.hasMarker ? "✓" : "✗";
    console.log(
      `${label} ${path} → ${result.status || result.error || "error"}${result.hasMarker ? " [feedback panel]" : " [missing panel]"}`,
    );
    if (!result.ok || result.status !== 200 || !result.hasMarker) {
      failures.push({ path, status: result.status, error: result.error, hasMarker: result.hasMarker });
    }
  }

  for (const locale of LOCALE_SAMPLES) {
    const path = localePath(locale, "/tools/premium/cnc-quote-risk-analyzer");
    const result = await checkFeedbackPanel(path);
    const label = result.ok && result.status === 200 && result.hasMarker ? "✓" : "✗";
    console.log(
      `${label} locale ${locale}: ${path}${result.hasMarker ? "" : " [missing panel]"}`,
    );
    if (!result.ok || result.status !== 200 || !result.hasMarker) {
      failures.push({ path, status: result.status, locale, hasMarker: result.hasMarker });
    }
  }

  const accountPath = localePath(localeArg, "/account/feedback");
  const accountResult = await fetchRouteWithRetry(accountPath);
  const accountOk =
    accountResult.ok &&
    (accountResult.status === 200 || accountResult.status === 307 || accountResult.status === 308);
  console.log(
    `${accountOk ? "✓" : "✗"} ${accountPath} → ${accountResult.status || accountResult.error || "error"}`,
  );
  if (!accountOk) {
    failures.push({ path: accountPath, status: accountResult.status, error: accountResult.error });
  }

  if (failures.length > 0) {
    console.error(`\nFeedback UI smoke FAILED (${failures.length} issues)`);
    process.exit(1);
  }

  console.log("\nFeedback UI smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
