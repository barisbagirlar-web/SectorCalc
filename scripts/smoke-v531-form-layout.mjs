#!/usr/bin/env node
/**
 * scripts/smoke-v531-form-layout.mjs
 *
 * Visual form structure QA for V5.3.1 UniversalIndustrialDecisionForm.
 * Verifies HTML/CSS structure on representative pages.
 *
 * Usage: BASE_URL=http://localhost:3000 node scripts/smoke-v531-form-layout.mjs
 */

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

async function fetchHtml(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
    const html = await res.text();
    return { status: res.status, html };
  } catch (e) {
    return { status: 0, html: "", error: e.message };
  }
}

async function verifyFormStructure(path, label, options = {}) {
  console.log(`\n📄 ${label} (${BASE_URL}${path})`);
  const { status, html, error } = await fetchHtml(path);

  if (error) {
    check(`${label} fetch`, false, error);
    return;
  }

  check(`${label} HTTP 200`, status === 200, `Status: ${status}`);
  if (status !== 200) return;

  // .sc-v531-shell must exist
  check(`${label} .sc-v531-shell`, html.includes('class="sc-v531-shell"') || html.includes("sc-v531-shell"), "Missing .sc-v531-shell");

  // UniversalIndustrialDecisionForm rendered (check for form class or key marker)
  check(`${label} UniversalIndustrialDecisionForm`, html.includes("sc-v531-") && (html.includes('role="form"') || html.includes("universal-industrial-decision-form") || html.includes('aria-label')), "Form render check");

  // H1 present
  check(`${label} H1 present`, /<h1[^>]*>/i.test(html), "No H1 found");

  // No legacy form class
  const legacyForms = ["PremiumSchemaToolForm", "FreeToolForm", "ProToolForm", "legacy-form", "premium-schema-tool-form"];
  for (const legacy of legacyForms) {
    if (html.includes(legacy)) {
      check(`${label} no ${legacy}`, false, `Contains legacy form class: ${legacy}`);
    }
  }

  // Input groups (check for input-related CSS classes)
  const hasInputGroups = html.includes("pro-inp-group") || html.includes("sc-v531-input-group") || html.includes('type="number"') || html.includes('type="text"');
  check(`${label} input groups`, hasInputGroups, "No input groups found");

  // Input labels
  const hasLabels = html.includes("<label") || /aria-label\s*=/i.test(html);
  check(`${label} input labels`, hasLabels, "No input labels found");

  // Result panel placeholder
  const hasResultPanel = html.includes("result") || html.includes("Result") || html.includes("sc-v531-result");
  check(`${label} result panel`, hasResultPanel, "No result panel found");

  // Action area / calculate button
  const hasActionArea = html.includes("Calculate") || html.includes("calculate") || html.includes("button") && (html.includes("submit") || html.includes("Calculate"));
  check(`${label} action area`, hasActionArea, "No calculate button/action area found");

  // Layout integrity checks
  const turkishRe = /[çğıöşüÇĞİÖŞÜ]/;
  const hasTurkish = turkishRe.test(html);
  check(`${label} no Turkish chars`, !hasTurkish, "Turkish characters found");

  // No horizontal overflow marker (CSS containment)
  check(`${label} no overflow-x: hidden globally`, !html.includes('overflow-x: hidden'), "Global overflow-x: hidden found (bad)");
}

async function main() {
  console.log(`\n🧪 V5.3.1 FORM LAYOUT SMOKE TEST (BASE_URL=${BASE_URL})\n`);
  console.log("PLAYWRIGHT_NOT_AVAILABLE (static HTML/CSS checks only)");

  // 1. Free tool - pb-ratio-calculator
  await verifyFormStructure("/tools/generated/pb-ratio-calculator", "Free pb-ratio-calculator");

  // 2. Free tool with many inputs - oee-calculator
  await verifyFormStructure("/tools/generated/oee-calculator", "Free oee-calculator (many inputs)");

  // 3. Free engineering calculator - beam-deflection-calculator
  await verifyFormStructure("/tools/generated/beam-deflection-calculator", "Free beam-deflection-calculator (engineering)");

  // 4. PRO calculator with many inputs
  await verifyFormStructure("/tools/pro/sc_007_manufacturing_overall_equipment_effectiveness_oee_iso_22400", "PRO OEE (many inputs)");

  // 5. PRO engineering calculator
  await verifyFormStructure("/tools/pro/sc_001_eurocode_steel_connection_capacity_check_calculator", "PRO Eurocode Steel (engineering)");

  // 6. PRO finance/cost calculator  
  await verifyFormStructure("/tools/pro/sc_008_cnc_machining_cycle_time_cost_per_part_estimator", "PRO CNC Cost (finance/cost)");

  // CSS structure checks
  // We can't check CSS files via HTTP fetch easily, so do filesystem checks
  const fs = await import("node:fs");
  const path = await import("node:path");
  const ROOT = path.resolve(import.meta.dirname, "..");

  // Check form CSS file
  const cssPath = path.join(ROOT, "src/sectorcalc/pro-form/universal-industrial-decision-form.css");
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, "utf8");
    
    // Colors
    check("CSS background #F0EEE6", css.includes("#F0EEE6"), "Missing background color");
    check("CSS surface #FAF9F5", css.includes("#FAF9F5"), "Missing surface color");
    check("CSS text #1A1915", css.includes("#1A1915"), "Missing text color");
    check("CSS accent #BD5D3A", css.includes("#BD5D3A"), "Missing accent color");

    // No dark mode override
    check("CSS no dark mode", !css.includes("@media (prefers-color-scheme: dark)"), "Dark mode override found");

    // 375px mobile rule
    check("CSS 375px media query", css.includes("375") || css.includes("375px"), "No 375px mobile rule");

    // No rounded cards in V5.3.1 form CSS
    // Allow only border-radius if it's 0
    const nonZeroRadius = css.match(/border-radius:\s*[1-9]/g);
    check("CSS no nonzero border-radius", !nonZeroRadius, `Nonzero border-radius found: ${nonZeroRadius?.[0] || "none"}`);
  } else {
    check("Form CSS file", false, "File not found");
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (exitCode === 0) {
    console.log(`\n✅ FORM LAYOUT SMOKE TEST PASSED`);
  } else {
    console.log(`\n❌ FORM LAYOUT SMOKE TEST FAILED`);
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
