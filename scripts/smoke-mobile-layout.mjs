#!/usr/bin/env node
/**
 * scripts/smoke-mobile-layout.mjs
 *
 * Site-wide mobile responsiveness smoke test.
 * Checks that mobile CSS rules exist, key selectors are present,
 * and critical pages return 200.
 *
 * Usage: node scripts/smoke-mobile-layout.mjs
 *        BASE_URL=http://localhost:3000 node scripts/smoke-mobile-layout.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.BASE_URL || "https://www.sectorcalc.com";

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

function readCssFile(relPath) {
  const abspath = path.resolve(ROOT, relPath);
  try {
    return fs.readFileSync(abspath, "utf-8");
  } catch {
    return "";
  }
}

async function main() {
  console.log(`\n📱 MOBILE LAYOUT SMOKE TEST (BASE_URL=${BASE_URL})\n`);

  // ── 1. Live URL checks ──
  console.log("\n── Live URL status ──\n");

  const URLS = [
    "/",
    "/free-tools",
    "/pro-tools",
    "/pricing",
    "/tools/generated/minimum-weld-throat-thickness-calculator",
    "/tools/pro/sc_001_data_center_power_and_cooling_capacity_margin_with_occupancy_ramp_calculator",
    "/tools/pro/sc_025_laser_cutting_nitrogen_consumption_and_kerf_dross_rework_cost_calculator",
  ];

  for (const urlPath of URLS) {
    const { status, error } = await fetchHtml(urlPath);
    check(`${urlPath} returns 200`, status === 200 || status === 304, error || `status=${status}`);
  }

  // ── 2. CSS source file checks ──
  console.log("\n── CSS source files ──\n");

  const globalsCss = readCssFile("src/app/globals.css");
  const formCss = readCssFile("src/sectorcalc/pro-form/universal-industrial-decision-form.css");
  const headerFile = readCssFile("src/components/layout/SiteHeader.tsx");

  // globals.css mobile foundation
  check(
    "globals.css has mobile foundation @media (max-width: 760px)",
    globalsCss.includes("@media (max-width: 760px)"),
    "Missing 760px media query in globals.css"
  );

  check(
    "globals.css has --sc-mobile-safe-bottom custom property",
    globalsCss.includes("--sc-mobile-safe-bottom"),
    "Missing safe-area token"
  );

  check(
    "globals.css has Trace AI mobile bottom offset",
    globalsCss.includes("bottom: calc(var(--sc-mobile-safe-bottom) + 78px)"),
    "Missing Trace AI mobile offset"
  );

  check(
    "globals.css has CTA bottom-fixed rule",
    globalsCss.includes("position: fixed !important;") && globalsCss.includes("bottom: calc(var(--sc-mobile-safe-bottom) + 14px)"),
    "Missing CTA bottom-fixed rule"
  );

  // form CSS mobile
  check(
    "form CSS has mobile 48px input height",
    formCss.includes("height: 48px !important"),
    "Missing 48px touch target in form CSS"
  );

  check(
    "form CSS has mobile single-column results grid",
    formCss.includes("grid-template-columns: 1fr !important"),
    "Missing 1fr results grid"
  );

  check(
    "form CSS has mobile action-bar fixed",
    formCss.includes("position: fixed !important") && formCss.includes("sc-v531-action-bar"),
    "Missing action bar fixed positioning"
  );

  // header mobile
  check(
    "SiteHeader has mobile auth hiding",
    headerFile.includes("auth-status__text") && headerFile.includes("display:none"),
    "Missing auth text hiding in header"
  );

  check(
    "SiteHeader has mobile drawer rules",
    headerFile.includes("max-height:calc(100dvh") && headerFile.includes("sc-drawer.open"),
    "Missing drawer mobile rules"
  );

  // ── 3. Footer compact rules ──
  console.log("\n── Footer mobile rules ──\n");

  const footerFile = readCssFile("src/components/layout/EnterpriseFooter.tsx");

  check(
    "Footer has mobile 760px rule",
    footerFile.includes("@media (max-width: 760px)"),
    "Missing 760px footer media query"
  );

  check(
    "Footer has CTA safe-area padding",
    footerFile.includes("safe-area-inset-bottom") || footerFile.includes("132px"),
    "Missing footer safe-area padding"
  );

  // ── 4. Summary ──
  console.log(`\n── Results ──\n`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`\n${exitCode === 0 ? "✅ ALL PASSED" : "❌ SOME FAILED"}`);

  process.exit(exitCode);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
