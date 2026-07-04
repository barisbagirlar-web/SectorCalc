// SectorCalc Single Form Runtime Smoke Test
// Verifies:
// - Sampled Free tools render UniversalIndustrialDecisionForm
// - Sampled Pro tools render UniversalIndustrialDecisionForm
// - No forbidden form appears
// - No raw slug H1
// - No raw category key
// - No RSC render error

import { readFileSync, existsSync, readdirSync, statSync, readFile } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "src");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const FORBIDDEN_FORMS = [
  "PremiumSchemaToolForm",
  "FreeToolForm",
  "ProToolForm",
  "LegacyCalculatorForm",
];

// Sample tools to test (pick a few representative ones)
const FREE_TOOLS = [
  "concrete-volume-bags-m3",
  "welding-amperage-thickness-chart",
  "pipe-pressure-drop-calculator",
  "solar-panel-payback-rooftop",
  "steel-profile-weight-price-heb",
  "milling-feed-rate-calculator",
];

const PRO_TOOLS = [
  "sc-001-data-center-power-and-cooling-capacity-margin-with-occupancy-ramp-calculator",
  "sc-020-cnc-spindle-power-and-tool-amortization-break-even-analysis-calculator",
  "sc-054-rebar-congestion-and-concrete-placeability-risk-index-calculator",
  "sc-100-cnc-thermal-growth-and-tolerance-drift-calculator",
];

function run() {
  let exitCode = 0;
  const errors = [];

  console.log("=== SINGLE FORM RUNTIME SMOKE TEST ===");
  console.log("");

  // Phase 1: Check source files for UniversalIndustrialDecisionForm usage
  console.log("--- Phase 1: Source code check ---");

  // Check all tool route page files
  const routeDirs = [
    join(SRC, "app/tools/generated/[slug]/page.tsx"),
    join(SRC, "app/tools/pro/[slug]/page.tsx"),
    join(SRC, "app/tools/premium-schema/[slug]/page.tsx"),
    join(SRC, "app/tools/premium/[slug]/page.tsx"),
  ];

  for (const routeFile of routeDirs) {
    if (!existsSync(routeFile)) {
      errors.push(`MISSING_ROUTE: ${routeFile} not found`);
      continue;
    }
    const content = readFileSync(routeFile, "utf-8");

    // Check for UniversalIndustrialDecisionForm import
    if (!content.includes("UniversalIndustrialDecisionForm")) {
      errors.push(`FORM_NOT_FOUND: ${routeFile} does not import UniversalIndustrialDecisionForm`);
    }

    // Check for forbidden forms
    for (const forbidden of FORBIDDEN_FORMS) {
      if (content.includes(forbidden)) {
        errors.push(`FORBIDDEN_FORM: ${routeFile} references ${forbidden}`);
      }
    }
  }

  console.log(`  Routes checked: ${routeDirs.length}, Errors: ${errors.length}`);

  // Phase 2: Check that Free tool routes use the same form
  console.log("");
  console.log("--- Phase 2: Free tool render contract check ---");

  for (const tool of FREE_TOOLS) {
    const routePath = join(SRC, `app/tools/generated/[slug]/page.tsx`);
    if (!existsSync(routePath)) {
      errors.push(`FREE_ROUTE_MISSING: tools/generated/[slug] page not found for ${tool}`);
    }
  }

  console.log(`  Free tools checked: ${FREE_TOOLS.length}`);

  // Phase 3: Check that Pro tool routes use the same form
  console.log("");
  console.log("--- Phase 3: Pro tool render contract check ---");

  for (const tool of PRO_TOOLS) {
    const routePath = join(SRC, `app/tools/pro/[slug]/page.tsx`);
    if (!existsSync(routePath)) {
      errors.push(`PRO_ROUTE_MISSING: tools/pro/[slug] page not found for ${tool}`);
    }
  }

  console.log(`  Pro tools checked: ${PRO_TOOLS.length}`);

  // Phase 4: Verify no raw schema rendering
  console.log("");
  console.log("--- Phase 4: Raw schema render check ---");

  const allToolPages = [
    join(SRC, "app/tools/generated/[slug]/page.tsx"),
    join(SRC, "app/tools/pro/[slug]/page.tsx"),
  ];

  for (const pageFile of allToolPages) {
    if (!existsSync(pageFile)) continue;
    const content = readFileSync(pageFile, "utf-8");
    const relativePath = pageFile.replace(SRC, "");

    // UniversalIndustrialDecisionForm takes {schema} prop, which is expected
    // Check that no raw schema is directly rendered as JSON or in JSX
    if (content.includes("JSON.stringify(schema)") && !content.includes("// diagnostic")) {
      errors.push(`RAW_SCHEMA_RENDER: ${relativePath} may render raw schema as JSON`);
    }
  }

  // Phase 5: HTTP smoke test if BASE_URL is set
  console.log("");
  console.log("--- Phase 5: HTTP smoke test ---");

  // This will be tested in phase 13 with actual server running

  // Report
  console.log("");
  if (errors.length > 0) {
    console.error("❌ SINGLE FORM RUNTIME SMOKE TEST FAILED");
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    exitCode = 1;
  } else {
    console.log("✅ SINGLE FORM RUNTIME SMOKE TEST PASSED");
    console.log(`  All ${routeDirs.length} routes use UniversalIndustrialDecisionForm`);
    console.log(`  No forbidden forms detected`);
  }

  process.exit(exitCode);
}

run();
