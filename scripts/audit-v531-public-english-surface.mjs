/**
 * scripts/audit-v531-public-english-surface.mjs
 * Scans public schema surfaces for Turkish tokens.
 *
 * Classifies findings:
 *   PUBLIC_SURFACE_VIOLATION       — Turkish in display fields (name, label, help text, etc.)
 *   PRIVATE_INTERNAL_IDENTIFIER_ONLY — Turkish in internal IDs only (not user-visible)
 *   FALSE_POSITIVE_TECHNICAL_ENGLISH — English term that looks Turkish
 *
 * Exit 1 if any PUBLIC_SURFACE_VIOLATION exists.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SCHEMAS_DIR = path.join(ROOT, "generated/schemas");
const SRC = path.join(ROOT, "src");
const OUTPUT_FILE = path.join(ROOT, "_english-audit-output.json");

// Turkish words that are NEVER valid English (always violations when in public surface)
const TURKISH_ONLY = new Set([
  "cost", "duration", "süre", "weight", "ağırlık", "ratio",
  "count", "unit", "area", "volume", "pressure", "basınç", "temperature", "sıcaklık",
  "efficiency", "capacity", "labor", "işçilik", "material", "length", "width",
  "genişlik", "height", "yükseklik", "derinlik", "yaricap", "yarıçap",
  "kesit", "speed", "hız", "acceleration", "duration", "süre", "start", "başlangıç",
  "finish", "bitiş", "output", "çıktı", "input", "result", "sonuç", "average",
  "standard", "deviation", "coefficient", "katsayı", "value", "değer", "tutar", "hisse",
  "tahvil", "payment", "ödeme", "quantity", "total", "price", "resistance", "direnç",
  "stress", "akim", "akım", "taksit", "interest", "kazanc", "loss", "gelir",
  "expense", "dönem", "period", "rent", "inventory", "teslimat", "quality", "customer",
  "müşteri", "supplier", "supplyçi", "running", "calışan", "production", "üduction",
  "yay", "rulman", "yatak", "kasnak", "kayis", "kayış", "zincir", "bant",
  "silindir", "valf", "pompa", "kompresor", "motor", "pervane",
  "kanat", "diyafram", "debimetre", "slope", "eğim", "egme", "bukulme",
  "bükülme", "burkulma", "burulma", "column", "beam", "kiriş", "doseme",
  "döşeme", "temel", "wall", "perde", "catı", "roof", "çatı", "kubbe",
  "kemer", "donati", "donatı", "concrete", "steel", "çelik", "wood", "ahşap",
  "vites", "disli", "dişli", "mill", "mil", "torna", "freze", "talaş", "tala",
  "part", "parça", "product", "ürün", "manufacturing", "resource",
  "randiman", "randıman", "hizmet", "sales", "satış", "siparis", "sipariş",
  "budget", "bütçe", "investment", "yatırım", "finance", "kredi", "borc", "borç",
  "alacak", "kondansator", "kondansatör", "sarj", "şarj", "batarya",
  "pil", "bobin", "anapara", "prim", "indirim", "tax", "project", "plan",
  "cizelge", "çizelge", "takvim", "mevcut", "guncel", "güncel", "calculate",
  "user", "useıcı", "bilgi", "veri", "report", "record", "kayıt",
  "status", "level", "tip", "type", "tür", "feature", "özellik", "nitelik",
  "dik", "yatay", "dikey", "kare", "kose", "köşe", "kenar", "katman",
  "tabaka", "levha", "plaka", "eksen", "dilim", "kosegen", "köşegen",
  "dikdortgen", "dikdörtgen", "ucgen", "üçgen", "daire", "cokgen", "çokgen",
  "cozunurluk", "çözünürlük", "ort", "annual", "yıllık", "aylik", "aylık",
  "daily", "günluk", "günlük", "haftalik", "haftalık", "saatlik",
  "sarfiyat", "wind", "ruzgâr", "rüzgar", "rüzgâr", "trough", "katsayisi",
  "kutupsal", "atalet", "period", "dönem", "anapara", "start", "başlangıç",
  "finish", "bitiş", "year", "yıl", "refVoltaj", "bitSayisi",
  "uzama", "sehim", "ceyrek", "çeyrek", "threshold", "eşik", "doyum", "akma",
  "kopma", "dayanim", "dayanım", "mukavemet", "solution",
  "anasayfa", "sayfa", "icerik", "içerik", "nakit", "saatlik", "loss",
]);

// English words that look Turkish but are valid English technical terms
const FALSE_POSITIVE_TECHNICAL_ENGLISH = new Set([
  "test", "plan", "plan", "data", "tip",
  "cap", "waste", "motor", "cnc", "piston",
]);

// Public surface field paths to scan
const PUBLIC_FIELDS = [
  // Top-level
  (s) => s.tool_name,
  (s) => s.category,
  (s) => s.scope,
  // Decision context
  (s) => s.decision_context?.engineering_discipline,
  (s) => s.decision_context?.domain,
  // Standards
  (s) => s.standards?.map((st) => `${st.name || ""} ${st.description || ""}`).join(" "),
  // Input display fields
  ...Array.from({ length: 50 }, (_, i) => (s) => {
    const inp = s.inputs?.[i];
    if (!inp) return null;
    return [
      inp.name, inp.symbol, inp.help_text,
      ...(inp.reference_values || []).map((rv) => rv.label || ""),
      inp.ui_binding?.description,
    ].filter(Boolean).join(" ");
  }),
  // Output display fields
  ...Array.from({ length: 20 }, (_, i) => (s) => {
    const out = s.outputs?.[i];
    if (!out) return null;
    return [out.name, out.public_explanation].filter(Boolean).join(" ");
  }),
  // UI contract text
  (s) => s.ui_contract?.input_groups?.map((g) => [g.title, g.description].filter(Boolean).join(" ")).join(" "),
  // Metadata visible fields
  (s) => s.metadata?.generator,
  // Calculation basis
  (s) => s.calculation_basis?.method,
  (s) => s.calculation_basis?.assumptions?.join(" "),
  (s) => s.calculation_basis?.limitations?.join(" "),
  // Proof pack
  (s) => s.proof_pack?.sections?.map((sec) => sec.title || "").join(" "),
  // Audit seal
  (s) => s.audit_trail_contract?.seal_config?.notes,
  // Brand safety
  // (no text fields)
];

// Extract all words from a string, split on camelCase and snake_case
function tokenize(text) {
  if (!text) return [];
  // Split camelCase, snake_case, and whitespace
  const words = text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return [...new Set(words)];
}

function runAudit() {
  // Load all schemas via tsx — use the existing list/resolve functions
  const scriptPath = path.join(ROOT, "_english-audit-temp.ts");
  const code = [
    `import { getGeneratedToolSchema, listGeneratedToolSchemaSlugs } from "@/lib/features/generated-tools/schema-loader";`,
    `import { buildIndustrialFreeToolSchema, isIndustrialFreeToolSlug } from "@/lib/features/tools/industrial-free-schema-factory";`,
    `import { industrialFormulaTools } from "@/lib/features/tools/revenue-tools-industrial-formulas";`,
    `import { generatedToolSchemaToSuperV4Schema } from "@/sectorcalc/pro-form/generated-tool-to-superv4-adapter";`,
    `import { writeFileSync } from "node:fs";`,
    ``,
    `const genSlugs = listGeneratedToolSchemaSlugs();`,
    `const indSlugs = industrialFormulaTools.map((t: any) => t.freeSlug).filter(Boolean);`,
    `const allSlugs = [...new Set([...genSlugs, ...indSlugs])];`,
    ``,
    `const results: Record<string, any> = {};`,
    `for (const slug of allSlugs) {`,
    `  let genSchema = getGeneratedToolSchema(slug);`,
    `  if (!genSchema && isIndustrialFreeToolSlug(slug)) {`,
    `    genSchema = buildIndustrialFreeToolSchema(slug);`,
    `  }`,
    `  if (!genSchema) { results[slug] = { error: "not found" }; continue; }`,
    `  const sv4 = generatedToolSchemaToSuperV4Schema(genSchema, slug);`,
    `  results[slug] = { schema: JSON.parse(JSON.stringify(sv4)) };`,
    `}`,
    `writeFileSync("${OUTPUT_FILE.replace(/\\/g, "\\\\")}", JSON.stringify(results), "utf-8");`,
  ].join("\n");

  writeFileSync(scriptPath, code, "utf-8");
  try {
    execSync(`npx tsx "${scriptPath}"`, { cwd: ROOT, timeout: 120000, stdio: "pipe", maxBuffer: 100 * 1024 * 1024 });
  } catch (_) {}

  const raw = readFileSync(OUTPUT_FILE, "utf-8");
  const schemas = JSON.parse(raw);

  // Cleanup
  try { unlinkSync(scriptPath); } catch {}
  try { unlinkSync(OUTPUT_FILE); } catch {}

  // Audit each schema
  let publicViolations = 0;
  let privateInternal = 0;
  let falsePositivesCount = 0;
  const violationDetails = [];
  const privateDetails = [];

  for (const [slug, entry] of Object.entries(schemas)) {
    if (entry.error) continue;
    const sv4 = entry.schema;

    // Scan public surface fields
    const publicStrings = [];
    for (const extractor of PUBLIC_FIELDS) {
      try {
        const val = extractor(sv4);
        if (val) publicStrings.push(val);
      } catch {}
    }

    // Check public strings
    const seenInPublic = new Set();
    for (const str of publicStrings) {
      const tokens = tokenize(str);
      for (const token of tokens) {
        if (FALSE_POSITIVE_TECHNICAL_ENGLISH.has(token)) {
          falsePositivesCount++;
          continue;
        }
        if (TURKISH_ONLY.has(token) && !seenInPublic.has(token)) {
          seenInPublic.add(token);
          publicViolations++;
          violationDetails.push(`${slug}: public "${token}" in display text`);
        }
      }
    }

    // Scan all IDs for Turkish (private identifiers)
    const allIds = new Set();
    for (const inp of sv4.inputs || []) {
      allIds.add(inp.id);
    }
    for (const ni of sv4.normalized_inputs || []) {
      allIds.add(ni.id);
      allIds.add(ni.from_input);
    }
    for (const out of sv4.outputs || []) {
      allIds.add(out.id);
    }
    for (const f of sv4.formulas || []) {
      allIds.add(f.id);
    }
    const seenInIds = new Set();
    for (const id of allIds) {
      const tokens = tokenize(id);
      for (const token of tokens) {
        if (TURKISH_ONLY.has(token) && !seenInIds.has(token) && !seenInPublic.has(token)) {
          seenInIds.add(token);
          privateInternal++;
          privateDetails.push(`${slug}: id "${id}" contains Turkish "${token}"`);
        }
      }
    }
  }

  return { publicViolations, privateInternal, falsePositivesCount, violationDetails, privateDetails };
}

const result = runAudit();

console.log("\n=== V5.3.1 PUBLIC ENGLISH SURFACE AUDIT ===\n");
console.log(`public_surface_violations=${result.publicViolations}`);
console.log(`private_internal_identifier_only=${result.privateInternal}`);
console.log(`false_positive_technical_english=${result.falsePositivesCount}`);

if (result.violationDetails.length > 0) {
  console.log("\nPublic surface violations:");
  for (const d of result.violationDetails.slice(0, 20)) {
    console.log(`  ${d}`);
  }
}

if (result.privateDetails.length > 0) {
  console.log(`\nPrivate internal identifiers with Turkish tokens (sample):`);
  for (const d of result.privateDetails.slice(0, 10)) {
    console.log(`  ${d}`);
  }
}

if (result.publicViolations > 0) {
  console.error(`\nPUBLIC_ENGLISH_SURFACE_AUDIT=FAIL\n`);
  process.exit(1);
} else {
  console.log(`\nPUBLIC_ENGLISH_SURFACE_AUDIT=PASS\n`);
  process.exit(0);
}
