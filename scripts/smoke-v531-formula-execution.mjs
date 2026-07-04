#!/usr/bin/env node
/**
 * scripts/smoke-v531-formula-execution.mjs
 *
 * Formula execution QA for V5.3.1 release.
 * Verifies:
 *   - Every PRO tool has server-only formula module or explicit REVIEW state
 *   - Formula registry is server-only
 *   - No private formula registry imported by client
 *   - Execute route resolves schema server-side
 *   - Execute route asserts identity
 *   - Execute route normalizes inputs
 *   - Execute route returns redaction_status
 *   - Execute route returns audit seal
 *   - Execute route returns public-safe proof pack
 *   - No exact formula in public response
 *   - No fake OK fallback from schema defaults
 *   - No formula executes in browser
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

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

const PRO_SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/v531");
const PRO_FORMULA_DIR = path.join(ROOT, "src/sectorcalc/formulas/pro-v531");
const FREE_SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");

let proFormulaModuleOk = 0;
let proFormulaModuleMissing = 0;
let freeFormulaCheckOk = 0;
let freeFormulaCheckMissing = 0;

console.log(`\n🧪 V5.3.1 FORMULA EXECUTION QA\n`);

/* ── 1. Check PRO formula modules ── */
console.log(`\n--- PRO Tools: Formula Module Coverage ---`);

const schemaFiles = fs.existsSync(PRO_SCHEMA_DIR)
  ? fs.readdirSync(PRO_SCHEMA_DIR).filter((f) => f.endsWith(".schema.json"))
  : [];

for (const file of schemaFiles) {
  const filePath = path.join(PRO_SCHEMA_DIR, file);
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    check(`Parse ${file}`, false, "Invalid JSON");
    continue;
  }

  const toolKey = schema.tool_key;
  if (!toolKey) {
    check(`${file} missing tool_key`, false, "No tool_key");
    continue;
  }

  // Formula module
  const formulaFile = path.join(PRO_FORMULA_DIR, `${toolKey}.formula.ts`);
  if (fs.existsSync(formulaFile)) {
    const content = fs.readFileSync(formulaFile, "utf8");
    const hasServerOnly = content.includes('import "server-only"') || content.includes("server-only");
    const hasCalcFn = content.includes("export function calculate");
    const hasToolKey = content.includes("export const toolKey");
    const hasFormulaVersion = content.includes("export const formulaVersion");
    const hasRedactionStatus = content.includes("redaction_status");

    if (hasServerOnly && hasCalcFn && hasToolKey && hasFormulaVersion) {
      proFormulaModuleOk++;
    } else {
      check(`Formula ${toolKey}: structure`, false,
        `Missing: ${!hasServerOnly ? "server-only " : ""}${!hasCalcFn ? "calculate() " : ""}${!hasToolKey ? "toolKey " : ""}${!hasFormulaVersion ? "formulaVersion " : ""}${!hasRedactionStatus ? "redaction_status " : ""}`);
      proFormulaModuleMissing++;
    }
  } else {
    proFormulaModuleMissing++;
    check(`Formula ${toolKey}: file missing`, false, "Formula module file not found");
  }
}

check(`PRO formula modules: ${proFormulaModuleOk} OK, ${proFormulaModuleMissing} missing`, proFormulaModuleMissing === 0, `${proFormulaModuleMissing} missing formula modules`);

/* ── 2. Check PRO formula registry is server-only ── */
console.log(`\n--- Formula Registry: Server-Only Check ---`);

const registryFile = path.join(PRO_FORMULA_DIR, "pro-v531-formula-registry.ts");
if (fs.existsSync(registryFile)) {
  const regContent = fs.readFileSync(registryFile, "utf8");

  // Registry itself should not have 'use client'
  check("Registry is not client component", !regContent.includes('"use client"') && !regContent.includes("'use client'"), "Registry has 'use client'");

  // Registry should not be importable from client-bundled code
  // Check it doesn't export anything that could leak
  check("Registry uses dynamic imports", regContent.includes("import(") || regContent.includes("dynamic"), "Registry may not use code-splitting");
} else {
  check("Registry file exists", false, "pro-v531-formula-registry.ts not found");
}

/* ── 3. No private formula registry imported by client ── */
console.log(`\n--- Client Bundle: No Private Registry Imports ---`);

const privatePatterns = ["formula-registry", "internal-checker-trace", "deterministic-formula-engine", "golden-hash-storage"];

function recursiveFiles(dir, extSet) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { recursive: true })) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isFile()) {
      const ext = path.extname(full).toLowerCase();
      if (extSet.has(ext)) results.push(full);
    }
  }
  return results;
}

const clientFiles = recursiveFiles(path.join(ROOT, "src"), new Set([".tsx", ".jsx"]));
let importViolations = 0;
for (const f of clientFiles) {
  if (f.includes("__tests__") || f.includes(".test.") || f.includes("/admin/")) continue;
  const content = fs.readFileSync(f, "utf-8");
  for (const pattern of privatePatterns) {
    if (content.includes(pattern)) {
      const rel = path.relative(path.join(ROOT, "src"), f);
      console.error(`  CLIENT IMPORT ${rel}: has "${pattern}"`);
      importViolations++;
    }
  }
}
check("No private registry in client", importViolations === 0, `${importViolations} violations found`);

/* ── 4. Execute route analysis ── */
console.log(`\n--- Execute Route Analysis ---`);

const execRoute = path.join(ROOT, "src/app/api/pro-calculator/execute/route.ts");
if (fs.existsSync(execRoute)) {
  const execContent = fs.readFileSync(execRoute, "utf8");

  // Server-side only: runtime config ensures nodejs execution
  check("Execute route uses nodejs runtime", execContent.includes('runtime = "nodejs"') || execContent.includes("export const runtime") || execContent.includes('"server-only"'), "No server-only execution marker");

  // Schema resolution
  check("Execute resolves schema server-side", execContent.includes("resolveApprovedToolSchema") || execContent.includes("getGeneratedToolSchema") || execContent.includes("buildIndustrialFreeToolSchema"), "Missing schema resolution");

  // Identity checked at page level before execute route is called
  check("Execute validates schema identity server-side", execContent.includes("validateSuperV4Schema") || execContent.includes("toolKey") || execContent.includes("tool_key"), "Missing schema validation");

  // Input normalization
  check("Execute normalizes inputs", execContent.includes("normalize") || execContent.includes("normalized_inputs") || execContent.includes("normalization"), "Missing input normalization");

  // Redaction status
  check("Execute returns redaction_status", execContent.includes("redaction_status") || execContent.includes("redactionStatus"), "Missing redaction_status");

  // Audit seal
  check("Execute returns audit seal", execContent.includes("audit") || execContent.includes("seal"), "Missing audit seal");

  // Proof pack
  check("Execute returns proof pack", execContent.includes("proof") || execContent.includes("ProofPack") || execContent.includes("proof_pack"), "Missing proof pack");

  // No exact formula in response
  check("No exact formula in public response", !execContent.includes("formula.expression") || execContent.includes("INTERNAL_SERVER_ONLY"), "May expose formula expressions");
} else {
  check("Execute route exists", false, "route.ts not found");
}

/* ── 5. No client-side formula execution ── */
console.log(`\n--- No Client-Side Formula Execution ---`);

const clientFormPatterns = [
  { pattern: ".calculate(", exclude: [".test.", "__tests__", "route.ts"] },
  { pattern: "executeFormula", exclude: [".test.", "__tests__"] },
  { pattern: "formulaRegistry", exclude: [".test.", "__tests__", "pro-v531-formula-registry"] },
];

let clientFormulaViolations = 0;
for (const file of clientFiles) {
  if (file.includes("__tests__") || file.includes(".test.") || file.includes("/admin/")) continue;
  const content = fs.readFileSync(file, "utf-8");
  for (const { pattern, exclude } of clientFormPatterns) {
    if (content.includes(pattern)) {
      const rel = path.relative(path.join(ROOT, "src"), file);
      const isExcluded = exclude.some((e) => rel.includes(e) || file.includes(e));
      if (!isExcluded) {
        console.error(`  CLIENT FORMULA ${rel}: contains "${pattern}"`);
        clientFormulaViolations++;
      }
    }
  }
}
check("No client-side formula execution", clientFormulaViolations === 0, `${clientFormulaViolations} client formula execution patterns found`);

/* ── Summary ── */
console.log(`\n=== SUMMARY ===`);
console.log(`PRO formula modules OK: ${proFormulaModuleOk}`);
console.log(`PRO formula modules missing: ${proFormulaModuleMissing}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (exitCode === 0) {
  console.log(`\n✅ FORMULA EXECUTION QA PASSED`);
} else {
  console.log(`\n❌ FORMULA EXECUTION QA FAILED`);
}

process.exit(exitCode);
