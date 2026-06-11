#!/usr/bin/env node
/**
 * Smoke: homepage About section + detailed About page across locales.
 * Usage: node scripts/smoke-about-page.mjs
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
  SUPPORTED_LOCALES,
} from "./smoke-utils.mjs";

const HOME_PATHS = SUPPORTED_LOCALES.map((locale) => ({
  locale,
  path: localePath(locale, "/"),
  expectedCtaHref: locale === "en" ? "/about-us" : `/${locale}/about-us`,
}));

const ABOUT_PATHS = SUPPORTED_LOCALES.map((locale) => ({
  locale,
  path: localePath(locale, "/about-us"),
}));

const MIN_BODY_LENGTH = 500;

/** Find the <a> tag containing the home-about CTA marker and return its href. */
function extractAboutCtaHref(body) {
  const markerIdx = body.indexOf('data-home-about-cta="true"');
  if (markerIdx === -1) return null;
  const tagStart = body.lastIndexOf("<a", markerIdx);
  if (tagStart === -1) return null;
  const tagEnd = body.indexOf(">", markerIdx);
  const tag = body.slice(tagStart, tagEnd === -1 ? markerIdx : tagEnd);
  return tag.match(/href="([^"]+)"/)?.[1] ?? null;
}

async function auditHome({ locale, path, expectedCtaHref }) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const ctaHref = extractAboutCtaHref(body);
  const checks = {
    status200: result.status === 200,
    section: body.includes('data-home-about-section="true"'),
    cta: body.includes('data-home-about-cta="true"'),
    ctaHref: ctaHref === expectedCtaHref,
    noEnPrefix: !body.includes('href="/en/about-us"'),
    noFatal: fatals.length === 0,
    bodyOk: body.length >= MIN_BODY_LENGTH,
  };
  const ok = Object.values(checks).every(Boolean);
  return { locale, path, status: result.status, ctaHref, checks, ok };
}

async function auditAbout({ locale, path }) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const checks = {
    status200: result.status === 200,
    detail: body.includes('data-about-detail-page="true"'),
    hero: body.includes('data-about-hero="true"'),
    brand: body.includes("SectorCalc"),
    noFatal: fatals.length === 0,
    bodyOk: body.length >= MIN_BODY_LENGTH,
  };
  const ok = Object.values(checks).every(Boolean);
  return { locale, path, status: result.status, checks, ok };
}

/** /en/about-us must NOT behave as a supported 200 route (redirect or 404). */
async function auditEnPrefix() {
  const url = `${getBaseUrl()}/en/about-us`;
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
  console.log(`=== About Page Smoke (${getBaseUrl()}) ===\n`);
  const failures = [];

  console.log("Homepage About section:");
  for (const target of HOME_PATHS) {
    const r = await auditHome(target);
    console.log(
      `${r.ok ? "✓" : "✗"} ${r.path || "/"} → ${r.status} cta=${r.ctaHref ?? "none"}` +
        (r.ok ? "" : ` [fail: ${failedKeys(r.checks)}]`),
    );
    if (!r.ok) failures.push(r);
  }

  console.log("\nAbout detail page:");
  for (const target of ABOUT_PATHS) {
    const r = await auditAbout(target);
    console.log(
      `${r.ok ? "✓" : "✗"} ${r.path} → ${r.status}` +
        (r.ok ? "" : ` [fail: ${failedKeys(r.checks)}]`),
    );
    if (!r.ok) failures.push(r);
  }

  console.log("\n/en prefix guard:");
  const enCheck = await auditEnPrefix();
  console.log(`${enCheck.ok ? "✓" : "✗"} /en/about-us → ${enCheck.status} (must not be 200)`);
  if (!enCheck.ok) failures.push(enCheck);

  if (failures.length > 0) {
    console.error(`\nAbout page smoke FAILED (${failures.length} checks)`);
    process.exit(1);
  }
  console.log("\nAbout page smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
