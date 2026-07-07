#!/usr/bin/env node
/**
 * guard-sectorcalc-claim-safety.mjs
 *
 * Fails if:
 * - audit-proof appears in public code
 * - TÜV certified appears
 * - certified compliance appears
 * - legal proof appears
 * - guaranteed approval appears
 * - authority approved appears
 * - engineering authority appears
 * - replacement of professional engineer appears
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const forbiddenPatterns = [
  "audit-proof",
  "TÜV certified",
  "TUV certified",
  "certified compliance",
  "legal proof",
  "guaranteed approval",
  "authority approved",
  "engineering authority",
  "replacement of professional engineer",
  "replacement for professional engineer",
];

const paths = [
  "src/components/landing",
  "src/components/layout",
  "src/app/page.tsx",
  "src/lib/features/semantic",
  "src/styles",
];

let errors = [];

function readdirRecursive(dir) {
  const entries = [];
  try {
    const list = readdirSync(dir);
    for (const entry of list) {
      const fullPath = resolve(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        entries.push(...readdirRecursive(fullPath));
      } else {
        entries.push(fullPath);
      }
    }
  } catch {}
  return entries;
}

for (const dir of paths) {
  const base = resolve(root, dir);
  if (!existsSync(base)) continue;

  const entries = readdirRecursive(base);
  for (const filePath of entries) {
    if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts") && !filePath.endsWith(".css")) continue;
    let content;
    try {
      content = readFileSync(filePath, "utf8");
    } catch {
      continue;
    }

    for (const pattern of forbiddenPatterns) {
      if (content.toLowerCase().includes(pattern.toLowerCase())) {
        errors.push(`FORBIDDEN_CLAIM: "${pattern}" found in ${filePath}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("CLAIM SAFETY GUARD FAILED:");
  for (const e of errors) {
    console.error(`  ❌ ${e}`);
  }
  process.exit(1);
} else {
  console.log("✅ CLAIM SAFETY GUARD PASSED");
}
