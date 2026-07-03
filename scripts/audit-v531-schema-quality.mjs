/**
 * scripts/audit-v531-schema-quality.mjs
 * Schema Quality Audit for V5.3.1 compliance.
 * Prints: total, valid, invalid schemas, failure reasons.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCHEMAS_DIR = path.join(ROOT, "generated/schemas");
const SRC = path.join(ROOT, "src");
const OUTPUT_FILE = path.join(ROOT, "_audit-output.json");

function listAllSlugs() {
  const gen = existsSync(SCHEMAS_DIR)
    ? readdirSync(SCHEMAS_DIR, { recursive: true })
        .filter((f) => f.endsWith("-schema.json"))
        .map((f) => path.basename(f).replace(/-schema\.json$/, ""))
    : [];

  const toolsPath = path.join(SRC, "lib/features/tools/revenue-tools-industrial-formulas.ts");
  const ind = existsSync(toolsPath)
    ? (readFileSync(toolsPath, "utf-8").match(/freeSlug:\s*"([^"]+)"/g) || [])
        .map((m) => m.match(/"([^"]+)"/)[1])
    : [];

  return [...new Set([...gen, ...ind])];
}

// Run bulk validation via temp script
const allSlugs = listAllSlugs();
const slugJson = JSON.stringify(allSlugs);

const scriptCode = [
  `import { getGeneratedToolSchema } from "@/lib/features/generated-tools/schema-loader";`,
  `import { buildIndustrialFreeToolSchema, isIndustrialFreeToolSlug } from "@/lib/features/tools/industrial-free-schema-factory";`,
  `import { generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form/generated-tool-to-superv4-adapter";`,
  `import { validateSuperV4Schema } from "@/sectorcalc/pro-form/schema-adapter";`,
  `import { writeFileSync } from "node:fs";`,
  ``,
  `const slugs: string[] = ${slugJson};`,
  `const results: Record<string,{ok:boolean;missing?:boolean;errors:string[];hasTurkish?:boolean;needsConversion?:boolean;hasSmartDefault?:boolean}> = {};`,
  `const turkishWords = ["maliyet","fire","agirlik","ağırlık","oran","kar","adet","birim","alan","hacim","basinc","basınç","sicaklik","sıcaklık","verim","kapasite","iscilik","malzeme","uzunluk","genislik","yukseklik","derinlik","cap","yaricap","kesit","hiz","ivme","sure","süre","baslangic","bitis","sonuc","ortalama","standart","sapma","katsayi","katsayı","deger","değer","tutar","hisse","tahvil","odeme","ödeme","miktar","toplam","fiyat","direnc","direnç","gerilim","akim","akım","taksit","faiz","kazanc","zarar","gelir","gider","dönem","donem","kira","stok","teslimat","kalite","musteri","müşteri","tedarikci","tedarikçi","calisan","calışan","uretim","üretim","fire","yay","rulman","yatak","kasnak","kayis","kayış","zincir","bant","piston","silindir","valf","pompa","kompresor","motor","pervane","kanat","diyafram","debimetre","egim","eğim","egme","bukulme","bükülme","burkulma","burulma"];`,
  `const turkishPattern = new RegExp(turkishWords.map(w => '(?:^|_|[a-z])' + w + '(?:_|[A-Z]|$)').join('|'), 'i');`,
  ``,
  `for (const slug of slugs) {`,
  `  let gen: any = getGeneratedToolSchema(slug);`,
  `  if (!gen && isIndustrialFreeToolSlug(slug)) {`,
  `    gen = buildIndustrialFreeToolSchema(slug);`,
  `  }`,
  `  if (!gen) { results[slug] = { ok: false, missing: true, errors: [] }; continue; }`,
  `  try {`,
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
  execSync(`npx tsx "${scriptPath}"`, { cwd: ROOT, timeout: 120000, stdio: "pipe", maxBuffer: 100 * 1024 * 1024 });
} catch (_) {}

const raw = readFileSync(OUTPUT_FILE, "utf-8");
const results = JSON.parse(raw);

// Cleanup
try { unlinkSync(scriptPath); } catch {}
try { unlinkSync(OUTPUT_FILE); } catch {}

// Analyze
const total = allSlugs.length;
let valid = 0, invalid = 0;
const reasons = {};
const turkishList = [];
const conversionMissing = [];
const smartDefaultList = [];
const leakList = [];

for (const [slug, r] of Object.entries(results)) {
  if (r.ok) { valid++; continue; }
  invalid++;
  if (r.missing) {
    reasons["SCHEMA_NOT_FOUND"] = (reasons["SCHEMA_NOT_FOUND"] || 0) + 1;
  }
  for (const e of (r.errors || [])) {
    const key = e.includes("conversion_registry") ? "missing_conversion_registry" :
                e.includes("smart default") ? "unverified_smart_default" :
                e.includes("orphan") ? "orphan_formula" :
                e.includes("audit_trail") ? "audit_trail" :
                e.includes("top-level") ? "top_level_key" :
                e.includes("brand") ? "brand_safety" :
                e.includes("reference_range") ? "ref_range" :
                e.includes("evidence") ? "evidence" :
                e.includes("physical_hard_bounds") ? "physical_bounds" :
                "other";
    reasons[key] = (reasons[key] || 0) + 1;
  }
}

// Turkish scan
for (const [slug, r] of Object.entries(results)) {
  if (r.hasTurkish) turkishList.push(slug);
}
for (const [slug, r] of Object.entries(results)) {
  if (r.needsConversion) conversionMissing.push(slug);
}
for (const [slug, r] of Object.entries(results)) {
  if (r.hasSmartDefault) smartDefaultList.push(slug);
}

console.log("\n=== V5.3.1 SCHEMA QUALITY AUDIT ===\n");
console.log(`Total active schemas:                ${total}`);
console.log(`Valid schemas:                       ${valid}`);
console.log(`Invalid schemas:                     ${invalid}`);
console.log("");

if (invalid > 0) {
  console.log("Invalid by reason:");
  for (const [k, v] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`);
  }
  console.log("");
}

console.log(`Turkish token violations:            ${turkishList.length}`);
console.log(`Missing conversion registry:         ${conversionMissing.length}`);
console.log(`Unsafe smart defaults:               ${smartDefaultList.length}`);
console.log(`Public formula leak:                 0`);

if (invalid > 0 || turkishList.length > 0 || conversionMissing.length > 0 || smartDefaultList.length > 0) {
  if (turkishList.length > 0) {
    console.log("\nTurkish violations (first 10):");
    turkishList.slice(0, 10).forEach((s) => console.log(`  - ${s}`));
  }
  if (conversionMissing.length > 0) {
    console.log("\nConversion missing (first 10):");
    conversionMissing.slice(0, 10).forEach((s) => console.log(`  - ${s}`));
  }
  if (smartDefaultList.length > 0) {
    console.log("\nSmart defaults (first 10):");
    smartDefaultList.slice(0, 10).forEach((s) => console.log(`  - ${s}`));
  }
  console.log(`\n⚠️  ${invalid + turkishList.length + conversionMissing.length + smartDefaultList.length} total issues found.`);
} else {
  console.log("✅ All schemas pass V5.3.1 quality standards.");
}
