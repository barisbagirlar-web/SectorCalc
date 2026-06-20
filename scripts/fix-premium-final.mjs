#!/usr/bin/env node
/**
 * Final pass: remove ALL user-facing "Premium" from i18n VALUES (not keys).
 * Only keeps "Premium" in:
 * - Medical tool field names (medicare premium, insurance premium — technical terms)
 * - Material quality descriptions (Premium: high-end)
 * - Key names (not values)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "..", "messages");

function countValues(raw, search) {
  return (raw.match(new RegExp(search, "g")) || []).length;
}

function fixLocale(locale) {
  const path = join(messagesDir, `${locale}.json`);
  const raw = readFileSync(path, "utf-8");
  
  const before = countValues(raw, "Premium");
  
  // Read and parse for surgical JSON value-only replacement
  const parsed = JSON.parse(raw);
  
  let fixCount = 0;
  
  function walk(obj, keyPath) {
    if (typeof obj === "string") {
      // Skip medical/insurance tool field names — technical terms
      if (
        obj.includes("Premium") &&
        !obj.includes("Base Premium") &&
        !obj.includes("Standard Part B Premium") &&
        !obj.includes("Standard Part D Premium") &&
        !keyPath.includes("freeToolInputs.") &&
        !keyPath.includes("material_quality") &&
        !keyPath.includes("base_premium") &&
        !keyPath.includes("part_b_premium") &&
        !keyPath.includes("part_d_premium") &&
        !keyPath.includes("use_premium_data") &&
        !keyPath.includes("use_premium_material") &&
        !keyPath.includes("overtime_premium") &&
        !keyPath.includes("shift_premium_factor") &&
        !keyPath.includes(".quality_grade")
      ) {
        const cleaned = obj.replace(/Premium-/g, "Pro-").replace(/Premium /g, "Pro ").replace(/^Premium$/, "Pro");
        if (cleaned !== obj) {
          fixCount++;
          return cleaned;
        }
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item, i) => walk(item, `${keyPath}[${i}]`));
    }
    if (obj && typeof obj === "object") {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[key] = walk(value, `${keyPath}.${key}`);
      }
      return newObj;
    }
    return obj;
  }
  
  const updated = walk(parsed, "");
  const after = countValues(JSON.stringify(updated), "Premium");
  
  if (fixCount > 0) {
    const output = JSON.stringify(updated, null, 2) + "\n";
    writeFileSync(path, output, "utf-8");
    console.log(`  ${locale}: fixed ${fixCount} values (${before} → ${after} remaining — medical/technical only)`);
  } else {
    console.log(`  ${locale}: nothing to fix (${before} remaining — medical/technical only)`);
  }
}

const locales = ["tr", "de", "fr", "es", "ar", "en"];
for (const l of locales) {
  fixLocale(l);
}
console.log("\n✅ Done");
