#!/usr/bin/env node
/**
 * Smoke: Google sign-in UI (no real Google login required).
 *
 * Verifies the customer Google sign-in panel renders with stable markers, is
 * localized on /tr, leaks no Firebase/Stripe private secrets, and that no /en
 * auth route is served.
 *
 * Usage: node scripts/smoke-google-auth-ui.mjs
 *   SMOKE_BASE_URL=http://localhost:3000 node scripts/smoke-google-auth-ui.mjs
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
} from "./smoke-utils.mjs";

const AUTH_MARKERS = [
  'data-auth-google-button="true"',
  'data-auth-error="true"',
  'data-auth-state=',
];

// Strings that must NEVER appear in client HTML (private secrets).
// The PEM marker is assembled at runtime so this detector source does not
// itself contain the literal scanned by check:secrets.
const SECRET_LEAK_PATTERNS = [
  ["BEGIN", "PRIVATE", "KEY"].join(" "),
  "private" + "_key",
  "service" + "_account",
  "STRIPE_SECRET" + "_KEY",
  "STRIPE_WEBHOOK" + "_SECRET",
  "ADMIN_LEAD_UPDATE" + "_SECRET",
];

// Turkish auth copy that must appear on /tr login.
const TR_AUTH_TEXT = ["SectorCalc Pro girişi", "Google ile devam et"];

async function auditAuthRoute({ locale, path, requireTurkish }) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);

  const checks = {
    status200: result.status === 200,
    noFatal: fatals.length === 0,
    noSecretLeak: !SECRET_LEAK_PATTERNS.some((p) => body.includes(p)),
  };
  for (const marker of AUTH_MARKERS) {
    checks[`marker:${marker}`] = body.includes(marker);
  }
  if (requireTurkish) {
    checks.turkishCopy = TR_AUTH_TEXT.some((t) => body.includes(t));
  }

  const ok = Object.values(checks).every(Boolean);
  return { locale, path, status: result.status, checks, ok };
}

/** /en/login must NOT be served as a normal 200 route. */
async function auditEnPrefix() {
  const url = `${getBaseUrl()}/en/login`;
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    return { url, status: res.status, ok: res.status !== 200 };
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
  console.log(`=== Google Sign-In UI Smoke (${getBaseUrl()}) ===\n`);
  const failures = [];

  const targets = [
    { locale: "en", path: localePath("en", "/login"), requireTurkish: false },
    { locale: "tr", path: localePath("tr", "/login"), requireTurkish: true },
  ];

  for (const target of targets) {
    const r = await auditAuthRoute(target);
    console.log(
      `${r.ok ? "✓" : "✗"} ${r.path} → ${r.status}` +
        (r.ok ? "" : ` [fail: ${failedKeys(r.checks)}]`),
    );
    if (!r.ok) failures.push(r);
  }

  console.log("\n/en prefix guard:");
  const enCheck = await auditEnPrefix();
  console.log(`${enCheck.ok ? "✓" : "✗"} /en/login → ${enCheck.status} (must not be 200)`);
  if (!enCheck.ok) failures.push(enCheck);

  if (failures.length > 0) {
    console.error(`\nGoogle sign-in UI smoke FAILED (${failures.length} checks)`);
    process.exit(1);
  }
  console.log("\nGoogle sign-in UI smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
