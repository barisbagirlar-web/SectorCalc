#!/usr/bin/env node
/**
 * Delete all B2C, academic, and irrelevant tools from the codebase.
 * These tools are NOT what B2B decision-makers (masters, CFOs, engineers) search for.
 *
 * Comprehensive cleanup across all data files, registries, generated files.
 *
 * Usage: node scripts/delete-b2c-academic-tools.mjs
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const VERIFY_ONLY = process.argv.includes("--verify-only");

// ============================================================
// TARGET SLUGS
// ============================================================

const SLUGS = [
  // academic_physics (17)
  "0-100-kmh-acceleration-calculator",
  "chandrasekhar-limit-calculator",
  "compton-shift-calculator",
  "de-broglie-wavelength-calculator",
  "ideal-gas-law-calculator",
  "infinite-well-energy-calculator",
  "photoelectric-effect-calculator",
  "quantum-tunneling-probability-calculator",
  "terminal-velocity-calculator",
  "capillary-rise-calculator",
  "surface-tension-calculator",
  "spring-mass-resonant-frequency-calculator",
  "undamped-spring-mass-angular-frequency-calculator",
  "solenoid-magnetic-field-calculator",
  "biot-savart-field-calculator",
  "normal-shock-wave-pressure-jump-calculator",
  "stokes-law-calculator",

  // statistics_math (4)
  "anova-f-statistic-calculator",
  "mean-median-mode-calculator",
  "confidence-interval-calculator",
  "item-difficulty-discrimination-calculator",

  // medical_biology (3)
  "drug-half-life-calculator",
  "biological-signal-sampling-calculator",
  "vo2-max-cooper-test-calculator",

  // academic_misc (5)
  "rsa-key-strength-calculator",
  "statute-of-limitations-calculator",
  "tesla-unit-converter-calculator",
  "decibel-converter-calculator",
  "h-index-calculator",

  // b2c_consumer (4)
  "1031-exchange-cash-out-calculator",
  "brrrr-investment-calculator",
  "taxi-fare-calculator",
  "real-estate-commission-calculator",
];

const slugSet = new Set(SLUGS);

// Abbreviated keys used in i18n/registry files (shorter form of the slug)
const ABBREVIATED_KEYS = [
  "mean-median-mode-averages",
  "anova-f-statistic-variance",
  "brrrr-investment-strategy",
  "confidence-interval-bounds",
  "normal-shock-wave-relations",
  "capillary-action",
  "photoelectric-effect",
  "stokes-law",
  "terminal-velocity",
  "surface-tension",
  "quantum-tunneling",
  "compton-scattering",
  "chandrasekhar-limit",
  "biot-savart-law",
  "de-broglie-wavelength",
  "decibel-converter",
  "magnetic-field-solenoid",
  "tesla-unit-converter",
  "ideal-gas-law",
  "drug-half-life",
  "h-index",
  "item-difficulty-discrimination",
  "statute-of-limitations-period",
  "0-100-kmh-acceleration",
];

const abbreviatedSet = new Set(ABBREVIATED_KEYS);

// Names used in scripts/generate-new-free-tools.mjs
const GENERATE_NAMES = [
  "0-100-kmh-acceleration",
  "anova-f-statistic-variance",
  "brrrr-investment-strategy",
  "chandrasekhar-limit",
  "compton-scattering",
  "confidence-interval-bounds",
  "de-broglie-wavelength",
  "decibel-converter",
  "drug-half-life",
  "h-index",
  "ideal-gas-law",
  "infinite-well-energy",
  "item-difficulty-discrimination",
  "mean-median-mode-averages",
  "normal-shock-wave-relations",
  "photoelectric-effect",
  "quantum-tunneling",
  "real-estate-commission",
  "rsa-key-strength",
  "solenoid-magnetic-field",
  "spring-mass-resonant-frequency",
  "statute-of-limitations-period",
  "stokes-law",
  "surface-tension",
  "taxi-fare",
  "terminal-velocity",
  "tesla-unit-converter",
  "undamped-spring-mass-angular-frequency",
  "vo2-max-cooper-test",
  "biological-signal-sampling",
  "biot-savart-law",
  "capillary-action",
  "magnetic-field-solenoid",
  "1031-exchange-cash-out",
];

// ============================================================
// HELPERS
// ============================================================

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}
function writeJSON(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}
function readFile(p) {
  return fs.readFileSync(p, "utf-8");
}
function writeFile(p, content) {
  fs.writeFileSync(p, content);
}

/** Remove items from a JSON array by exact match */
function removeFromJSONArray(filePath, values) {
  const orig = readJSON(filePath);
  const filtered = orig.filter((item) => !values.includes(item));
  if (filtered.length !== orig.length) {
    writeJSON(filePath, filtered);
    console.log(`  ✓ ${path.basename(filePath)}: removed ${orig.length - filtered.length} entries`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching entries`);
  }
}

/** Remove keys from a flat JSON object */
function removeKeysFromJSON(filePath, keys) {
  const orig = readJSON(filePath);
  let removed = 0;
  for (const k of keys) {
    if (k in orig) {
      delete orig[k];
      removed++;
    }
  }
  if (removed > 0) {
    writeJSON(filePath, orig);
    console.log(`  ✓ ${path.basename(filePath)}: removed ${removed} keys`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching entries`);
  }
}

/**
 * Remove keys from nested language objects in a JSON file.
 * Format: { "de": { "key1": {...}, ... }, "fr": {...}, "es": {...} }
 */
function removeNestedI18NKeys(filePath, targetKeys) {
  const orig = readJSON(filePath);
  let totalRemoved = 0;
  for (const [lang, entries] of Object.entries(orig)) {
    if (entries && typeof entries === "object" && !Array.isArray(entries)) {
      for (const key of targetKeys) {
        if (key in entries) {
          delete entries[key];
          totalRemoved++;
        }
      }
    }
  }
  if (totalRemoved > 0) {
    writeJSON(filePath, orig);
    console.log(`  ✓ ${path.basename(filePath)}: removed ${totalRemoved} entries across languages`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching entries`);
  }
}

/** Remove lines from a text file that contain any of the given strings */
function removeLinesContaining(filePath, strings) {
  const content = readFile(filePath);
  const lines = content.split("\n");
  const filtered = lines.filter((line) => {
    return !strings.some((s) => line.includes(s));
  });
  if (filtered.length !== lines.length) {
    writeFile(filePath, filtered.join("\n"));
    console.log(`  ✓ ${path.basename(filePath)}: removed ${lines.length - filtered.length} lines`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching lines`);
  }
}

/** Remove lines from a TS file matching: "slug": createLoader(...) */
function removeTSEntries(filePath, slugs) {
  let content = readFile(filePath);
  const lines = content.split("\n");
  const filtered = lines.filter((line) => {
    return !slugs.some((slug) => {
      const pattern = `"${slug}": createLoader(`;
      return line.includes(pattern);
    });
  });
  if (filtered.length !== lines.length) {
    writeFile(filePath, filtered.join("\n"));
    console.log(`  ✓ ${path.basename(filePath)}: removed ${lines.length - filtered.length} entries`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching entries`);
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Remove verdict lines from runtime-readiness file */
function removeVerdictEntries(filePath, slugs) {
  let content = readFile(filePath);
  const lines = content.split("\n");
  const filtered = lines.filter((line) => {
    return !slugs.some((slug) => {
      return line.includes(`"${slug}"`);
    });
  });
  if (filtered.length !== lines.length) {
    writeFile(filePath, filtered.join("\n"));
    console.log(`  ✓ ${path.basename(filePath)}: removed ${lines.length - filtered.length} entries`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching entries`);
  }
}

/** Remove redirect entries where the VALUE matches a slug */
function removeRedirectEntries(filePath, slugs) {
  const orig = readJSON(filePath);
  let removed = 0;
  for (const [k, v] of Object.entries(orig)) {
    if (typeof v === "string" && slugs.some((s) => v.includes(s))) {
      delete orig[k];
      removed++;
    }
  }
  if (removed > 0) {
    writeJSON(filePath, orig);
    console.log(`  ✓ ${path.basename(filePath)}: removed ${removed} entries`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching entries`);
  }
}

/** Remove entries from a slug map where the ENGLISH value matches exactly */
function removeFromSlugMap(filePath, slugs) {
  const orig = readJSON(filePath);
  let removed = 0;
  for (const [k, v] of Object.entries(orig)) {
    if (typeof v === "string" && slugs.some((s) => v === s)) {
      delete orig[k];
      removed++;
    }
  }
  if (removed > 0) {
    writeJSON(filePath, orig);
    console.log(`  ✓ ${path.basename(filePath)}: removed ${removed} entries`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching entries`);
  }
}

/** Remove abbreviated function blocks from the massive free-traffic-calculators-registry.ts */
function removeAbbreviatedRegistryEntries(filePath, abbreviatedKeys) {
  let content = readFile(filePath);
  let removedCount = 0;
  for (const key of abbreviatedKeys) {
    // Simple approach: find the marker line and remove until we find the matching close
    const startMarker = `  "${key}": (values) => {`;
    let idx = content.indexOf(startMarker);
    if (idx === -1) continue;

    // Count braces from start position to find the end
    const fromStart = content.slice(idx);
    let depth = 0;
    let endIdx = 0;
    let foundOpening = false;
    for (let i = 0; i < fromStart.length; i++) {
      if (fromStart[i] === "{") {
        depth++;
        foundOpening = true;
      } else if (fromStart[i] === "}") {
        depth--;
        if (foundOpening && depth === 0) {
          endIdx = idx + i + 1; // include the closing brace
          break;
        }
      }
    }
    if (endIdx > 0) {
      // Also include the trailing comma if present
      if (content[endIdx] === ",") endIdx++;
      if (content[endIdx] === "\n") endIdx++;
      // Remove the block
      content = content.slice(0, idx) + content.slice(endIdx);
      removedCount++;
    }
  }
  content = content.replace(/\n{3,}/g, "\n\n");
  if (removedCount > 0) {
    writeFile(filePath, content);
    console.log(`  ✓ ${path.basename(filePath)}: removed ${removedCount} entries`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching entries`);
  }
}

/** Delete files in schemas dir matching the slugs */
function deleteSchemaFiles() {
  const schemasDir = path.join(ROOT, "generated", "schemas");
  if (!fs.existsSync(schemasDir)) return 0;
  let totalDeleted = 0;
  for (const slug of SLUGS) {
    const entries = fs.readdirSync(schemasDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const filePath = path.join(schemasDir, entry.name, `${slug}-schema.json`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          totalDeleted++;
          // Remove subdirectory if empty
          const dirPath = path.join(schemasDir, entry.name);
          if (fs.readdirSync(dirPath).length === 0) {
            fs.rmdirSync(dirPath);
          }
        }
      }
    }
  }
  return totalDeleted;
}

/** Delete generated TS files */
function deleteGeneratedTSFiles() {
  const genDir = path.join(ROOT, "generated");
  let count = 0;
  for (const slug of SLUGS) {
    const fp = path.join(genDir, `${slug}.ts`);
    if (fs.existsSync(fp)) {
      fs.unlinkSync(fp);
      count++;
    }
  }
  return count;
}

/** Delete test files */
function deleteTestFiles() {
  const testsDir = path.join(ROOT, "src/lib/__tests__/generated");
  if (!fs.existsSync(testsDir)) return 0;
  let count = 0;
  for (const slug of SLUGS) {
    const fp = path.join(testsDir, `${slug}.test.ts`);
    if (fs.existsSync(fp)) {
      fs.unlinkSync(fp);
      count++;
    }
  }
  return count;
}

/** Remove audit results by slug */
function removeAuditResults(filePath) {
  if (!fs.existsSync(filePath)) return;
  try {
    const audit = readJSON(filePath);
    // Handle both array and object formats
    if (Array.isArray(audit)) {
      const filtered = audit.filter((item) => {
        const itemSlug = item.slug || item.id || "";
        return !slugSet.has(itemSlug);
      });
      if (filtered.length !== audit.length) {
        writeJSON(filePath, filtered);
        console.log(`  ✓ ${path.basename(filePath)}: removed ${audit.length - filtered.length} entries`);
      } else {
        console.log(`  - ${path.basename(filePath)}: no matching entries`);
      }
    } else if (typeof audit === "object") {
      // Object format: remove keys that match slugs
      removeKeysFromJSON(filePath, SLUGS);
    }
  } catch (e) {
    console.log(`  - ${path.basename(filePath)}: error (${e.message})`);
  }
}

/** Remove entries from generate-new-free-tools.mjs script */
function removeFromGenerateScript(filePath, names) {
  let content = readFile(filePath);
  const lines = content.split("\n");
  const filtered = lines.filter((line) => {
    return !names.some((name) => {
      return line.includes(`"${name}"`);
    });
  });
  if (filtered.length !== lines.length) {
    writeFile(filePath, filtered.join("\n"));
    console.log(`  ✓ ${path.basename(filePath)}: removed ${lines.length - filtered.length} lines`);
  } else {
    console.log(`  - ${path.basename(filePath)}: no matching entries`);
  }
}

// ============================================================
// MAIN
// ============================================================

console.log("\n🧹 Cleaning up B2C/Academic/Irrelevant Tools");
console.log(`   Target: ${SLUGS.length} tool slugs\n`);

// VERIFY-ONLY MODE - grep-based scan, no file modification
if (VERIFY_ONLY) {
  console.log("🔍 Verify-only mode: scanning for remaining references...\n");
  const { execSync } = await import("child_process");
  const allSlugPatterns = SLUGS.map(s => s.replace(/-/g, "[\\s-]")).join("|");
  
  // Search key source/script/config directories
  const dirs = ["src", "config", "public", "scripts", "generated"];
  let totalFound = 0;
  const foundFiles = [];
  
  for (const dir of dirs) {
    try {
      const result = execSync(
        `rg -l "${allSlugPatterns}" ${dir} --type ts --type json --type js --type txt 2>/dev/null || true`,
        { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
      );
      const files = result.trim().split("\n").filter(Boolean);
      for (const file of files) {
        if (file.includes("node_modules") || file.includes(".next") || file.includes("sectorcalc_pro_new_v531_package") || file.includes("delete-b2c-academic")) continue;
        if (!foundFiles.includes(file)) foundFiles.push(file);
        console.log(`  ⚠ Found in: ${file}`);
        totalFound++;
      }
    } catch {}
  }
  
  if (totalFound === 0) {
    console.log("  ✅ No remaining references found. Clean!\n");
  } else {
    console.log(`\n  ⚠ ${totalFound} match(es) in ${foundFiles.length} file(s) still contain references.\n`);
  }
  process.exit(0);
}

// --- 1. free-slugs.json ---
console.log("1. free-slugs.json");
removeFromJSONArray(path.join(ROOT, "free-slugs.json"), SLUGS);

// --- 2. free-traffic-slug-categories.generated.json ---
console.log("\n2. free-traffic-slug-categories.generated.json");
removeKeysFromJSON(
  path.join(ROOT, "src/data/free-traffic-slug-categories.generated.json"),
  SLUGS
);

// --- 3. generated-tool-titles-i18n.generated.json ---
console.log("\n3. generated-tool-titles-i18n.generated.json");
removeKeysFromJSON(
  path.join(ROOT, "src/data/generated-tool-titles-i18n.generated.json"),
  SLUGS
);

// --- 4. schema-catalog-metadata.generated.json ---
console.log("\n4. schema-catalog-metadata.generated.json");
removeKeysFromJSON(
  path.join(ROOT, "src/data/schema-catalog-metadata.generated.json"),
  SLUGS
);

// --- 5. generated-tool-slug-redirects.json ---
console.log("\n5. generated-tool-slug-redirects.json");
removeRedirectEntries(
  path.join(ROOT, "config/generated-tool-slug-redirects.json"),
  SLUGS
);

// --- 6. calculator-registry.ts ---
console.log("\n6. calculator-registry.ts");
removeTSEntries(
  path.join(ROOT, "src/lib/features/generated-tools/calculator-registry.ts"),
  SLUGS
);

// --- 7. runtime-readiness-p24-verdicts.ts ---
console.log("\n7. runtime-readiness-p24-verdicts.ts");
removeVerdictEntries(
  path.join(ROOT, "src/lib/features/tools/runtime-readiness-p24-verdicts.ts"),
  SLUGS
);

// --- 8. slug-map.json ---
console.log("\n8. slug-map.json");
removeFromSlugMap(path.join(ROOT, "slug-map.json"), SLUGS);

// --- 9. scripts/data/english-slug-map.json ---
console.log("\n9. english-slug-map.json");
removeFromSlugMap(
  path.join(ROOT, "scripts/data/english-slug-map.json"),
  SLUGS
);

// --- 10. public/services-products.txt ---
console.log("\n10. services-products.txt");
removeLinesContaining(
  path.join(ROOT, "public/services-products.txt"),
  SLUGS
);

// --- 11. Delete generated schema files ---
console.log("\n11. generated/schemas/");
const deletedSchemas = deleteSchemaFiles();
console.log(`   ✓ Deleted ${deletedSchemas} schema files`);

// --- 12. Delete generated TS files ---
console.log("\n12. generated/*.ts");
const deletedTS = deleteGeneratedTSFiles();
console.log(`   ✓ Deleted ${deletedTS} generated TS files`);

// --- 13. Delete test files ---
console.log("\n13. src/lib/__tests__/generated/");
const testDeleted = deleteTestFiles();
console.log(`   ✓ Deleted ${testDeleted} test files`);

// --- 14. free-tool-catalog-i18n.generated.json (nested under languages) ---
console.log("\n14. free-tool-catalog-i18n.generated.json");
removeNestedI18NKeys(
  path.join(ROOT, "src/data/free-tool-catalog-i18n.generated.json"),
  ABBREVIATED_KEYS
);

// --- 15. free-traffic-calculators-registry.ts (abbreviated function blocks) ---
console.log("\n15. free-traffic-calculators-registry.ts (removing abbreviated function blocks)");
removeAbbreviatedRegistryEntries(
  path.join(ROOT, "src/lib/features/tools/free-traffic-calculators-registry.ts"),
  ABBREVIATED_KEYS
);

// --- 16. scripts/audit_results_complete.json ---
console.log("\n16. audit_results_complete.json");
removeAuditResults(path.join(ROOT, "scripts/audit_results_complete.json"));

// --- 17. generated/tool-git-dates.json ---
console.log("\n17. tool-git-dates.json");
removeKeysFromJSON(path.join(ROOT, "generated/tool-git-dates.json"), SLUGS);

// --- 18. scripts/generate-new-free-tools.mjs ---
console.log("\n18. generate-new-free-tools.mjs");
removeFromGenerateScript(
  path.join(ROOT, "scripts/generate-new-free-tools.mjs"),
  GENERATE_NAMES
);

// --- 19. free-tool-inputs-i18n.generated.json ---
console.log("\n19. free-tool-inputs-i18n.generated.json");
removeNestedI18NKeys(
  path.join(ROOT, "src/data/free-tool-inputs-i18n.generated.json"),
  SLUGS
);

// --- 20. resolve-tool-category.ts ---
console.log("\n20. resolve-tool-category.ts");
// Remove lines containing these slug-like references
const categoryRefs = [
  "de-broglie-wavelength",
  "chandrasekhar-limit",
];
removeLinesContaining(
  path.join(ROOT, "src/lib/catalog/resolve-tool-category.ts"),
  categoryRefs
);

console.log("\n✅ Cleanup complete!");
console.log("Run: npm run lint && npx tsc --noEmit && npm run build");
