#!/usr/bin/env tsx
/**
 * CI/CD Lean-UX Invariant Gate (RM-LEAN-001)
 * ==========================================
 *
 * Verifies Lean domain after consolidation to 5 canonical metric hubs + /lean hub:
 * 1. Lexicon terms appear across lean + hub sources
 * 2. UX markers (structured-inputs, immediate-result, next-action) exist
 * 3. Schema / LEI markers present
 * 4. Five calculator hubs exist; legacy spoke page removed
 * 5. Registry retains matrix for redirect verification
 *
 * Exit code: 0 = PASS, 1 = BLOCKED
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const LEAN_PAGES_ROOT = path.join(ROOT, "src/app/lean");
const CALC_HUB_ROOT = path.join(ROOT, "src/app/calculators");

const LEAN_COMPONENT_FILES = [
  path.join(ROOT, "src/components/calculators/lean/LeanMetricCalculatorPanel.tsx"),
  path.join(ROOT, "src/components/calculators/lean/LeanMetricHubContent.tsx"),
  path.join(ROOT, "src/components/calculators/lean/LeanMetricSsrChrome.tsx"),
  path.join(ROOT, "src/components/calculators/NextActionPDCA.tsx"),
  path.join(ROOT, "src/lib/features/tools/lean-metric-hubs.ts"),
  path.join(ROOT, "src/lib/infrastructure/seo/lean-schema.ts"),
];

const REQUIRED_HUB_SLUGS = [
  "takt-time",
  "oee",
  "scrap-rate",
  "cycle-time",
  "capacity-utilization",
] as const;

const REQUIRED_LEXICON = ["PDCA", "Gemba", "Lean", "Operational"];

const REQUIRED_UX_MARKERS = [
  'data-testid="structured-inputs"',
  'data-testid="immediate-result"',
  'id="next-action"',
];

const REQUIRED_SCHEMA_MARKERS = ["SoftwareApplication", "lean.org", "Clear Next Action", "DefinedTerm"];

const REQUIRED_SECTIONS = [
  "Quick Decision Summary",
  "Calculation Methodology",
  "Behavior Intelligence",
  "Scenario Library",
  "Cite This Calculator",
  "References and Standards Context",
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
  console.log("Lean-UX Invariant Verification Gate (RM-LEAN-001)");
  console.log("=".repeat(60));

  const pageFiles = walkDir(LEAN_PAGES_ROOT);
  const hubFiles = REQUIRED_HUB_SLUGS.flatMap((slug) => walkDir(path.join(CALC_HUB_ROOT, slug)));
  const allFiles = [
    ...pageFiles,
    ...hubFiles,
    ...LEAN_COMPONENT_FILES.filter((f) => fs.existsSync(f)),
  ];
  console.log(`  Lean + hub source files: ${allFiles.length}`);

  let combinedText = "";
  for (const file of allFiles) {
    combinedText += fs.readFileSync(file, "utf8") + "\n";
  }

  const violations: Violation[] = [];

  for (const term of REQUIRED_LEXICON) {
    if (!combinedText.includes(term)) {
      violations.push({ reason: `Missing Lean lexicon term: "${term}"` });
    }
  }

  for (const marker of REQUIRED_UX_MARKERS) {
    if (!combinedText.includes(marker)) {
      violations.push({ reason: `Missing UX invariant marker: "${marker}"` });
    }
  }

  for (const marker of REQUIRED_SCHEMA_MARKERS) {
    if (!combinedText.includes(marker)) {
      violations.push({ reason: `Missing schema marker: "${marker}"` });
    }
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!combinedText.includes(section)) {
      violations.push({ reason: `Missing hub section marker: "${section}"` });
    }
  }

  for (const slug of REQUIRED_HUB_SLUGS) {
    const pagePath = path.join(CALC_HUB_ROOT, slug, "page.tsx");
    if (!fs.existsSync(pagePath)) {
      violations.push({ reason: `Missing canonical hub page: src/app/calculators/${slug}/page.tsx` });
    }
  }

  const legacySpoke = path.join(ROOT, "src/app/lean/[concept]/[metric]/page.tsx");
  if (fs.existsSync(legacySpoke)) {
    violations.push({
      reason: "Legacy spoke page still present — must be removed after 301 consolidation",
    });
  }

  if (combinedText.includes("ISO/IEC 17025") || combinedText.includes("ISO/IEC 17025")) {
    violations.push({ reason: "ISO/IEC 17025 forced footer still present in Lean sources" });
  }

  const registryPath = path.join(ROOT, "src/lib/features/tools/lean-calc-registry.ts");
  if (fs.existsSync(registryPath)) {
    const registryText = fs.readFileSync(registryPath, "utf8");
    if (!registryText.includes("buildMatrix") || !registryText.includes("LEAN_CALC_MATRIX")) {
      violations.push({ reason: "Lean registry missing matrix generation (needed for redirect SSOT)" });
    }
    if (!registryText.includes("canonicalPath")) {
      violations.push({ reason: "Lean registry missing canonicalPath mapping" });
    }
  } else {
    violations.push({ reason: "Missing lean-calc-registry.ts" });
  }

  const hubsPath = path.join(ROOT, "src/lib/features/tools/lean-metric-hubs.ts");
  if (!fs.existsSync(hubsPath)) {
    violations.push({ reason: "Missing lean-metric-hubs.ts SSOT" });
  }

  const middlewarePath = path.join(ROOT, "src/middleware.ts");
  const middlewareText = fs.readFileSync(middlewarePath, "utf8");
  if (!middlewareText.includes("RM-LEAN-001") || !middlewareText.includes("/calculators/${metric}")) {
    violations.push({ reason: "Missing lean spoke 301 redirect block in middleware.ts" });
  }
  for (const slug of REQUIRED_HUB_SLUGS) {
    if (!middlewareText.includes(slug)) {
      violations.push({ reason: `Missing metric slug in middleware lean redirect matcher: ${slug}` });
    }
  }

  const firebaseText = fs.readFileSync(path.join(ROOT, "firebase.json"), "utf8");
  for (const slug of REQUIRED_HUB_SLUGS) {
    if (!firebaseText.includes(`/lean/*/${slug}`)) {
      violations.push({ reason: `Missing Firebase Hosting 301 for /lean/*/${slug}` });
    }
  }

  if (violations.length > 0) {
    console.error(`\n[BLOCKED] Lean-UX invariants violated (${violations.length} issues):\n`);
    for (const v of violations) {
      console.error(`  - ${v.reason}`);
    }
    process.exit(1);
  }

  console.log("\n[PASS] Lean-UX invariants satisfied (RM-LEAN-001 consolidation).");
  process.exit(0);
}

main();
