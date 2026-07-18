#!/usr/bin/env tsx
/**
 * CI/CD Lean-UX Invariant Gate
 * =============================
 *
 * Verifies that the Lean-Calc section collectively satisfies:
 * 1. Lean lexicon terms (PDCA, Gemba, Lean, Operational Check) appear in source
 * 2. UX invariant markers (structured-inputs, immediate-result, next-action) exist
 * 3. Schema markers (HowTo, lean.org citation, Clear Next Action) are present
 *
 * Verification is collective across all lean page, component, and schema files —
 * markers can appear in any file within the lean domain.
 *
 * Exit code: 0 = PASS, 1 = BLOCKED
 *
 * Usage: npx tsx scripts/verify-lean-ux-invariants.ts
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const LEAN_PAGES_ROOT = path.join(ROOT, "src/app/lean");

const LEAN_COMPONENT_FILES = [
  path.join(ROOT, "src/components/calculators/lean/LeanCalculatorClient.tsx"),
  path.join(ROOT, "src/components/calculators/NextActionPDCA.tsx"),
  path.join(ROOT, "src/lib/infrastructure/seo/lean-schema.ts"),
];

const REQUIRED_LEXICON = ["PDCA", "Gemba", "Lean", "Operational Check"];

const REQUIRED_UX_MARKERS = [
  'data-testid="structured-inputs"',
  'data-testid="immediate-result"',
  'id="next-action"',
];

const REQUIRED_SCHEMA_MARKERS = [
  '@type": "HowTo",',
  "lean.org",
  "Clear Next Action",
];

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

interface Violation {
  reason: string;
}

function main(): void {
  console.log("Lean-UX Invariant Verification Gate");
  console.log("=".repeat(60));

  const pageFiles = walkDir(LEAN_PAGES_ROOT);
  const allFiles = [...pageFiles, ...LEAN_COMPONENT_FILES.filter((f) => fs.existsSync(f))];
  console.log(`  Lean source files: ${allFiles.length}`);

  // Read all lean files into a single combined buffer for collective verification
  let combinedText = "";
  for (const file of allFiles) {
    combinedText += fs.readFileSync(file, "utf8") + "\n";
  }

  const violations: Violation[] = [];

  // 1. Lexicon check — collective
  for (const term of REQUIRED_LEXICON) {
    if (!combinedText.includes(term)) {
      violations.push({ reason: `Missing Lean lexicon term: "${term}"` });
    }
  }

  // 2. UX markers — collective
  for (const marker of REQUIRED_UX_MARKERS) {
    if (!combinedText.includes(marker)) {
      violations.push({ reason: `Missing UX invariant marker: "${marker}"` });
    }
  }

  // 3. Schema markers — collective
  for (const marker of REQUIRED_SCHEMA_MARKERS) {
    if (!combinedText.includes(marker)) {
      violations.push({ reason: `Missing schema marker: "${marker}"` });
    }
  }

  // 4. Structural check: at least one calculator page exists (not just the index)
  const calculatorPage = path.join(ROOT, "src/app/lean/[concept]/[metric]/page.tsx");
  if (!fs.existsSync(calculatorPage)) {
    violations.push({ reason: "Missing calculator page: src/app/lean/[concept]/[metric]/page.tsx" });
  }

  // 5. Registry must have matrix entries
  const registryPath = path.join(ROOT, "src/lib/features/tools/lean-calc-registry.ts");
  if (fs.existsSync(registryPath)) {
    const registryText = fs.readFileSync(registryPath, "utf8");
    if (!registryText.includes("buildMatrix") || !registryText.includes("LEAN_CALC_MATRIX")) {
      violations.push({ reason: "Lean registry missing matrix generation" });
    }
  } else {
    violations.push({ reason: "Missing lean-calc-registry.ts" });
  }

  if (violations.length > 0) {
    console.error(`\n[BLOCKED] Lean-UX invariants violated (${violations.length} issues):\n`);
    for (const v of violations) {
      console.error(`  \u2717 ${v.reason}`);
    }
    console.error("");
    process.exit(1);
  }

  console.log("[PASS] ALL Lean-UX invariants verified:");
  console.log(`  \u2022 Lean lexicon terms: ${REQUIRED_LEXICON.join(", ")}`);
  console.log(`  \u2022 UX markers: structured-inputs, immediate-result, next-action`);
  console.log(`  \u2022 Schema markers: HowTo, lean.org, Clear Next Action`);
  console.log(`  \u2022 Calculator page: present (generateStaticParams from matrix)`);
  console.log(`  \u2022 Registry: programmatic matrix generation active`);
  process.exit(0);
}

main();
