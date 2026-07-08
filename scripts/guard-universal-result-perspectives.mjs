// SectorCalc V5.4 — Universal Result Perspectives Build-Time Guard
// Verifies the adapter layer is properly structured:
// 1. All active tool categories are covered by RESULT_PROFILE_BY_CATEGORY.
// 2. The adapter module exports all required functions.
// 3. Adapter is importable without errors.

import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const ADAPTER_PATH = join(ROOT, "src/sectorcalc/result-perspectives/universal-result-adapter.ts");
const MANIFEST_PATH = join(ROOT, "src/sectorcalc/free-tools/free-tools-manifest.ts");
const SCHEMAS_DIR = join(ROOT, "src/sectorcalc/schemas/free-v531");

// Expected adapter exports
const REQUIRED_EXPORTS = [
  "RESULT_PROFILE_BY_CATEGORY",
  "buildUniversalResult",
  "hasCommercialPrice",
  "hasValidDecisionState",
  "getProfileForCategory",
];

// Expected result profile IDs (from the ResultProfileId type)
const EXPECTED_PROFILES = [
  "cost_plus_margin",
  "technical_limit_with_cost",
  "pass_fail_with_safety_margin",
  "savings_roi",
  "cost_capacity_efficiency",
  "commercial_decision",
  "risk_quality_decision",
  "compliance_audit_package",
];

function doesExportExist(source, exportName) {
  // Check for: export const exportName, export function exportName, or export { ... exportName }
  const patterns = [
    new RegExp(`export\\s+(const|function|type|interface)\\s+${exportName}\\b`),
    new RegExp(`export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}`),
  ];
  return patterns.some((re) => re.test(source));
}

function extractExportedMap(source) {
  // Extract keys from RESULT_PROFILE_BY_CATEGORY = { "Key": "value", ... }
  const match = source.match(/RESULT_PROFILE_BY_CATEGORY:\s*Record<string,\s*ResultProfileId>\s*=\s*\{([^}]+)\}/);
  if (!match) return null;
  const body = match[1];
  const keys = [];
  const kvRegex = /"([^"]+)"\s*:\s*"([^"]+)"/g;
  let kvMatch;
  while ((kvMatch = kvRegex.exec(body)) !== null) {
    keys.push({ category: kvMatch[1], profile: kvMatch[2] });
  }
  return keys;
}

// Load manifest categories
function loadManifestCategories() {
  const text = readFileSync(MANIFEST_PATH, "utf8");
  const cats = new Set();
  const regex = /category:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    cats.add(match[1]);
  }
  return [...cats];
}

function loadActiveSlugs() {
  const text = readFileSync(MANIFEST_PATH, "utf8");
  const slugs = [];
  const regex = /slug:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

function loadSchema(slug) {
  if (!existsSync(SCHEMAS_DIR)) return null;
  const files = readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith(".json"));
  const matchFile = files.find((f) => f.includes(slug));
  if (!matchFile) return null;
  try {
    return JSON.parse(readFileSync(join(SCHEMAS_DIR, matchFile), "utf8"));
  } catch {
    return null;
  }
}

// ── Run ──

const errors = [];
const warnings = [];

// 1. Adapter file exists
if (!existsSync(ADAPTER_PATH)) {
  errors.push("Adapter file not found at " + ADAPTER_PATH);
} else {
  const source = readFileSync(ADAPTER_PATH, "utf8");

  // 2. Required exports exist
  for (const exp of REQUIRED_EXPORTS) {
    if (!doesExportExist(source, exp)) {
      errors.push(`Adapter missing required export: ${exp}`);
    }
  }

  // 3. Category map contains all expected profiles
  const mapEntries = extractExportedMap(source);
  if (mapEntries) {
    const mappedProfiles = new Set(mapEntries.map((e) => e.profile));
    for (const expected of EXPECTED_PROFILES) {
      if (!mappedProfiles.has(expected)) {
        warnings.push(`Category map does not reference profile "${expected}" — may be unused.`);
      }
    }
  } else {
    errors.push("Could not extract RESULT_PROFILE_BY_CATEGORY entries from adapter.");
  }

  // 4. Check profile handler functions exist
  const PROFILE_HANDLERS = [
    "enrichCostPlusMargin",
    "enrichCommercialDecision",
    "enrichPassFailWithSafetyMargin",
  ];
  for (const handler of PROFILE_HANDLERS) {
    // These may be module-private (not exported), so search more broadly
    const handlerRe = new RegExp(`function\\s+${handler}\\b`);
    if (!handlerRe.test(source)) {
      errors.push(`Adapter missing profile handler: ${handler}`);
    }
  }
}

// 5. Manifest categories coverage
const manifestCats = loadManifestCategories();
const manifestSlugs = loadActiveSlugs();
console.log(`Universal Result Perspectives Guard
  Adapter: ${existsSync(ADAPTER_PATH) ? "OK" : "MISSING"}
  Active tools: ${manifestSlugs.length}
  Manifest categories: ${manifestCats.length}
`);

// Check categories not covered by the adapter map
if (existsSync(ADAPTER_PATH)) {
  const source = readFileSync(ADAPTER_PATH, "utf8");
  const mapEntries = extractExportedMap(source);
  if (mapEntries) {
    const coveredCats = new Set(mapEntries.map((e) => e.category));
    const uncovered = manifestCats.filter((c) => !coveredCats.has(c));
    if (uncovered.length > 0) {
      warnings.push(
        `Manifest categories not in adapter map: ${uncovered.join(", ")} — will use default "commercial_decision".`
      );
    }
    console.log(`Covered categories: ${coveredCats.size}/${manifestCats.length}`);
    if (uncovered.length > 0) {
      console.log(`Uncovered (using default): ${uncovered.join(", ")}`);
    }
  }
}

// 6. Check schemas exist for all slugs
let schemaOk = 0;
let schemaMissing = 0;
for (const slug of manifestSlugs) {
  const schema = loadSchema(slug);
  if (schema) {
    schemaOk++;
  } else {
    schemaMissing++;
  }
}
console.log(`Schemas found: ${schemaOk}/${manifestSlugs.length}`);
if (schemaMissing > 0) {
  warnings.push(`${schemaMissing} tool(s) without schema files.`);
}

console.log("");

if (errors.length > 0) {
  console.error(`FAILED: ${errors.length} structural error(s):\n`);
  for (const err of errors) {
    console.error(`  ${err}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const w of warnings) {
    console.log(`  ${w}`);
  }
}

console.log("PASS — all adapter structure checks OK.");
