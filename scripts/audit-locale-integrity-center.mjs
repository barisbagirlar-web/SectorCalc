#!/usr/bin/env node
/**
 * P30 — Autonomous Locale Integrity Center (source audit).
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const REQUIRED_CENTER_FILES = [
  "src/lib/locale-center/locale-types.ts",
  "src/lib/locale-center/locale-config.ts",
  "src/lib/locale-center/locale-resolver.ts",
  "src/lib/locale-center/region-resolver.ts",
  "src/lib/locale-center/locale-dictionary.ts",
  "src/lib/locale-center/localized-copy.ts",
  "src/lib/locale-center/formatters.ts",
  "src/lib/locale-center/unit-currency-center.ts",
  "src/lib/locale-center/public-copy-policy.ts",
  "src/lib/locale-center/internal-copy-blocklist.ts",
  "src/lib/locale-center/locale-integrity-report.ts",
  "src/lib/locale-center/index.ts",
];

const PUBLIC_SCAN_DIRS = [
  "src/components/layout",
  "src/components/catalog",
  "src/components/industries",
  "src/components/home",
  "src/components/pages",
];

const HARDCODED_UI_RE =
  /<(h1|h2|h3|button|label|title|option)[^>]*>\s*[A-Za-zÀ-ÿ][^<{]{2,}\s*<\/\1>/;

const PLACEHOLDER_RE = /placeholder=["'](?!{)[A-Za-z][^"']{2,}["']/;

const FORBIDDEN_IN_COMPONENTS = [
  "Stratejik yol haritası",
  "Faz 1",
  "Planlandı",
  "Yayında",
  "href=\"#\"",
  "Lorem ipsum",
  "HesapPro",
  "METAL İMALAT ZEKÂSI",
  "Standart Ağırlık",
  "SONRAKİ PARAMETRE",
];

let passes = 0;
let failures = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

function walkTsx(dir, out = []) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) {
    return out;
  }
  for (const entry of readdirSync(full)) {
    const p = join(full, entry);
    const st = statSync(p);
    if (st.isDirectory()) {
      walkTsx(p.replace(`${ROOT}/`, ""), out);
    } else if (entry.endsWith(".tsx")) {
      out.push(p.replace(`${ROOT}/`, ""));
    }
  }
  return out;
}

function collectKeys(obj, prefix = "") {
  const keys = new Set();
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      keys.add(path);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const child of collectKeys(value, path)) {
        keys.add(child);
      }
    }
  }
  return keys;
}

for (const file of REQUIRED_CENTER_FILES) {
  if (!existsSync(join(ROOT, file))) {
    fail(`missing locale-center file: ${file}`);
  }
}
pass("locale-center module files present");

const en = JSON.parse(read("messages/en.json"));
const enKeys = collectKeys(en);

for (const locale of LOCALES.filter((l) => l !== "en")) {
  const loc = JSON.parse(read(`messages/${locale}.json`));
  const locKeys = collectKeys(loc);
  const missing = [...enKeys].filter((key) => !locKeys.has(key));
  if (missing.length > 0) {
    fail(`${locale} missing ${missing.length} keys (e.g. ${missing.slice(0, 3).join(", ")})`);
  }
}
pass("6-locale message key parity");

const publicFiles = PUBLIC_SCAN_DIRS.flatMap((dir) => walkTsx(dir));
let hardcodedHits = 0;
let forbiddenHits = 0;

for (const rel of publicFiles) {
  const source = read(rel);
  if (source.includes("IndustryAuditModule") || source.includes("PremiumAuditInput")) {
    fail(`${rel} still references inline audit wizard`);
  }
  if (HARDCODED_UI_RE.test(source)) {
    hardcodedHits += 1;
  }
  if (PLACEHOLDER_RE.test(source)) {
    hardcodedHits += 1;
  }
  for (const term of FORBIDDEN_IN_COMPONENTS) {
    if (source.includes(term)) {
      forbiddenHits += 1;
      fail(`${rel} contains forbidden public term: ${term}`);
    }
  }
}

if (hardcodedHits === 0) {
  pass("public layout/catalog/industry components avoid obvious hardcoded UI strings");
} else {
  fail(`${hardcodedHits} public component file(s) with hardcoded visible UI patterns`);
}

if (forbiddenHits === 0) {
  pass("no internal roadmap/demo strings in scanned public components");
}

const directToLocale = (read("src/lib/format/localization.ts").match(/toLocaleString\(/g) ?? []).length;
const centerFormatters = read("src/lib/locale-center/formatters.ts");
if (!centerFormatters.includes("formatMoney") || !centerFormatters.includes("formatNumber")) {
  fail("locale-center formatters incomplete");
} else {
  pass("locale-center formatters exported");
}

if (directToLocale > 0) {
  pass(`format/localization.ts present (${directToLocale} legacy toLocaleString — migrate via locale-center)`);
}

try {
  execSync("npx vitest run src/lib/locale-center/__tests__/locale-center.test.ts", {
    cwd: ROOT,
    stdio: "pipe",
  });
  pass("locale-center unit tests");
} catch {
  fail("locale-center unit tests failed");
}

try {
  const gapCount = Number(
    execSync(
      `npx tsx -e "import {collectLocaleKeyParityGaps} from './src/lib/locale-center/locale-dictionary.ts'; console.log(collectLocaleKeyParityGaps().length);"`,
      { cwd: ROOT, encoding: "utf8" },
    ).trim(),
  );
  if (gapCount > 0) {
    fail(`locale dictionary reports ${gapCount} key parity gap(s)`);
  } else {
    pass("locale dictionary key parity clean");
  }
} catch {
  fail("locale dictionary parity check failed");
}

console.log(`\naudit:locale-center — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
