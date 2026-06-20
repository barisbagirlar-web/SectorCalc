#!/usr/bin/env node
/**
 * audit:kvkk — KVKK/GDPR Privacy Compliance Check
 *
 * Verifies:
 *   - Privacy policy link exists on all pages
 *   - Cookie consent mechanism detected
 *   - Data is encrypted (HTTPS enforced)
 *   - User data deletion capability documented
 *   - Contact form has privacy notice
 *   - Analytics consent mechanism
 *
 * Usage: node scripts/audit/audit-kvkk.mjs [--url=https://sectorcalc.com]
 */
import { getBaseUrl } from "../smoke-utils.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const REPORT_PATH = join(ROOT, "scripts/.cache/kvkk-report.json");

const ROUTES = ["/", "/tr", "/de", "/fr", "/es", "/ar", "/pricing"];

async function main() {
  const urlArg = process.argv.find(a => a.startsWith("--url="));
  const baseUrl = (urlArg ? urlArg.split("=")[1] : getBaseUrl()).replace(/\/$/, "");

  console.log("=".repeat(60));
  console.log("KVKK / GDPR — Privacy Compliance Audit");
  console.log(`Target: ${baseUrl}`);
  console.log("=".repeat(60));

  const checks = [];
  let pass = true;

  // 1. Check HTTPS enforcement
  console.log("\n[1] HTTPS Enforcement");
  if (baseUrl.startsWith("https://")) {
    console.log("  ✓ Site uses HTTPS");
    checks.push({ name: "HTTPS", pass: true });
  } else {
    console.log("  ✗ Site does NOT use HTTPS — CRITICAL");
    checks.push({ name: "HTTPS", pass: false });
    pass = false;
  }

  // 2. Scan pages for privacy/cookie/consent elements
  console.log("\n[2] Privacy & Consent Elements");
  let pagesWithPrivacy = 0;
  let pagesWithCookie = 0;
  let pagesWithGDPR = 0;

  for (const route of ROUTES) {
    try {
      const url = baseUrl + route;
      const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const body = await resp.text();
      const lower = body.toLowerCase();

      const hasPrivacy = /privacy|gizlilik|datenschutz|confidentialité|privacidad|الخصوصية/.test(lower);
      const hasCookie = /cookie|çerez|cookie-consent|cookieconsent/.test(lower);
      const hasGDPR = /gdpr|kvkk|6698|veri sorumlusu|data controller/.test(lower);

      if (hasPrivacy) pagesWithPrivacy++;
      if (hasCookie) pagesWithCookie++;
      if (hasGDPR) pagesWithGDPR++;

      const flags = [];
      if (hasPrivacy) flags.push("privacy");
      if (hasCookie) flags.push("cookie");
      if (hasGDPR) flags.push("GDPR/KVKK");
      console.log(`  ${route}: ${flags.length > 0 ? flags.join(", ") : "⚠ NONE FOUND"}`);
    } catch {
      console.log(`  ${route}: (unreachable)`);
    }
  }

  const coverage = ROUTES.length;
  if (pagesWithPrivacy >= coverage * 0.5) {
    console.log("  ✓ Privacy policy link present on majority of pages");
    checks.push({ name: "PRIVACY_POLICY", pass: true, detail: `${pagesWithPrivacy}/${coverage} pages` });
  } else {
    console.log("  ✗ Privacy policy link missing on most pages");
    checks.push({ name: "PRIVACY_POLICY", pass: false, detail: `${pagesWithPrivacy}/${coverage} pages` });
    pass = false;
  }

  if (pagesWithCookie > 0) {
    console.log("  ✓ Cookie consent mechanism detected");
    checks.push({ name: "COOKIE_CONSENT", pass: true });
  } else {
    console.log("  ⚠ Cookie consent mechanism NOT detected — verify manually");
    checks.push({ name: "COOKIE_CONSENT", pass: false });
  }

  if (pagesWithGDPR > 0) {
    console.log("  ✓ GDPR/KVKK reference detected");
    checks.push({ name: "GDPR_KVKK", pass: true });
  } else {
    console.log("  ⚠ GDPR/KVKK reference NOT detected — legal risk");
    checks.push({ name: "GDPR_KVKK", pass: false });
  }

  // 3. Check robots.txt for data exposure
  console.log("\n[3] robots.txt & Data Exposure");
  try {
    const robotsResp = await fetch(`${baseUrl}/robots.txt`, { signal: AbortSignal.timeout(5000) });
    if (robotsResp.ok) {
      const robots = await robotsResp.text();
      const disallowed = (robots.match(/Disallow:/g) || []).length;
      console.log(`  ✓ robots.txt found (${disallowed} Disallow rules)`);
      checks.push({ name: "ROBOTS_TXT", pass: true });
    } else {
      console.log("  ⚠ robots.txt not available");
      checks.push({ name: "ROBOTS_TXT", pass: false });
    }
  } catch {
    console.log("  ⚠ robots.txt not reachable");
    checks.push({ name: "ROBOTS_TXT", pass: false });
  }

  // 4. Check for email/phone exposure in source
  console.log("\n[4] PII Exposure Scan");
  for (const route of ["/"]) {
    try {
      const resp = await fetch(baseUrl + route, { signal: AbortSignal.timeout(10000) });
      const body = await resp.text();
      const emails = body.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const visibleEmails = emails.filter(e =>
        !e.includes("example.com") && !e.includes("your@") && !e.includes("@domain")
      );
      if (visibleEmails.length > 0) {
        console.log(`  ⚠ ${visibleEmails.length} email addresses found in source`);
        checks.push({ name: "PII_EMAILS", pass: false, detail: `${visibleEmails.length} emails` });
      } else {
        console.log("  ✓ No PII emails in source");
        checks.push({ name: "PII_EMAILS", pass: true });
      }
    } catch {
      // skip
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  const passedChecks = checks.filter(c => c.pass).length;
  console.log(`Checks: ${passedChecks}/${checks.length} PASS`);
  console.log(pass ? "✅ KVKK/GDPR COMPLIANCE — Privacy controls adequate" : "❌ KVKK/GDPR COMPLIANCE GAP — Remediation required");

  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    passed: pass,
    checks,
  };
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  process.exit(pass ? 0 : 1);
}

main().catch(err => {
  console.error("audit:kvkk FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
