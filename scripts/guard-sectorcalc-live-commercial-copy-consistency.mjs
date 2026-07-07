#!/usr/bin/env node
// guard-sectorcalc-live-commercial-copy-consistency.mjs
// Scans active public source files for stale MVP/payment-not-live copy.
// Excludes backup, quarantine, archive, node_modules, .next, generated backup folders.
// Fails if visible phrases indicate the product is still in pre-launch state.

import { readFileSync, existsSync, statSync, readdirSync } from "fs";
import { resolve, dirname, relative, join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Forbidden phrases (visible public copy only)
const FORBIDDEN_PHRASES = [
  { phrase: "Payment and file export unlock in a future release", severity: "FAIL" },
  { phrase: "payment is not live yet", severity: "FAIL" },
  { phrase: "export is preview-only", severity: "FAIL" },
  { phrase: "lead intent today", severity: "FAIL" },
  { phrase: "MVP", severity: "WARN" },
  { phrase: "Minimum Viable Product", severity: "WARN" },
];

// Directories to scan
const SCAN_DIRS = [
  "src/app",
  "src/components",
  "src/lib",
  "src/sectorcalc",
];

// Extensions to scan
const SCAN_EXTS = [".tsx", ".ts", ".jsx", ".js", ".json"];

// Exclude patterns (substring match in path)
const EXCLUDE_PATTERNS = [
  "node_modules",
  ".next",
  "__tests__",
  "generated",
  "backup",
  "quarantine",
  "archive",
  ".firebase",
  "pro_tools_baris_",
];

let failures = 0;
let warnings = 0;
let blockers = [];

function fail(msg) { console.error(`  ❌ FAIL: ${msg}`); failures++; blockers.push(msg); }
function warn(msg) { console.log(`  ⚠ WARN: ${msg}`); warnings++; }
function pass(msg) { console.log(`  ✅ PASS: ${msg}`); }

console.log("\n" + "═".repeat(60));
console.log("  SECTORCALC — LIVE COMMERCIAL COPY CONSISTENCY");
console.log("═".repeat(60) + "\n");

function shouldExclude(filePath) {
  const rel = relative(ROOT, filePath);
  return EXCLUDE_PATTERNS.some(p => rel.includes(p));
}

function getFiles(dir) {
  const results = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDE_PATTERNS.some(p => fullPath.includes(p))) {
          results.push(...getFiles(fullPath));
        }
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if (SCAN_EXTS.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  } catch (e) {
    // skip inaccessible
  }
  return results;
}

let totalFiles = 0;
let matches = [];

for (const scanDir of SCAN_DIRS) {
  const fullScanDir = resolve(ROOT, scanDir);
  if (!existsSync(fullScanDir)) continue;
  const files = getFiles(fullScanDir);
  totalFiles += files.length;

  for (const file of files) {
    try {
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (const { phrase, severity } of FORBIDDEN_PHRASES) {
        // Check if it's in public visible context:
        // - Not in comments that are clearly internal
        // - In JSX text, string literals visible to users
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes(phrase)) {
            // Skip if in a single-line comment (//)
            const trimmed = line.trimStart();
            if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;

            // Check if it's in JSX or a string that would be rendered publicly
            const relPath = relative(ROOT, file);
            matches.push({ phrase, severity, file: relPath, line: i + 1, content: line.trim() });
          }
        }
      }
    } catch (e) {
      // skip unreadable
    }
  }
}

console.log(`  Scanned ${totalFiles} files across ${SCAN_DIRS.length} source directories.\n`);

if (matches.length === 0) {
  pass("No stale MVP/payment-not-live copy found in active source files");
} else {
  for (const m of matches) {
    const icon = m.severity === "FAIL" ? "❌ FAIL" : "⚠ WARN";
    const msg = `${m.file}:${m.line}: "${m.phrase}" found — "${m.content}"`;
    if (m.severity === "FAIL") fail(msg);
    else warn(msg);
  }
}

console.log("\n" + "─".repeat(60));

if (failures === 0) {
  console.log(`\n  COMMERCIAL_COPY_CONSISTENCY=${warnings > 0 ? "PASS_WITH_WARNINGS" : "PASS"}`);
  console.log(`  Files scanned: ${totalFiles}`);
  console.log(`  Violations: ${failures}`);
  console.log(`  Warnings: ${warnings}`);
  console.log(`  BLOCKERS=NONE`);
  console.log("\n" + "═".repeat(60) + "\n");
  process.exit(0);
} else {
  console.log(`\n  COMMERCIAL_COPY_CONSISTENCY=FAIL`);
  console.log(`  Files scanned: ${totalFiles}`);
  console.log(`  Violations: ${failures}`);
  console.log(`  Warnings: ${warnings}`);
  console.log(`  BLOCKERS:`);
  for (const b of blockers) {
    console.log(`    - ${b}`);
  }
  console.log("\n" + "═".repeat(60) + "\n");
  process.exit(1);
}
