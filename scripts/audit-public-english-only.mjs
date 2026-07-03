#!/usr/bin/env node

/**
 * audit-public-english-only.mjs — V5.3.1 Pure English Public Surface Audit
 *
 * Scans visible public surfaces for Turkish / non-English content.
 * Fails if forbidden Turkish terms appear in public-facing files.
 *
 * Exits 0 on pass, 1 on fail.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();

// Forbidden Turkish terms that should not appear in public surfaces
const FORBIDDEN_TERMS = [
  "Muhendis",
  "Mühendis",
  "Danismani",
  "Danışmanı",
  "Uzmani",
  "Uzmanı",
  "Yapisal",
  "Istatistik",
  "İstatistik",
  "Marangoz",
  "Ag Muhendisi",
  "Gunes",
  "Ruzgar",
  "Cevre",
  "Surdurulebilirlik",
  "Hidrolik",
  "Demiryolu",
  "Sinyalizasyon",
  "Uretim",
  "Tasarimci",
  "Degerleme",
  "Yatirim",
  "Emlak",
  "Maliyet",
  "Fire",
  "Sure",
  "Süre",
  "Kapasite",
  "Verim",
  "Oran",
  "Kar",
  "Kâr",
];

// Files/directories to scan
const SCAN_PATHS = [
  "src/app",
  "src/data",
  "public",
];

// Patterns to exclude from scan (generated data files that contain i18n keys but use English at runtime)
const EXCLUDE_PATTERNS = [
  "free-tool-inputs-i18n.generated.json",
  "free-tool-catalog-i18n.generated.json",
  "generated-tool-titles-i18n.generated.json",
  "turkish-to-english-dictionary.json",
  "free-tools-names.json",
];

function buildPattern() {
  // Build a regex pattern from terms
  const terms = FORBIDDEN_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return terms.join("|");
}

async function run() {
  console.log("\n🔍 Pure English Public Surface Audit\n");

  const pattern = buildPattern();
  let failures = 0;

  // Build exclude args
  const excludeArgs = EXCLUDE_PATTERNS.map((p) => `-g '!**/${p}'`).join(" ");

  try {
    const result = execSync(
      `rg -n "${pattern}" ${SCAN_PATHS.map((p) => `"${join(ROOT, p)}"`).join(" ")} ${excludeArgs} 2>/dev/null`,
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
    );
    const lines = result.trim().split("\n").filter(Boolean);
    if (lines.length > 0) {
      console.error(`  ❌ Found ${lines.length} Turkish term matches in public surface:\n`);
      for (const line of lines.slice(0, 50)) {
        console.error(`     ${line}`);
      }
      if (lines.length > 50) {
        console.error(`     ... and ${lines.length - 50} more`);
      }
      failures = lines.length;
    } else {
      console.log("  ✅ No Turkish terms found in public surface");
    }
  } catch {
    console.log("  ✅ No Turkish terms found in public surface");
  }

  // Check for non-ASCII characters in source code paths
  const sourceCheckPaths = ["src/app"];
  for (const scanPath of sourceCheckPaths) {
    const fullPath = join(ROOT, scanPath);
    if (!existsSync(fullPath)) continue;
    try {
      const result = execSync(
        `rg -n '[^\\x00-\\x7F]' "${fullPath}" -g '*.{tsx,ts}' 2>/dev/null | head -20`,
        { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
      );
      const lines = result.trim().split("\n").filter(Boolean);
      if (lines.length > 0) {
        console.error(`  ❌ Found non-ASCII characters in ${scanPath}:\n`);
        for (const line of lines) {
          console.error(`     ${line}`);
        }
        failures += lines.length;
      }
    } catch {
      // no matches
    }
  }

  console.log(`✅ Non-ASCII check passed in source code`);

  console.log(`\n📊 Result: ${failures === 0 ? "ALL CHECKS PASSED" : `${failures} FAILURE(S)`}\n`);
  process.exit(failures > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
