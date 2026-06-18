/**
 * Audit: dump categoryKey + sectorKey distribution from generated schemas
 * to understand homepage coverage count mismatches.
 *
 * Usage: node scripts/audit-homepage-counts.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = path.join(__dirname, "..", "generated", "schemas");
const metadataPath = path.join(__dirname, "..", "src", "data", "schema-catalog-metadata.generated.json");
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));

if (!fs.existsSync(SCHEMAS_DIR)) {
  console.log("No schemas dir found");
  process.exit(0);
}

const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".json"));

const categoryKeys = {};
const sectorKeys = {};

for (const file of files) {
  const raw = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8"));
  const slug = file.replace(/-schema\.json$/, "");
  
  // Determine categoryKey (same logic as resolveCategoryKey)
  let categoryKey = 
    raw.categorySlug ||
    metadata[slug]?.categorySlug ||
    raw.categoryId ||
    (raw.category ? slugifyLabel(raw.category) : null) ||
    "diger";

  let sectorKey =
    raw.sectorSlug ||
    metadata[slug]?.sectorSlug ||
    raw.sectorId ||
    (raw.sector ? slugifyLabel(raw.sector) : null) ||
    "diger";

  categoryKeys[categoryKey] = (categoryKeys[categoryKey] || 0) + 1;
  sectorKeys[sectorKey] = (sectorKeys[sectorKey] || 0) + 1;
}

function slugifyLabel(label) {
  return label
    .toLowerCase()
    .replace(/[&,]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .trim();
}

console.log("\n=== CATEGORY KEYS ===");
Object.entries(categoryKeys)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${k}: ${v}`));

console.log("\n=== SECTOR KEYS ===");
Object.entries(sectorKeys)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${k}: ${v}`));

console.log("\n=== TOTAL ===");
console.log(`Files: ${files.length}`);
