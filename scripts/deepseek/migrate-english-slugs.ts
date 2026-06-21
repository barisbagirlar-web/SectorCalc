#!/usr/bin/env npx tsx
/**
 * MIGRATION: Rename all 358 Turkish slugs to English slugs.
 * 
 * Steps:
 * 1. Update section definition files (22 files) — change slug field
 * 2. Update free-slugs.json — replace all slugs
 * 3. Delete old schema JSON files
 * 4. Delete old generated TS files
 * 5. Update title i18n bundle keys (re-key by new slug)
 * 6. Update description i18n bundle keys (re-key by new slug)
 * 7. Update copy-i18n map if exists
 */
import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const MAP_PATH = path.join(PROJECT_ROOT, "scripts", "data", "english-slug-map.json");
const LIB_DIR = path.join(PROJECT_ROOT, "scripts", "deepseek", "lib");
const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const GENERATED_DIR = path.join(PROJECT_ROOT, "generated");
const FREE_SLUGS_PATH = path.join(PROJECT_ROOT, "free-slugs.json");
const TITLES_PATH = path.join(PROJECT_ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const DESCRIPTIONS_PATH = path.join(PROJECT_ROOT, "src/data/generated-tool-descriptions-i18n.generated.json");
const COPY_MAP_PATH = path.join(PROJECT_ROOT, "scripts/data/generated-schema-copy-i18n.json");

// Load slug map
const SLUG_MAP = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8")) as Record<string, string>;
const ENTRY_COUNT = Object.keys(SLUG_MAP).length;
console.log(`Slug map loaded: ${ENTRY_COUNT} mappings`);

// Reverse map: new → old (for updating bundles)
const REVERSE_MAP: Record<string, string> = {};
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  REVERSE_MAP[newSlug] = oldSlug;
}

/* ── Step 1: Update section definition files ── */
function updateSectionFiles(): number {
  const sectionFiles = fs.readdirSync(LIB_DIR).filter((f) => f.startsWith("359-section") && f.endsWith(".ts"));
  let totalReplacements = 0;

  for (const fileName of sectionFiles) {
    const filePath = path.join(LIB_DIR, fileName);
    let content = fs.readFileSync(filePath, "utf-8");
    let changed = false;

    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      // Match: slug: "old-slug"  (with various spacing)
      const pattern = `slug: "${oldSlug}"`;
      const replacement = `slug: "${newSlug}"`;
      if (content.includes(pattern)) {
        content = content.replace(pattern, replacement);
        totalReplacements++;
        changed = true;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`  ✅ Updated ${fileName}`);
    }
  }
  return totalReplacements;
}

/* ── Step 2: Update free-slugs.json ── */
function updateFreeSlugs(): void {
  const current = JSON.parse(fs.readFileSync(FREE_SLUGS_PATH, "utf-8")) as string[];
  const updated = current.map((slug) => SLUG_MAP[slug] ?? slug);
  fs.writeFileSync(FREE_SLUGS_PATH, JSON.stringify(updated, null, 2), "utf-8");
  console.log(`  ✅ free-slugs.json: ${updated.length} slugs`);
}

/* ── Step 3: Delete old schema files ── */
function deleteOldSchemaFiles(): number {
  let count = 0;
  if (fs.existsSync(SCHEMAS_DIR)) {
    for (const fileName of fs.readdirSync(SCHEMAS_DIR)) {
      const slug = fileName.replace("-schema.json", "");
      if (SLUG_MAP[slug]) {
        fs.unlinkSync(path.join(SCHEMAS_DIR, fileName));
        count++;
      }
    }
  }
  return count;
}

/* ── Step 4: Delete old generated TS files ── */
function deleteOldGeneratedTsFiles(): number {
  let count = 0;
  if (fs.existsSync(GENERATED_DIR)) {
    const entries = fs.readdirSync(GENERATED_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".ts") && !entry.name.startsWith(".")) {
        const slug = entry.name.replace(/\.ts$/, "");
        if (SLUG_MAP[slug]) {
          fs.unlinkSync(path.join(GENERATED_DIR, entry.name));
          count++;
        }
      }
    }
  }
  return count;
}

/* ── Step 5: Update title i18n bundle keys ── */
function updateTitleBundle(): void {
  const bundle = JSON.parse(fs.readFileSync(TITLES_PATH, "utf-8")) as Record<string, unknown>;
  const updated: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(bundle)) {
    // Check both direct key and key + "-calculator"
    const newKey = SLUG_MAP[key];
    if (newKey) {
      updated[newKey] = value;
    } else {
      // Check if key matches a new slug (it's already been migrated)
      if (REVERSE_MAP[key]) {
        updated[key] = value;
      } else {
        updated[key] = value;
      }
    }
  }
  fs.writeFileSync(TITLES_PATH, JSON.stringify(updated, null, 2), "utf-8");
  console.log(`  ✅ title bundle: ${Object.keys(updated).length} entries`);
}

/* ── Step 6: Update description i18n bundle keys ── */
function updateDescriptionBundle(): void {
  const bundle = JSON.parse(fs.readFileSync(DESCRIPTIONS_PATH, "utf-8")) as Record<string, unknown>;
  const updated: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(bundle)) {
    const newKey = SLUG_MAP[key];
    if (newKey) {
      updated[newKey] = value;
    } else {
      updated[key] = value;
    }
  }
  fs.writeFileSync(DESCRIPTIONS_PATH, JSON.stringify(updated, null, 2), "utf-8");
  console.log(`  ✅ description bundle: ${Object.keys(updated).length} entries`);
}

/* ── Step 7: Update copy map ── */
function updateCopyMap(): void {
  if (!fs.existsSync(COPY_MAP_PATH)) return;
  const copyMap = JSON.parse(fs.readFileSync(COPY_MAP_PATH, "utf-8")) as Record<string, unknown>;
  let changed = false;
  
  // Update toolTitles keys
  const toolTitles = copyMap.toolTitles as Record<string, unknown> | undefined;
  if (toolTitles) {
    const newTitles: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(toolTitles)) {
      newTitles[SLUG_MAP[key] ?? key] = value;
    }
    copyMap.toolTitles = newTitles;
    changed = true;
  }
  
  // Update toolDescriptions keys  
  const toolDescs = copyMap.toolDescriptions as Record<string, unknown> | undefined;
  if (toolDescs) {
    const newDescs: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(toolDescs)) {
      newDescs[SLUG_MAP[key] ?? key] = value;
    }
    copyMap.toolDescriptions = newDescs;
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(COPY_MAP_PATH, JSON.stringify(copyMap, null, 2), "utf-8");
    console.log(`  ✅ copy map updated`);
  }
}

/* ── MAIN ── */
function main() {
  console.log("=== SLUG MIGRATION ===\n");

  console.log("1/7 Updating section definition files...");
  const replacements = updateSectionFiles();
  console.log(`    ${replacements} slug replacements in section files\n`);

  console.log("2/7 Updating free-slugs.json...");
  updateFreeSlugs();

  console.log("3/7 Deleting old schema JSON files...");
  const deletedSchemas = deleteOldSchemaFiles();
  console.log(`    ${deletedSchemas} schema files deleted`);

  console.log("4/7 Deleting old generated TS files...");
  const deletedTs = deleteOldGeneratedTsFiles();
  console.log(`    ${deletedTs} TS files deleted`);

  console.log("5/7 Updating title i18n bundle...");
  updateTitleBundle();

  console.log("6/7 Updating description i18n bundle...");
  updateDescriptionBundle();

  console.log("7/7 Updating copy map...");
  updateCopyMap();

  console.log("\n=== MIGRATION COMPLETE ===");
  console.log("Next: generate schemas, generate:all, build");
}

main();
