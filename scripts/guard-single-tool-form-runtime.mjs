// SectorCalc Single Tool Form Runtime Guard
// Fails if any public calculator route bypasses UniversalIndustrialDecisionForm

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "src");

function walkDir(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "node_modules" || entry === ".next" || entry === "__tests__") continue;
        files.push(...walkDir(full));
      } else if (full.endsWith(".ts") || full.endsWith(".tsx")) {
        files.push(full);
      }
    }
  } catch { /* skip */ }
  return files;
}

function run() {
  let ec = 0;
  const violations = [];

  // Check all [slug] calculator routes use UniversalIndustrialDecisionForm
  const slugCalculatorRoutes = [
    "app/tools/generated/[slug]/page.tsx",
    "app/tools/pro/[slug]/page.tsx",
    "app/tools/premium-schema/[slug]/page.tsx",
    "app/tools/premium/[slug]/page.tsx",
    "app/embed/[slug]/page.tsx",
  ];

  for (const route of slugCalculatorRoutes) {
    const fullPath = join(SRC, route);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, "utf-8");
    if (!content.includes("UniversalIndustrialDecisionForm")) {
      violations.push(`BYPASSES_FORM:src/${route} does not use UniversalIndustrialDecisionForm`);
    }
  }

  // Check pro-form files don't import formula engine directly
  const proFormFiles = [];
  const proFormDir = join(SRC, "sectorcalc/pro-form");
  try {
    for (const entry of readdirSync(proFormDir)) {
      const full = join(proFormDir, entry);
      if (statSync(full).isFile() && (full.endsWith(".ts") || full.endsWith(".tsx"))) {
        proFormFiles.push(full);
      }
    }
  } catch { /* skip */ }

  for (const file of proFormFiles) {
    if (file.includes("__tests__") || file.includes(".test.")) continue;
    const content = readFileSync(file, "utf-8");
    const rel = file.replace(SRC, "");
    // Check client-side files don't import from pro-runtime (which contains formula engine)
    if (content.includes('"use client"') || content.includes("'use client'")) {
      if (content.includes("pro-runtime") && !content.includes("types") && !content.includes("types.ts")) {
        violations.push(`CLIENT_IMPORTS_RUNTIME:${rel} client component imports from pro-runtime`);
      }
    }
  }

  if (violations.length) {
    console.error("SINGLE TOOL FORM RUNTIME GUARD FAILED");
    for (const v of violations) console.error(`  ${v}`);
    ec = 1;
  } else {
    console.log(`SINGLE TOOL FORM RUNTIME GUARD PASSED (${slugCalculatorRoutes.length} routes)`);
  }
  process.exit(ec);
}

run();
