#!/usr/bin/env node
/**
 * audit-active-turkish-data-dependencies.mjs
 * Phase 1 dependency audit.
 * Classifies Turkish files and checks for prohibited imports.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repoRoot = process.cwd();

const scanRoots = [
  "src",
  "data",
  "public",
  "scripts",
  "generated",
  "references",
];

const excludedDirs = new Set([
  ".git",
  ".next",
  "node_modules",
  "coverage",
  "dist",
  "out",
  "build",
  ".turbo",
  ".vercel",
  ".firebase",
]);

// Target dictionary/alias/normalization files
const TARGET_FILES = [
  "turkish-to-english-dictionary.json",
  "forbidden-turkish-tokens.json",
  "turkish-to-english-canonical-map.json",
  "premium-formulas-batch.txt",
  "forbidden-locale-token-detector.ts",
  "generated-tool-to-superv4-adapter.ts",
  "server-only-input-aliases.ts",
  "schema-loader.ts",
];

// Patterns to identify files to inspect
const keywords = [
  "turkish",
  "türk",
  "tr-",
  "dictionary",
  "alias",
  "transliterate",
  "normalize",
  "i18n",
  "locale",
];

const unicodePattern = /[\u00c7\u00e7\u011e\u011f\u0130\u0131\u00d6\u00f6\u015e\u015f\u00dc\u00fc]/u;
const unicodeEscapes = /\\u00[Cc]7|\\u00[Ee]7|\\u011[Gg]|\\u011[Ff]|\\u0130|\\u0131|\\u00[Dd]6|\\u00[Ff]6|\\u015[Ee]|\\u015[Ff]|\\u00[Dd]c|\\u00[Ff]c/;

// Hardcoded transliterated terms to scan content for
const transliteratedTokens = new Set([
  "engineer", "muhendisi", "engineering", "danismani", "danışmanı", "uzmani", "uzmanı",
  "yapisal", "yapısal", "istatistik", "istatistikci", "marangoz", "realestate", "degerleme", "değerleme",
  "investment", "yatırım", "cost", "capacity", "efficiency", "temperature", "sıcaklık", "design", "tasarım",
  "environment", "çevre", "sustainability", "sürdürülebilirlik", "hydraulic", "railway", "sinyalizasyon",
  "solar", "wind", "elektrikci", "tesisatci", "kaynakci", "tornaci", "frezeci", "tamirci",
  "construction", "steel", "tesfiye", "labor", "işçilik", "veresiye", "weight", "length", "width",
  "height", "derinlik", "yaricap", "start", "average", "coefficient", "user",
  "calculate", "guncel", "dikdortgen", "ucgen", "cokgen", "doseme", "merdiven", "korkuluk",
  "kompresor", "diyafram", "debimetre", "pervane", "burkulma", "burulma", "bukulme",
  "sarfiyat", "supplier", "uretici", "titresim", "giris", "output",
]);

function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function getFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (excludedDirs.has(entry.name)) continue;
      results.push(...getFiles(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

// Find all files in the repo (excluding archives and build directories)
const allFiles = [];
for (const root of scanRoots) {
  allFiles.push(...getFiles(path.join(repoRoot, root)));
}
// Add archive files specifically
const archiveFiles = getFiles(path.join(repoRoot, "archive"));
const allScannedFiles = [...allFiles, ...archiveFiles];

// Step 1: Detect files containing matching criteria
const matchingFiles = [];
for (const file of allScannedFiles) {
  const rel = toRepoRelative(file);
  const name = path.basename(file);

  // Check filename
  let matched = false;
  const nameLower = name.toLowerCase();
  for (const kw of keywords) {
    if (nameLower.includes(kw)) {
      matched = true;
      break;
    }
  }

  // Check content if readable text
  if (!matched && (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".json") || file.endsWith(".txt") || file.endsWith(".md"))) {
    try {
      const content = fs.readFileSync(file, "utf8");
      if (unicodePattern.test(content) || unicodeEscapes.test(content)) {
        matched = true;
      } else {
        const lower = content.toLowerCase();
        for (const kw of keywords) {
          if (lower.includes(kw)) {
            matched = true;
            break;
          }
        }
        if (!matched) {
          // Tokenize and check for transliterated tokens
          const tokens = lower.split(/[^a-z0-9]+/u);
          for (const token of tokens) {
            if (transliteratedTokens.has(token)) {
              matched = true;
              break;
            }
          }
        }
      }
    } catch {}
  }

  if (matched) {
    matchingFiles.push(file);
  }
}

// Step 2: Build import lookup
const importMap = new Map();
for (const file of allFiles) {
  if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".json")) {
    try {
      const content = fs.readFileSync(file, "utf8");
      const rel = toRepoRelative(file);

      for (const target of TARGET_FILES) {
        const targetBase = target.replace(/\.[a-z0-9]+$/, "");
        const escapedTarget = targetBase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(`['"](?:[^'"]*\\/)?${escapedTarget}(?:\\.[a-z0-9]+)?['"]`);
        if (regex.test(content)) {
          if (!importMap.has(target)) {
            importMap.set(target, new Set());
          }
          importMap.get(target).add(rel);
        }
      }
    } catch {}
  }
}

function isActualTurkishDataOrTranslationFile(filePath, content) {
  const name = path.basename(filePath);
  const rel = toRepoRelative(filePath);

  // If it is in the archive directory, it is a historical record, not active
  if (rel.startsWith("archive/")) {
    return false;
  }

  if (name.endsWith(".json")) {
    return true; 
  }
  if (name === "premium-formulas-batch.txt") {
    return true;
  }
  if (name === "schema-loader.ts") {
    return content.includes("stripTurkishChars") || content.includes("translateTurkishToEnglish") || content.includes("translateObject");
  }
  if (name === "forbidden-locale-token-detector.ts") {
    // Check if it defines raw Turkish words
    return content.includes("engineer") || content.includes("danismani");
  }
  if (name === "generated-tool-to-superv4-adapter.ts") {
    return content.includes("TR_EN") && content.includes("length");
  }
  if (name === "server-only-input-aliases.ts") {
    return content.includes("TURKISH_TO_ENGLISH_ID_MAP");
  }
  return false;
}

// Classify files
console.log(`Auditing ${matchingFiles.length} files matching Turkish criteria...`);
const classifications = {};
let failAudit = false;

for (const file of matchingFiles) {
  const rel = toRepoRelative(file);
  const name = path.basename(file);
  let classification = "UNUSED";

  if (rel.startsWith("archive/")) {
    classification = "ARCHIVE_ONLY";
  } else if (rel.includes("test") || rel.includes("__tests__")) {
    classification = "TEST_ONLY";
  } else if (rel.startsWith("public/")) {
    classification = "PUBLIC_COPIED";
  } else if (rel.startsWith("scripts/")) {
    if (rel.includes("deploy")) {
      classification = "DEPLOY_SCRIPT_IMPORTED";
    } else if (rel.includes("generate") || rel.includes("schema")) {
      classification = "SCHEMA_GENERATION_IMPORTED";
    } else {
      classification = "BUILD_SCRIPT_IMPORTED";
    }
  } else {
    const targetMatch = TARGET_FILES.find((t) => name === t || rel.endsWith(t));
    if (targetMatch && importMap.has(targetMatch)) {
      const importers = Array.from(importMap.get(targetMatch));
      const appImporters = importers.filter((imp) => imp.startsWith("src/") && !imp.includes("test") && !imp.includes("__tests__"));
      if (appImporters.length > 0) {
        classification = "APP_RUNTIME_IMPORTED";
      } else {
        classification = "UNUSED";
      }
    } else if (rel.startsWith("src/")) {
      let isImported = false;
      const cleanRel = rel.replace(/\.tsx?$/, "").replace("src/", "@/");
      for (const otherFile of allFiles) {
        if (otherFile === file) continue;
        try {
          const content = fs.readFileSync(otherFile, "utf8");
          if (content.includes(cleanRel) || content.includes(name.replace(/\.[a-z0-9]+$/, ""))) {
            isImported = true;
            break;
          }
        } catch {}
      }
      classification = isImported ? "APP_RUNTIME_IMPORTED" : "UNUSED";
    }
  }

  classifications[rel] = classification;

  const isTarget = TARGET_FILES.some((t) => name === t);
  if (isTarget) {
    let content = "";
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {}

    if (isActualTurkishDataOrTranslationFile(file, content)) {
      if (classification === "APP_RUNTIME_IMPORTED") {
        console.error(`❌ FAIL: target file ${rel} is classified as APP_RUNTIME_IMPORTED`);
        failAudit = true;
      }
      if (classification === "PUBLIC_COPIED") {
        console.error(`❌ FAIL: target file ${rel} is classified as PUBLIC_COPIED`);
        failAudit = true;
      }
      if (classification === "SCHEMA_GENERATION_IMPORTED") {
        console.error(`❌ FAIL: target file ${rel} is classified as SCHEMA_GENERATION_IMPORTED`);
        failAudit = true;
      }
      if (classification === "DEPLOY_SCRIPT_IMPORTED") {
        console.error(`❌ FAIL: target file ${rel} is classified as DEPLOY_SCRIPT_IMPORTED`);
        failAudit = true;
      }
    }
  }
}

// Print classifications summary
console.log("\nClassification Summary:");
const counts = {};
for (const rel of Object.keys(classifications).sort()) {
  const cls = classifications[rel];
  counts[cls] = (counts[cls] || 0) + 1;
  console.log(`- ${rel}: ${cls}`);
}

console.log("\nCounts:");
console.log(JSON.stringify(counts, null, 2));

if (failAudit) {
  console.error("\nAUDIT STATUS: FAIL");
  process.exit(1);
} else {
  console.log("\nAUDIT STATUS: PASS");
  process.exit(0);
}
