/**
 * scripts/audit-v531-schema-quality.mjs
 * Schema Quality Audit for V5.3.1 compliance on active schemas.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCHEMAS_DIR = path.join(ROOT, "src/sectorcalc/schemas/v531");
const OUTPUT_FILE = path.join(ROOT, "_audit-output.json");

function listAllSchemaFiles() {
  if (!existsSync(SCHEMAS_DIR)) return [];
  return readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith(".schema.json") || f.endsWith(".json"))
    .map((f) => path.join(SCHEMAS_DIR, f));
}

const schemaFiles = listAllSchemaFiles();
const schemaFilesJson = JSON.stringify(schemaFiles);

const scriptCode = [
  `import { generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form/generated-tool-to-superv4-adapter";`,
  `import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";`,
  `import { readFileSync, writeFileSync } from "node:fs";`,
  `import path from "node:path";`,
  ``,
  `const files: string[] = ${schemaFilesJson};`,
  `const results: Record<string,{ok:boolean;missing?:boolean;errors:string[];hasTurkish?:boolean;needsConversion?:boolean;hasSmartDefault?:boolean}> = {};`,
  `const turkishWords = ["muhendis", "insaat", "maliyet", "sicaklik", "tasarim", "yükseklik", "uzunluk", "genişlik", "derinlik", "yaricap", "katsayi", "kullanici", "hesapla", "guncel", "dikdortgen", "ucgen", "cokgen", "doseme", "kompresor", "burkulma", "burulma", "bukulme", "tedarik", "uretici", "giris", "cikti"];`,
  `const turkishPattern = new RegExp(turkishWords.join("|"), "i");`,
  ``,
  `for (const file of files) {`,
  `  const slug = path.basename(file).replace(/\\.(schema\\.)?json$/, "");`,
  `  try {`,
  `    const raw = readFileSync(file, "utf8");`,
  `    const gen = JSON.parse(raw);`,
  `    const sv4 = generatedToolSchemaToSuperV4Schema(gen, slug);`,
  `    const sv4Str = JSON.stringify(sv4);`,
  `    const hasTurkish = turkishPattern.test(sv4Str);`,
  `    `,
  `    // Check for unit_selectable inputs with conversion issues`,
  `    const needsConversion = sv4.inputs.some((i: any) => i.unit_selectable && i.allowed_display_units?.length > 0 && !sv4.unit_conversion_contract?.conversion_registry?.[i.quantity_kind]);`,
  `    `,
  `    // Check for unwanted smart defaults`,
  `    const hasSmartDefault = sv4.inputs.some((i: any) => i.default_policy !== "NO_DEFAULT" && i.default !== null && i.default !== undefined);`,
  `    `,
  `    const v = validateSuperV4Schema(sv4);`,
  `    results[slug] = {`,
  `      ok: v.ok,`,
  `      errors: v.ok ? [] : v.errors,`,
  `      hasTurkish,`,
  `      needsConversion,`,
  `      hasSmartDefault,`,
  `    };`,
  `  } catch (error) {`,
  `    results[slug] = { ok: false, errors: [(error as Error).message], missing: false };`,
  `  }`,
  `}`,
  `writeFileSync("${OUTPUT_FILE.replace(/\\/g, "\\\\")}", JSON.stringify(results), "utf-8");`,
].join("\n");

const scriptPath = path.join(ROOT, "_audit-temp.ts");
writeFileSync(scriptPath, scriptCode, "utf-8");

console.log("Running schema quality audit...");
try {
  execSync(`node_modules/.bin/tsx "${scriptPath}"`, { cwd: ROOT, timeout: 120000, stdio: "pipe", maxBuffer: 100 * 1024 * 1024 });
} catch (error) {
  console.error("Execution failed:", error.message);
}

const raw = readFileSync(OUTPUT_FILE, "utf-8");
const results = JSON.parse(raw);

// Cleanup
try { unlinkSync(scriptPath); } catch {}
try { unlinkSync(OUTPUT_FILE); } catch {}

// Analyze
const total = schemaFiles.length;
let valid = 0, invalid = 0;
const reasons = {};
let turkishCount = 0;
let conversionCount = 0;
let smartDefaultCount = 0;
const turkishViolators = [];

for (const slug of Object.keys(results)) {
  const r = results[slug];
  if (r.ok && !r.hasTurkish && !r.needsConversion && !r.hasSmartDefault) {
    valid++;
  } else {
    invalid++;
    console.error(`❌ INVALID SCHEMA: ${slug}`, r.errors);
    if (r.hasTurkish) {
      turkishCount++;
      turkishViolators.push(slug);
    }
    if (r.needsConversion) conversionCount++;
    if (r.hasSmartDefault) smartDefaultCount++;
    
    for (const err of r.errors) {
      const category = err.includes("required") ? "missing-fields" : "other";
      reasons[category] = (reasons[category] || 0) + 1;
    }
  }
}

console.log("\n=== V5.3.1 SCHEMA QUALITY AUDIT ===");
console.log(`Total active schemas:                ${total}`);
console.log(`Valid schemas:                       ${valid}`);
console.log(`Invalid schemas:                     ${invalid}`);

console.log("\nInvalid by reason:");
console.log(JSON.stringify(reasons, null, 2));

console.log(`\nTurkish token violations:            ${turkishCount}`);
console.log(`Missing conversion registry:         ${conversionCount}`);
console.log(`Unsafe smart defaults:               ${smartDefaultCount}`);

if (turkishViolators.length > 0) {
  console.log("\nTurkish violations (first 10):");
  for (const v of turkishViolators.slice(0, 10)) {
    console.log(`  - ${v}`);
  }
}

const totalIssues = turkishCount + conversionCount + smartDefaultCount + Object.values(reasons).reduce((a, b) => a + b, 0);
console.log(`\n⚠️  ${totalIssues} total issues found.`);

if (totalIssues > 0 || invalid > 0) {
  process.exit(1);
} else {
  console.log("\n✅ ALL ACTIVE SCHEMAS COMPLY WITH V5.3.1 QUALITY AUDIT STANDARDS!");
  process.exit(0);
}
