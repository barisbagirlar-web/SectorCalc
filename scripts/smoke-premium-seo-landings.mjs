#!/usr/bin/env node
/**
 * Smoke: SEO-P2 premium tool SEO landings on /seo/[slug].
 * Usage: node scripts/smoke-premium-seo-landings.mjs
 *
 * Slug list mirrors the canonical premium tool registry
 * (src/lib/tools/revenue-tools.ts → paidSlug). Keep in sync.
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
} from "./smoke-utils.mjs";

const PREMIUM_SLUGS = [
  "cnc-quote-risk-analyzer",
  "change-order-impact-analyzer",
  "office-cleaning-bid-optimizer",
  "menu-profit-leak-detector",
  "return-profit-erosion-tool",
  "welding-bid-risk-analyzer",
  "hvac-project-margin-guard",
  "panel-shop-margin-verdict",
  "landscaping-contract-profit-tool",
  "auto-shop-margin-leak-detector",
  "signage-bid-safe-price-tool",
  "plumbing-job-margin-verdict",
  "millwork-bid-risk-analyzer",
  "roofing-contract-margin-guard",
  "painting-job-profit-verdict",
  "sheet-metal-quote-risk-tool",
  "3d-print-job-margin-tool",
  "route-optimization-analyzer",
  "crop-yield-loss-analyzer",
  "water-optimization-verdict",
  "feed-efficiency-analyzer",
  "dairy-profit-detector",
  "energy-efficiency-report",
  "cbam-compliance-verdict",
  "renovation-budget-optimizer",
  "trip-budget-optimizer",
  "meal-planning-verdict",
];

const SAMPLE_LOCALES = ["tr", "ar", "de", "fr", "es"];
const SAMPLE_SLUGS = ["cnc-quote-risk-analyzer", "hvac-project-margin-guard", "meal-planning-verdict"];
const MIN_BODY_LENGTH = 500;

async function auditLanding(locale, slug) {
  const path = localePath(locale, `/seo/${slug}`);
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const checks = {
    status200: result.status === 200,
    landing: body.includes('data-premium-seo-landing="true"'),
    cta: body.includes('data-seo-tool-cta="true"'),
    ctaHref: body.includes(`/tools/premium/${slug}`),
    h1: body.includes("<h1"),
    noFatal: fatals.length === 0,
    bodyOk: body.length >= MIN_BODY_LENGTH,
  };
  const ok = Object.values(checks).every(Boolean);
  return { locale, path, status: result.status, checks, ok };
}

/** /en/seo/<slug> must NOT behave as a supported 200 route. */
async function auditEnPrefix() {
  const url = `${getBaseUrl()}/en/seo/${PREMIUM_SLUGS[0]}`;
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    const ok = res.status !== 200;
    return { url, status: res.status, ok };
  } catch (error) {
    return { url, status: 0, ok: false, error: String(error) };
  }
}

function failedKeys(checks) {
  return Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k)
    .join(", ");
}

async function main() {
  console.log(`=== Premium SEO Landings Smoke (${getBaseUrl()}) ===\n`);
  const failures = [];

  console.log(`English landings (${PREMIUM_SLUGS.length}):`);
  for (const slug of PREMIUM_SLUGS) {
    const r = await auditLanding("en", slug);
    console.log(
      `${r.ok ? "✓" : "✗"} ${r.path} → ${r.status}` +
        (r.ok ? "" : ` [fail: ${failedKeys(r.checks)}]`),
    );
    if (!r.ok) failures.push(r);
  }

  console.log("\nLocale samples:");
  for (const locale of SAMPLE_LOCALES) {
    for (const slug of SAMPLE_SLUGS) {
      const r = await auditLanding(locale, slug);
      console.log(
        `${r.ok ? "✓" : "✗"} ${r.path} → ${r.status}` +
          (r.ok ? "" : ` [fail: ${failedKeys(r.checks)}]`),
      );
      if (!r.ok) failures.push(r);
    }
  }

  console.log("\n/en prefix guard:");
  const enCheck = await auditEnPrefix();
  console.log(`${enCheck.ok ? "✓" : "✗"} ${enCheck.url} → ${enCheck.status} (must not be 200)`);
  if (!enCheck.ok) failures.push(enCheck);

  if (failures.length > 0) {
    console.error(`\nPremium SEO landings smoke FAILED (${failures.length} checks)`);
    process.exit(1);
  }
  console.log("\nPremium SEO landings smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
