#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

const SCAN_ROOTS = [
  "src/app",
  "src/components",
  "src/lib/infrastructure/seo",
  "src/lib/catalog",
  "src/lib/features",
  "src/lib/ui-shared",
];

const SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
]);

const TURKISH_UNICODE_RE = /[çğıİöşüÇĞÖŞ]/u;

const FORBIDDEN_VISIBLE_TOKENS = [
  "hesaplama",
  "hesaplama aracı",
  "aracı",
  "araç",
  "türkçe",
  "Türkçe",
];

const ALLOWED_FILES = new Set([
  "src/lib/i18n-stub.ts",
]);

// Directories with pre-existing Turkish content that require dedicated sessions
const EXCLUDED_DIR_PREFIXES = [
  "src/lib/features/assistant/",
  "src/lib/features/formula-governance/formula-source-audit-registry.ts",
  "src/lib/features/formula-governance/oracle/",
  "src/components/case-studies/",
];

function gitFiles() {
  const out = execFileSync("git", ["ls-files"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

  return out ? out.split("\n").map((line) => line.trim()).filter(Boolean) : [];
}

function shouldScan(file) {
  if (!SCAN_ROOTS.some((root) => file === root || file.startsWith(`${root}/`))) {
    return false;
  }

  if (ALLOWED_FILES.has(file)) return false;
  if (EXCLUDED_DIR_PREFIXES.some((prefix) => file.startsWith(prefix))) return false;
  if (file.includes("/__tests__/")) return false;
  if (file.includes("/test/")) return false;
  if (file.includes(".test.")) return false;
  if (file.includes(".spec.")) return false;

  return SCAN_EXTENSIONS.has(extname(file));
}

const failures = [];

for (const file of gitFiles().filter(shouldScan)) {
  const absolute = join(ROOT, file);
  if (!existsSync(absolute)) {
    // Deleted in working tree but still tracked until commit — skip.
    continue;
  }
  const text = readFileSync(absolute, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (TURKISH_UNICODE_RE.test(line)) {
      failures.push(`${file}:${index + 1}: Turkish Unicode character in public source: ${line.trim()}`);
    }

    for (const token of FORBIDDEN_VISIBLE_TOKENS) {
      if (line.includes(token)) {
        failures.push(`${file}:${index + 1}: forbidden Turkish/locale-visible token "${token}": ${line.trim()}`);
      }
    }
  });
}

if (failures.length > 0) {
  console.error("NO_TURKISH_PUBLIC_SOURCE_GUARD=FAIL");
  console.error(`failure_count=${failures.length}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("NO_TURKISH_PUBLIC_SOURCE_GUARD=PASS");
console.log("public_source_turkish_findings=0");
console.log("public_locale_branch_findings=0");
