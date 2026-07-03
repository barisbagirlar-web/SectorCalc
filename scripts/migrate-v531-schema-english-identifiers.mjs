#!/usr/bin/env node
/**
 * scripts/migrate-v531-schema-english-identifiers.mjs
 * V5.3.1 Schema English Identifier Migration
 *
 * Migrates all generated and v531 package schemas to pure English:
 * 1. Removes all `tr` (Turkish) locale fields
 * 2. Renames Turkish input IDs to English canonical equivalents
 * 3. Updates all cross-references (formulas, outputs, normalized_inputs)
 * 4. Normalizes output breakdown/summary keys
 * 5. Reports all changes
 *
 * Safe to re-run. Idempotent after first pass.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Turkish-to-English identifier token map ────────────────────────────────
const TR_ID_MAP = {
  "maliyet": "cost",
  "fire": "scrap",
  "sure": "duration",
  "kapasite": "capacity",
  "verim": "efficiency",
  "oran": "ratio",
  "kar": "profit",
  "adet": "quantity",
  "birim": "unit",
  "alan": "area",
  "hacim": "volume",
  "basinc": "pressure",
  "sicaklik": "temperature",
  "uretim": "production",
  "iscilik": "labor",
  "stok": "stock",
  "alacak": "receivable",
  "borc": "debt",
  "agirlik": "weight",
  "uzunluk": "length",
  "genislik": "width",
  "yukseklik": "height",
  "derinlik": "depth",
  "cap": "diameter",
  "yaricap": "radius",
  "kesit": "section",
  "hiz": "speed",
  "ivme": "acceleration",
  "baslangic": "initial",
  "bitis": "final",
  "sonuc": "result",
  "ortalama": "average",
  "standart": "standard",
  "sapma": "deviation",
  "katsayi": "coefficient",
  "deger": "value",
  "tutar": "amount",
  "hisse": "share",
  "tahvil": "bond",
  "odeme": "payment",
  "miktar": "quantity",
  "toplam": "total",
  "fiyat": "price",
  "direnc": "resistance",
  "gerilim": "voltage",
  "akim": "current",
  "taksit": "installment",
  "faiz": "interest",
  "kazanc": "gain",
  "zarar": "loss",
  "gelir": "revenue",
  "gider": "expense",
  "donem": "period",
  "kira": "rent",
  "teslimat": "delivery",
  "kalite": "quality",
  "musteri": "customer",
  "tedarikci": "supplier",
  "calisan": "employee",
  "uretici": "producer",
  "yay": "spring",
  "rulman": "bearing",
  "yatak": "bearing",
  "kasnak": "pulley",
  "kayis": "belt",
  "zincir": "chain",
  "bant": "belt",
  "piston": "piston",
  "silindir": "cylinder",
  "valf": "valve",
  "pompa": "pump",
  "kompresor": "compressor",
  "motor": "motor",
  "pervane": "propeller",
  "kanat": "blade",
  "diyafram": "diaphragm",
  "debimetre": "flowmeter",
  "egim": "slope",
  "egme": "bending",
  "bukulme": "bending",
  "burkulma": "buckling",
  "burulma": "torsion",
  "sarfiyat": "consumption",
  "yillik": "annual",
  "aylik": "monthly",
  "haftalik": "weekly",
  "dip": "bottom",
  "ic": "inner",
  "dis": "outer",
  "giris": "input",
  "cikti": "output",
  "girdi": "input",
  "kullanici": "user",
  "hesapla": "calculate",
  "rapor": "report",
  "kayit": "record",
  "yeni": "new",
  "eski": "old",
  "mevcut": "current",
  "guncel": "current",
  "yil": "year",
  "gun": "day",
  "ay": "month",
  "hafta": "week",
  "saat": "hour",
  "dakika": "minute",
  "kat": "floor",
  "katman": "layer",
  "tabaka": "layer",
  "levha": "plate",
  "plaka": "plate",
  "eksen": "axis",
  "dilim": "segment",
  "kose": "corner",
  "kenar": "edge",
  "kare": "square",
  "dikdortgen": "rectangle",
  "ucgen": "triangle",
  "daire": "circle",
  "cokgen": "polygon",
  "dikey": "vertical",
  "kolon": "column",
  "kiris": "beam",
  "doseme": "slab",
  "temel": "foundation",
  "duvar": "wall",
  "perde": "curtain",
  "cati": "roof",
  "kubbe": "dome",
  "kemer": "arch",
  "merdiven": "staircase",
  "korkuluk": "railing",
  "donati": "reinforcement",
  "beton": "concrete",
  "celik": "steel",
  "ahsap": "timber",
  "kompozit": "composite",
  "yuk": "load",
  "kuvvet": "force",
  "basinc": "pressure",
  "sicaklik": "temperature",
  "debi": "flow",
  "guc": "power",
  "enerji": "energy",
  "moment": "moment",
  "tork": "torque",
  "frekans": "frequency",
  "titresim": "vibration",
  "surec": "process",
  "yatirim": "investment",
  "degerleme": "valuation",
  "yatırım": "investment",
  "değerleme": "valuation",
  "cevre": "environment",
  "çevre": "environment",
};

/**
 * Translate a camelCase Turkish identifier to English.
 * Example: "birimMaliyet" → "unitCost", "yillikNetGelir" → "annualNetRevenue"
 */
function translateIdentifier(id) {
  // Split by camelCase and underscore
  const parts = id.split(/(?<=[a-z])(?=[A-Z])|_/);
  const translated = parts.map((part) => {
    const lower = part.toLowerCase();
    // Normalize non-ASCII Turkish chars to ASCII
    const normalized = lower
      .replace(/[ç]/g, "c").replace(/[Ç]/g, "c")
      .replace(/[ğ]/g, "g").replace(/[Ğ]/g, "g")
      .replace(/[ı]/g, "i")
      .replace(/[ö]/g, "o").replace(/[Ö]/g, "o")
      .replace(/[ş]/g, "s").replace(/[Ş]/g, "s")
      .replace(/[ü]/g, "u").replace(/[Ü]/g, "u");

    const replacement = TR_ID_MAP[normalized] || TR_ID_MAP[lower];
    if (replacement) {
      // Preserve original casing
      if (part[0] === part[0]?.toUpperCase() && part.length > 1) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    }
    return part;
  });
  return translated.join("");
}

/**
 * Check if a string contains Turkish tokens that need translation
 */
function hasTurkishToken(str) {
  if (!str) return false;
  const lower = str.toLowerCase();
  const parts = lower.split(/(?<=[a-z])(?=[A-Z])|_/);
  for (const part of parts) {
    const normalized = part
      .replace(/[ç]/g, "c").replace(/[ğ]/g, "g")
      .replace(/[ı]/g, "i").replace(/[ö]/g, "o")
      .replace(/[ş]/g, "s").replace(/[ü]/g, "u");
    if (TR_ID_MAP[normalized]) return true;
  }
  return false;
}

/**
 * Remove all `tr` locale fields from a schema object recursively
 */
function removeTurkishLocaleFields(obj, path = "") {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item, idx) => removeTurkishLocaleFields(item, `${path}[${idx}]`));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    // Remove `tr` locale key
    if (key === "tr" || key.endsWith("_i18n") && typeof value === "object" && value !== null) {
      // For _i18n objects, remove the "tr" key
      if (key.endsWith("_i18n") && typeof value === "object" && !Array.isArray(value)) {
        const cleaned = {};
        for (const [localeKey, localeValue] of Object.entries(value)) {
          if (localeKey !== "tr") {
            cleaned[localeKey] = localeValue;
          }
        }
        // Only keep if other locales remain
        if (Object.keys(cleaned).length > 0) {
          result[key] = cleaned;
        }
        continue;
      }
      continue; // skip tr key entirely
    }
    result[key] = removeTurkishLocaleFields(value, `${path}.${key}`);
  }
  return result;
}

/**
 * Migrate a single schema file
 */
function migrateSchema(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const schema = JSON.parse(content);

  // Step 1: Remove tr locale fields
  const cleaned = removeTurkishLocaleFields(schema);

  // Step 2: Rename Turkish input IDs
  const idMap = new Map(); // old -> new
  if (Array.isArray(cleaned.inputs)) {
    for (const input of cleaned.inputs) {
      if (input.id && hasTurkishToken(input.id)) {
        const newId = translateIdentifier(input.id);
        if (newId !== input.id) {
          idMap.set(input.id, newId);
          input.id = newId;
        }
      }
    }
  }

  // Step 3: Update normalized_inputs references
  if (Array.isArray(cleaned.normalized_inputs)) {
    for (const ni of cleaned.normalized_inputs) {
      if (ni.from_input && idMap.has(ni.from_input)) {
        ni.from_input = idMap.get(ni.from_input);
      }
      if (ni.id && hasTurkishToken(ni.id)) {
        // Rebuild from new from_input
        const fromId = ni.from_input || ni.id.replace(/_norm$/, "");
        ni.id = `${fromId}_norm`;
      }
    }
  }

  // Step 4: Update formula references
  if (cleaned.formulas && typeof cleaned.formulas === "object" && !Array.isArray(cleaned.formulas)) {
    const oldFormulas = { ...cleaned.formulas };
    cleaned.formulas = {};
    for (const [key, value] of Object.entries(oldFormulas)) {
      const newKey = translateIdentifier(key);
      // Update formula expression references
      if (typeof value === "string") {
        let newValue = value;
        for (const [oldId, newId] of idMap) {
          // Replace old input ID references in formula expressions
          const regex = new RegExp(oldId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
          newValue = newValue.replace(regex, newId);
        }
        cleaned.formulas[newKey] = newValue;
      } else {
        cleaned.formulas[newKey] = value;
      }
    }
  }

  // Step 5: Update outputs references
  if (cleaned.outputs) {
    if (cleaned.outputs.breakdown && typeof cleaned.outputs.breakdown === "object") {
      const oldBreakdown = { ...cleaned.outputs.breakdown };
      cleaned.outputs.breakdown = {};
      for (const [key, value] of Object.entries(oldBreakdown)) {
        cleaned.outputs.breakdown[translateIdentifier(key)] = value;
      }
    }
    if (cleaned.outputs.breakdown_i18n && typeof cleaned.outputs.breakdown_i18n === "object") {
      // Also update i18n keys
      const oldI18n = { ...cleaned.outputs.breakdown_i18n };
      cleaned.outputs.breakdown_i18n = {};
      for (const [key, value] of Object.entries(oldI18n)) {
        const newKey = translateIdentifier(key);
        // Remove tr locale within each
        if (typeof value === "object" && value !== null) {
          const cleanedValue = {};
          for (const [localeKey, localeValue] of Object.entries(value)) {
            if (localeKey !== "tr") cleanedValue[localeKey] = localeValue;
          }
          cleaned.outputs.breakdown_i18n[newKey] = cleanedValue;
        } else {
          cleaned.outputs.breakdown_i18n[newKey] = value;
        }
      }
    }
    if (cleaned.outputs.primary && idMap.has(cleaned.outputs.primary)) {
      cleaned.outputs.primary = idMap.get(cleaned.outputs.primary);
    }
  }

  // Step 6: Update about description i18n locale removal
  if (cleaned.about?.description?.short_i18n && typeof cleaned.about.description.short_i18n === "object") {
    const cleanedI18n = {};
    for (const [localeKey, localeValue] of Object.entries(cleaned.about.description.short_i18n)) {
      if (localeKey !== "tr") cleanedI18n[localeKey] = localeValue;
    }
    cleaned.about.description.short_i18n = cleanedI18n;
  }
  if (cleaned.about?.description?.long_i18n && typeof cleaned.about.description.long_i18n === "object") {
    const cleanedI18n = {};
    for (const [localeKey, localeValue] of Object.entries(cleaned.about.description.long_i18n)) {
      if (localeKey !== "tr") cleanedI18n[localeKey] = localeValue;
    }
    cleaned.about.description.long_i18n = cleanedI18n;
  }

  return {
    schema: cleaned,
    renamedIds: [...idMap.entries()],
    hadTurkishLocale: content.includes('"tr"'),
  };
}

// ── Main ───────────────────────────────────────────────────────────────────
const SCHEMA_DIRS = [
  path.join(ROOT, "generated/schemas"),
];

if (existsSync(path.join(ROOT, "sectorcalc_pro_new_v531_package/schemas"))) {
  SCHEMA_DIRS.push(path.join(ROOT, "sectorcalc_pro_new_v531_package/schemas"));
}

let totalMigrated = 0;
let totalIdsRenamed = 0;
let totalTurkishLocaleRemoved = 0;
const allChanges = [];

for (const dir of SCHEMA_DIRS) {
  if (!existsSync(dir)) continue;

  const files = readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith("-schema.json") || f.endsWith(".schema.json"))
    .map((f) => path.join(dir, f));

  for (const file of files) {
    const result = migrateSchema(file);
    const changed = result.renamedIds.length > 0 || result.hadTurkishLocale;

    if (changed) {
      writeFileSync(file, JSON.stringify(result.schema, null, 2) + "\n", "utf-8");
      totalMigrated++;
      totalIdsRenamed += result.renamedIds.length;
      if (result.hadTurkishLocale) totalTurkishLocaleRemoved++;

      for (const [oldId, newId] of result.renamedIds) {
        allChanges.push(`${path.relative(ROOT, file)}: ${oldId} → ${newId}`);
      }
    }
  }
}

console.log("\n\uD83D\uDD04 V5.3.1 Schema English Identifier Migration\n");
console.log(`Schemas scanned:    ${SCHEMA_DIRS.map(d => readdirSync(d, {recursive: true}).filter(f => f.endsWith('.json')).length).reduce((a, b) => a + b, 0)}`);
console.log(`Schemas migrated:  ${totalMigrated}`);
console.log(`IDs renamed:       ${totalIdsRenamed}`);
console.log(`TR locales removed: ${totalTurkishLocaleRemoved}`);

if (allChanges.length > 0) {
  console.log("\n--- Changes ---\n");
  for (const change of allChanges.slice(0, 50)) {
    console.log(`  ${change}`);
  }
  if (allChanges.length > 50) {
    console.log(`  ... and ${allChanges.length - 50} more`);
  }
}

console.log("\n✅ Migration complete.\n");
