#!/usr/bin/env node
/**
 * Fix ALL Turkish ASCII labels/businessContext/sector fields at source.
 * Uses i18n.en values when available.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SECTOR_MAP = {
  "Machine Muhendisligi": "Mechanical Engineering",
  "Elektrik ve Elektronik": "Electrical and Electronics",
  "Insaaat ve Structure": "Construction and Building",
  "Construction ve Altyapi": "Construction and Infrastructure",
  "Operating": "Business Management",
  "Tekstil ve Konfeksiyon": "Textile and Apparel",
  "Gida ve Tarim": "Food and Agriculture",
  "Chemical ve Process": "Chemical and Process",
  "Energy ve Power Sistemleri": "Energy and Power Systems",
  "Lojistik ve Nakliye": "Logistics and Transportation",
  "Finance ve Investment": "Finance and Investment",
  "Yazilim ve Bilisim": "Software and IT",
  "Havacilik ve Denizcilik": "Aviation and Maritime",
  "Savunma ve Safety": "Defense and Security",
  "Saglik ve Medikal": "Health and Medical",
  "Su ve Atik Yonetimi": "Water and Waste Management",
  "Tax ve Accounting": "Tax and Accounting",
  "Ceza ve Hukuk": "Legal and Penal",
  "Training ve Arastirma": "Education and Research",
  "Insurance ve Risk": "Insurance and Risk",
  "Tarim, Denizcilik ve Sondaj": "Agriculture, Maritime and Drilling",
  "Bilisim, Biyomedikal ve Maden": "IT, Biomedical and Mining",
  "Mekanik, Otomotiv ve Havacilik": "Mechanical, Automotive and Aviation",
  "Yangin, Elektrik ve Elektronik": "Waste, Electrical and Electronics",
  "Ileri Fizik ve Kuantum": "Advanced Physics and Quantum",
  "Endustri Muhendisligi": "Industrial Engineering",
  "Material Bilimi": "Materials Science",
  "Petrol ve Dogalgaz": "Oil and Gas",
  "Kredi ve Borc": "Credit and Debt",
  "Is Sagligi ve Guvenligi": "Occupational Health and Safety",
  "Environment ve Sustainability": "Environment and Sustainability",
  "Tax ve Accounting": "Tax and Accounting",
};

function fixSchema(schema) {
  let changed = false;

  // Fix sector
  if (schema.sector && SECTOR_MAP[schema.sector]) {
    schema.sector = SECTOR_MAP[schema.sector];
    changed = true;
  }

  // Fix inputs
  if (schema.inputs) {
    for (const inp of schema.inputs) {
      // Fix label from label_i18n.en
      if (inp.label && inp.label_i18n?.en && inp.label !== inp.label_i18n.en) {
        inp.label = inp.label_i18n.en;
        changed = true;
      }
      // Fix businessContext from businessContext_i18n.en
      if (inp.businessContext && inp.businessContext_i18n?.en && inp.businessContext !== inp.businessContext_i18n.en) {
        inp.businessContext = inp.businessContext_i18n.en;
        changed = true;
      }
      // Clear tr locale values to Turkish-derived text
      if (inp.label_i18n?.tr && /[çğıöşüÇĞİÖŞÜ]/.test(inp.label_i18n.tr)) {
        inp.label_i18n.tr = inp.label_i18n.en || inp.label;
        changed = true;
      }
      if (inp.businessContext_i18n?.tr && /[çğıöşüÇĞİÖŞÜ]/.test(inp.businessContext_i18n.tr)) {
        inp.businessContext_i18n.tr = inp.businessContext_i18n.en || inp.businessContext;
        changed = true;
      }
    }
  }

  // Fix outputs breakdown
  if (schema.outputs?.breakdown) {
    for (const [key, label] of Object.entries(schema.outputs.breakdown)) {
      if (typeof label === "string" && /[çğıöşüÇĞİÖŞÜ]/.test(label)) {
        const en = schema.outputs.breakdown_i18n?.[key]?.en;
        if (en) {
          schema.outputs.breakdown[key] = en;
          // Also fix i18n tr
          if (schema.outputs.breakdown_i18n?.[key]?.tr) {
            schema.outputs.breakdown_i18n[key].tr = en;
          }
          changed = true;
        }
      }
    }
  }

  // Fix about description tr locales
  if (schema.about?.description) {
    for (const field of ["short", "long"]) {
      const i18n = schema.about.description[`${field}_i18n`];
      if (i18n?.tr && /[çğıöşüÇĞİÖŞÜ]/.test(i18n.tr)) {
        i18n.tr = i18n.en || schema.about.description[field];
        changed = true;
      }
    }
  }

  return changed;
}

function collectJsonFiles(dirPath) {
  const absPath = path.join(ROOT, dirPath);
  if (!fs.existsSync(absPath)) return [];
  const results = [];
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith(".json") && entry.name !== "_merged.json") results.push(fullPath);
    }
  }
  walk(absPath);
  return results;
}

const DIRS = ["generated/schemas", "data/pro-tools", "data/pro-tools-universal"];
let totalFixed = 0;
let totalFiles = 0;

for (const dir of DIRS) {
  const files = collectJsonFiles(dir);
  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");
    const schema = JSON.parse(raw);
    if (fixSchema(schema)) {
      fs.writeFileSync(filePath, JSON.stringify(schema, null, 2) + "\n");
      totalFixed++;
      const relPath = path.relative(ROOT, filePath);
      console.log(`FIXED: ${relPath}`);
    }
    totalFiles++;
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Files scanned: ${totalFiles}`);
console.log(`Files fixed: ${totalFixed}`);
console.log(`\nDone.`);
