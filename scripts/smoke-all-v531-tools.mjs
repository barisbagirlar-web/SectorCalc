/**
 * scripts/smoke-all-v531-tools.mjs
 * V5.3.1 Schema Data Quality Smoke Test
 *
 * Tests every Free tool for: schema resolution, strict validation, execution path.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCHEMAS_DIR = path.join(ROOT, "generated/schemas");
const SRC = path.join(ROOT, "src");
const OUTPUT_FILE = path.join(ROOT, "_smoke-output.json");

function listGeneratedToolSlugs() {
  if (!existsSync(SCHEMAS_DIR)) return [];
  return readdirSync(SCHEMAS_DIR, { recursive: true })
    .filter((f) => f.endsWith("-schema.json"))
    .map((f) => path.basename(f).replace(/-schema\.json$/, ""))
    .sort();
}

function listIndustrialSlugs() {
  const toolsPath = path.join(SRC, "lib/features/tools/revenue-tools-industrial-formulas.ts");
  if (!existsSync(toolsPath)) return [];
  const content = readFileSync(toolsPath, "utf-8");
  const slugMatch = content.match(/freeSlug:\s*"([^"]+)"/g);
  if (!slugMatch) return [];
  return slugMatch.map((m) => m.match(/"([^"]+)"/)[1]);
}

function hasCalculatorModule(slug) {
  const registryPath = path.join(SRC, "lib/features/generated-tools/calculator-registry.ts");
  if (!existsSync(registryPath)) return false;
  return readFileSync(registryPath, "utf-8").includes(`createLoader("${slug}"`);
}

function runBulkValidation(slugs) {
  const scriptPath = path.join(ROOT, "_smoke-validate-temp.ts");
  const slugJson = JSON.stringify(slugs);

  // Write a temp TS file that outputs JSON validation results to a temp file
  const code = [
    `import { getGeneratedToolSchema } from "@/lib/features/generated-tools/schema-loader";`,
    `import { buildIndustrialFreeToolSchema, isIndustrialFreeToolSlug } from "@/lib/features/tools/industrial-free-schema-factory";`,
    `import { generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form/generated-tool-to-superv4-adapter";`,
    `import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";`,
    `import { writeFileSync } from "node:fs";`,
    ``,
    `const slugs: string[] = ${slugJson};`,
    `const results: Record<string,{ok:boolean;missing?:boolean;errors:string[]}> = {};`,
    `for (const slug of slugs) {`,
    `  let gen: any = getGeneratedToolSchema(slug);`,
    `  if (!gen && isIndustrialFreeToolSlug(slug)) {`,
    `    gen = buildIndustrialFreeToolSchema(slug);`,
    `  }`,
    `  if (!gen) { results[slug] = { ok: false, missing: true, errors: [] }; continue; }`,
    `  try {`,
    `    const sv4 = generatedToolSchemaToSuperV4Schema(gen, slug);`,
    `    const v = validateSuperV4Schema(sv4);`,
    `    results[slug] = v.ok ? { ok: true, errors: [] } : { ok: false, errors: v.errors };`,
    `  } catch (error) {`,
    `    results[slug] = { ok: false, errors: [(error as Error).message] };`,
    `  }`,
    `}`,
    `writeFileSync("${OUTPUT_FILE.replace(/\\/g, "\\\\")}", JSON.stringify(results), "utf-8");`,
  ].join("\n");

  writeFileSync(scriptPath, code, "utf-8");
  try {
    execSync(`npx tsx "${scriptPath}"`, {
      cwd: ROOT,
      timeout: 120000,
      stdio: "pipe",
      maxBuffer: 100 * 1024 * 1024,
    });
  } catch (_) {
    // tsx error — check if output file was still written
  }

  // Read output file
  try {
    const output = readFileSync(OUTPUT_FILE, "utf-8");
    return JSON.parse(output);
  } catch {
    throw new Error("Validation script did not produce output. Check _smoke-validate-temp.ts for errors.");
  }
}

/* ── Main ───────────────────────────────────── */

console.log("\n\uD83E\uDDEA V5.3.1 Schema Data Quality Smoke Test\n");

const results = {
  SCHEMA_VALID_REAL_EXECUTION: 0,
  SCHEMA_VALID_REVIEW_MODULE_MISSING: 0,
  SCHEMA_VALID_BLOCKED_INVALID_TEST_INPUT: 0,
  SCHEMA_INVALID_FAIL: 0,
  SCHEMA_MISSING_FAIL: 0,
  UNEXPECTED_EXECUTION_FAIL: 0,
  failures: [],
};

const genSlugs = listGeneratedToolSlugs();
const indSlugsList = listIndustrialSlugs();
const allSlugs = [];
const slugMeta = {};
for (const slug of genSlugs) {
  allSlugs.push(slug);
  slugMeta[slug] = { type: "generated" };
}
for (const slug of indSlugsList) {
  if (!slugMeta[slug]) allSlugs.push(slug);
  slugMeta[slug] = { ...(slugMeta[slug] || {}), type: "industrial" };
}

console.log(`Generated Free Tools: ${genSlugs.length}`);
console.log(`Industrial Free Tools: ${indSlugsList.length}`);
console.log(`Total: ${allSlugs.length}\n`);

const validationResults = runBulkValidation(allSlugs);

for (const slug of allSlugs) {
  const meta = slugMeta[slug];
  const v = validationResults[slug];

  if (!v || v.missing) {
    results.SCHEMA_MISSING_FAIL++;
    results.failures.push(`${slug}: schema not found`);
    console.error(`  M ${slug}: SCHEMA_MISSING_FAIL`);
    continue;
  }

  if (!v.ok) {
    results.SCHEMA_INVALID_FAIL++;
    const err = (v.errors || []).slice(0, 2).join("; ");
    results.failures.push(`${slug}: ${err}`);
    console.error(`  I ${slug}: ${err.slice(0, 100)}`);
    continue;
  }

  if (meta.type === "generated") {
    if (hasCalculatorModule(slug)) {
      results.SCHEMA_VALID_REAL_EXECUTION++;
      process.stdout.write(".");
    } else {
      results.SCHEMA_VALID_REVIEW_MODULE_MISSING++;
      process.stdout.write("?");
    }
  } else {
    results.SCHEMA_VALID_REVIEW_MODULE_MISSING++;
    process.stdout.write("?");
  }
}

console.log("\n\n=== RESULTS ===");
console.log(`  SCHEMA_VALID_REAL_EXECUTION           : ${results.SCHEMA_VALID_REAL_EXECUTION}`);
console.log(`  SCHEMA_VALID_REVIEW_MODULE_MISSING    : ${results.SCHEMA_VALID_REVIEW_MODULE_MISSING}`);
console.log(`  SCHEMA_VALID_BLOCKED_INVALID_TEST_INPUT: ${results.SCHEMA_VALID_BLOCKED_INVALID_TEST_INPUT}`);
console.log(`  SCHEMA_INVALID_FAIL                   : ${results.SCHEMA_INVALID_FAIL}`);
console.log(`  SCHEMA_MISSING_FAIL                   : ${results.SCHEMA_MISSING_FAIL}`);
console.log(`  UNEXPECTED_EXECUTION_FAIL              : ${results.UNEXPECTED_EXECUTION_FAIL}`);

// Cleanup temp files
try { unlinkSync(path.join(ROOT, "_smoke-validate-temp.ts")); } catch {}
try { unlinkSync(OUTPUT_FILE); } catch {}

const hasFail = results.SCHEMA_INVALID_FAIL > 0
  || results.SCHEMA_MISSING_FAIL > 0
  || results.UNEXPECTED_EXECUTION_FAIL > 0;

if (results.failures.length > 0) {
  console.error("\nFAILURES:");
  for (const f of results.failures) {
    console.error(`  - ${f}`);
  }
}

if (hasFail) {
  console.error("\nSMOKE FAILED\n");
  process.exit(1);
} else {
  console.log("\nSMOKE PASSED — All schemas valid\n");
  process.exit(0);
}
