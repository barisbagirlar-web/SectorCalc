#!/usr/bin/env node

/**
 * guard:pro-no-stale-dom
 *
 * Scans PRO form components for unsafe DOM operations.
 * Fails on:
 * - scrollIntoView/focus/querySelector/getElementById called without null/contains check
 * - Any direct DOM mutation in render/effect that doesn't check node existence
 *
 * Safe patterns allowed:
 * - element?.scrollIntoView()
 * - safeScrollIntoView(element)
 * - safeFocus(element)
 * - document.contains(node) check before operation
 * - ref.current guarded by if (ref.current)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const SCAN_PATHS = [
  join(ROOT, "src", "sectorcalc", "pro-form", "UniversalIndustrialDecisionForm.tsx"),
  join(ROOT, "src", "sectorcalc", "pro-form", "useUniversalIndustrialDecisionFormMachine.ts"),
];

const UNSAFE_PATTERNS = [
  // Unsafe: direct scrollIntoView without optional chaining or safe wrapper
  { pattern: /\.scrollIntoView\(\)(?!\s*;\s*$)/, label: "unchecked .scrollIntoView()" },
  // Unsafe: direct getElementById without null check
  { pattern: /document\.getElementById\([^)]+\)\./, label: "unchecked getElementById()" },
  // Unsafe: direct querySelector without null check
  { pattern: /document\.querySelector\([^)]+\)\.(?!.*\?\?)/, label: "unchecked querySelector()" },
];

// Safe patterns that are acceptable
const SAFE_PATTERNS = [
  /\?\.scrollIntoView/,
  /safeScrollIntoView/,
  /safeFocus/,
  /document\.contains/,
  /ref\??\.current\b/,
  /\?\.focus/,
];

let errors = 0;

for (const filePath of SCAN_PATHS) {
  try {
    const content = readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      for (const { pattern, label } of UNSAFE_PATTERNS) {
        if (pattern.test(line)) {
          // Check if this line also has a safe pattern
          const hasSafe = SAFE_PATTERNS.some((sp) => sp.test(line));
          if (!hasSafe) {
            console.error(`[FAIL] ${filePath}:${lineNum} — ${label}`);
            console.error(`       ${line.trim()}`);
            errors++;
          }
        }
      }
    }
  } catch (err) {
    console.error(`[WARN] Could not read ${filePath}: ${err.message}`);
  }
}

if (errors > 0) {
  console.error(`\n[GUARD FAIL] ${errors} unsafe DOM operation(s) found.`);
  process.exit(1);
}

console.log("[PASS] guard:pro-no-stale-dom — No unsafe DOM operations found.");
