/**
 * Diagnostic script — count premium tools returned by getPremiumTools().
 * Run: node scripts/count-premium-tools.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

// Parse premium-152 seed TS file to count by category
const seedContent = fs.readFileSync(
  path.join(root, "src/data/premium/sectorcalc-premium-152.seed.ts"),
  "utf-8"
);

// Count total tools
const totalMatch = seedContent.match(/totalTools\s*[=:]\s*(\d+)/);
console.log("Seed totalTools:", totalMatch ? totalMatch[1] : "NOT FOUND");

// Count categories
const catMatches = [...seedContent.matchAll(/"categorySlug":\s*"([^"]+)"/g)];
console.log("Seed total items (by categorySlug count):", catMatches.length);

// Unique categories
const uniqueCats = new Set(catMatches.map(m => m[1]));
console.log("Unique categories in seed:", uniqueCats.size);
for (const cat of [...uniqueCats].sort()) {
  const count = catMatches.filter(m => m[1] === cat).length;
  console.log(`  ${cat}: ${count}`);
}

// Count PREMIUM_CALCULATOR_SCHEMAS by reading schema-registry TS
const registryContent = fs.readFileSync(
  path.join(root, "src/lib/premium-schema/schema-registry.ts"),
  "utf-8"
);
const schemaCount = (registryContent.match(/SCHEMA,/g) || []).length;
console.log("\nPREMIUM_CALCULATOR_SCHEMAS count:", schemaCount);

// Count overlapping slugs (batch 1 — first 5 seed items with routes)
const batchSlugs = registryContent.match(/id:\s*"([^"]+)"/g);
console.log("Schema IDs:", batchSlugs ? batchSlugs.length : 0);

// Free slugs count
let freeSlugs = [];
try {
  freeSlugs = JSON.parse(fs.readFileSync(path.join(root, "free-slugs.json"), "utf-8"));
} catch {}
console.log("\nFree slugs count:", freeSlugs.length);

// Premium slugs count
let premiumSlugs = [];
try {
  premiumSlugs = JSON.parse(fs.readFileSync(path.join(root, "premium-slugs.json"), "utf-8"));
} catch {}
console.log("Premium slugs count:", premiumSlugs.length);

// Premium-152 seed first 5 batch slugs
const batch1 = [
  "7-waste-muda-avcisi-parasal-karsilik-calculator",
  "5s-audit-skoru-productivity-loss-cost-calculator",
  "3b-baski-destek-structure-ve-post-process-cost-calculator",
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  "3b-baski-vs-talasli-manufacturing-basabas-noktasi-calculator",
];

// Check overlap between seed slugs and schema IDs in registry
const registrySlugs = [...registryContent.matchAll(/"(?:[^"]+)"\s*:\s*"(?:[^"]+)"/g)].map(m => m[1]);
const seedSlugs = [...seedContent.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);

const overlap = seedSlugs.filter(s => registryContent.includes(s));
console.log("\nOverlap between seed and registry:", overlap.length);
overlap.forEach(s => console.log("  " + s));

const totalUnique = schemaCount + (totalMatch ? parseInt(totalMatch[1]) : 152) - overlap.length;
console.log("\nEstimated unique premium tools:", totalUnique);
