#!/usr/bin/env node
/**
 * check-no-turkish-ui-strings — permanent gate against Turkish UI strings
 *
 * Fails with exit code 1 if any Turkish confidence-label values or
 * user-facing Turkish strings are found in source or data.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = new URL("..", import.meta.url).pathname;

const TURKISH_PATTERNS = [
  '"confidence_label": "KESİN"',
  '"confidence_label": "GÜÇLÜ"',
  '"confidence_label": "ORTA"',
  '"confidence_label": "VARSAYIM"',
];

const TURKISH_WORDS = [
  "KESİN",
  "GÜÇLÜ",
  "ORTA",
  "VARSAYIM",
];

function walkDir(dir, callback) {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      walkDir(p, callback);
    } else if (e.isFile() && /\.(tsx|ts|jsx|js|mjs)$/.test(e.name)) {
      callback(p);
    }
  }
}

let errors = [];

// ── Check JSON data files ──────────────────────────────────────────────
const dataDir = join(ROOT, "data/pro-tools");
if (existsSync(dataDir)) {
  const jsonFiles = readdirSync(dataDir).filter(f => f.endsWith(".json") && f !== "_merged.json");
  for (const f of jsonFiles) {
    const fp = join(dataDir, f);
    const content = readFileSync(fp, "utf-8");
    for (const pat of TURKISH_PATTERNS) {
      if (content.includes(pat)) {
        errors.push(`  ${fp}: contains ${pat}`);
      }
    }
  }
}

// ── Check source files ─────────────────────────────────────────────────
const srcDirs = ["src/components", "src/lib/tool-schemas", "src/data"];
for (const dir of srcDirs) {
  walkDir(join(ROOT, dir), (fp) => {
    const content = readFileSync(fp, "utf-8");
    for (const tw of TURKISH_WORDS) {
      if (content.includes(`"${tw}"`) && !content.includes("toUpperCase") && !content.includes("startsWith")) {
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(`"${tw}"`)) {
            const relativePath = fp.replace(ROOT, "");
            errors.push(`  ${relativePath}:${i + 1} — ${lines[i].trim()}`);
          }
        }
      }
    }
  });
}

if (errors.length > 0) {
  console.error("\n❌ TURKISH UI STRINGS DETECTED — BUILD BLOCKED");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  for (const e of errors) {
    console.error(e);
  }
  console.error("\nRemove all Turkish strings before building.\n");
  process.exit(1);
} else {
  console.log("✓ No Turkish UI strings found.");
  process.exit(0);
}
