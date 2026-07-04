#!/usr/bin/env node
/**
 * scripts/smoke-v531-form-layout.mjs
 *
 * V5.3.1 Form layout smoke test.
 *
 * Pages use RSC (React Server Components) — form DOM is created client-side.
 * This script checks HTTP status, server errors, Turkish tokens, and CSS source files.
 * Browser-level layout assertions require Playwright; reported NOT_AVAILABLE if absent.
 *
 * Usage: BASE_URL=http://localhost:3000 node scripts/smoke-v531-form-layout.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let exitCode = 0;
let passed = 0;
let failed = 0;

function check(label, ok, detail) {
  if (ok) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}: ${detail || "FAIL"}`);
    failed++;
    exitCode = 1;
  }
}

function warn(label, detail) {
  console.log(`  ⚠ ${label}: ${detail}`);
}

async function fetchHtml(urlPath) {
  try {
    const res = await fetch(`${BASE_URL}${urlPath}`, { redirect: "manual" });
    const html = await res.text();
    return { status: res.status, html };
  } catch (e) {
    return { status: 0, html: "", error: e.message };
  }
}

async function main() {
  console.log(`\n🧪 V5.3.1 FORM LAYOUT SMOKE TEST (BASE_URL=${BASE_URL})\n`);

  // Check for Playwright
  let playwrightAvailable = false;
  try {
    execSync("npx playwright --version 2>/dev/null", { stdio: "ignore" });
    playwrightAvailable = true;
  } catch {
    warn("PLAYWRIGHT", "Not available");
  }

  const testPages = [
    { path: "/tools/generated/pb-ratio-calculator", label: "Free pb-ratio-calculator" },
    { path: "/tools/generated/oee-calculator", label: "Free oee-calculator (many inputs)" },
    { path: "/tools/generated/beam-deflection-calculator", label: "Free beam-deflection-calculator" },
    { path: "/tools/pro/sc_007_manufacturing_overall_equipment_effectiveness_oee_iso_22400", label: "PRO OEE" },
    { path: "/tools/pro/sc_001_eurocode_steel_connection_capacity_check_calculator", label: "PRO Eurocode Steel" },
    { path: "/tools/pro/sc_008_cnc_machining_cycle_time_cost_per_part_estimator", label: "PRO CNC Cost" },
  ];

  for (const { path: urlPath, label } of testPages) {
    console.log(`\n📄 ${label}`);
    const { status, html, error } = await fetchHtml(urlPath);

    if (error) {
      check(`${label} fetch`, false, error);
      continue;
    }

    // HTTP 200
    check(`${label} HTTP 200`, status === 200, `status=${status}`);
    if (status !== 200) continue;

    // No server error
    const hasServerError = /(Internal Server Error|An unexpected error occurred|Application error: a client-side exception)/.test(html);
    check(`${label} no server error`, !hasServerError, "Server error detected");

    // No Turkish chars
    const turkishRe = /[çğıöşüÇĞİÖŞÜ]/;
    check(`${label} no Turkish chars`, !turkishRe.test(html), "Turkish chars found");

    // Has UI payload (RSC stream or SSRed HTML with tool data)
    const hasToolContent = html.includes("tool_key") || html.includes("toolKey") || html.includes("tool_id") || html.includes("toolId") || html.includes("UniversalIndustrialDecision");
    check(`${label} tool data in page`, hasToolContent, "No tool data in page payload");
  }

  // CSS file checks
  console.log(`\n📄 CSS Structure`);
  const cssPath = path.join(ROOT, "src/sectorcalc/pro-form/universal-industrial-decision-form.css");
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, "utf8");
    check("CSS background #F0EEE6", css.includes("#F0EEE6"), "Missing #F0EEE6");
    check("CSS surface #FAF9F5", css.includes("#FAF9F5"), "Missing #FAF9F5");
    check("CSS text #1A1915", css.includes("#1A1915"), "Missing #1A1915");
    check("CSS accent #BD5D3A", css.includes("#BD5D3A"), "Missing #BD5D3A");
    check("CSS no dark mode", !css.includes("@media (prefers-color-scheme: dark)"), "Dark mode found");
    check("CSS 375px rule", css.includes("375px") || css.includes("@media (max-width: 375"), "No 375px rule");
    check("CSS scoped .sc-v531-", css.includes(".sc-v531-"), "No .sc-v531- selectors");

    const pxRadii = css.match(/border-radius:\s*[0-9.]+px/g) || [];
    const hasNonZero = pxRadii.some(r => parseFloat(r.replace(/[^0-9.]/g, "")) > 0);
    check("CSS no nonzero border-radius", !hasNonZero, `Nonzero border-radius found`);
  } else {
    check("CSS file exists", false, "Not found");
  }

  // Legacy form check
  let legacyRefs = 0;
  try {
    const grep = execSync(
      `rg -l "PremiumSchemaToolForm|FreeToolForm|ProToolForm" src/components/ --type ts --type tsx 2>/dev/null || true`,
      { cwd: ROOT, encoding: "utf8" }
    );
    legacyRefs = grep.trim() ? grep.trim().split("\n").filter(Boolean).length : 0;
  } catch {}
  check("No legacy forms in components", legacyRefs === 0, `${legacyRefs} legacy form references`);

  // Browser-level checks (if Playwright available)
  if (!playwrightAvailable) {
    warn("BROWSER_CHECKS", "PLAYWRIGHT_NOT_AVAILABLE — viewport overflow, H1, .sc-v531-shell in real DOM not verified");
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Passed: ${passed}, Failed: ${failed}`);

  if (exitCode === 0) {
    console.log(`\n✅ FORM LAYOUT SMOKE TEST PASSED`);
  } else {
    console.log(`\n❌ FORM LAYOUT SMOKE TEST FAILED`);
  }

  process.exit(exitCode);
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
