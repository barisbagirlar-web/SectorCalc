#!/usr/bin/env node
/**
 * guard-english-only-codebase.mjs
 *
 * Fails if any Turkish characters or visible Turkish words are found
 * in newly added CBAM, middleware, scripts, tests, data, and Baris-related code.
 *
 * Allowed:
 * - official source URLs
 * - proper nouns
 * - SHA hashes
 * - technical identifiers
 * - regex patterns that define Turkish character detection (legitimate test code)
 * - pre-existing code outside the CBAM scope
 *
 * Scope: all new/modified files from the CBAM final patch.
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// New files from the CBAM final patch — exact paths
const CBAM_FILES = [
  "src/sectorcalc/cbam/cbam-official-source-registry.ts",
  "src/sectorcalc/cbam/cbam-verified-config.ts",
  "src/app/api/cbam/report/route.ts",
  "src/middleware.ts",
  "data/cbam/certificate-price-policy.json",
  "data/cbam/official-sources/cbam-source-lock.json",
  "scripts/guard-cbam-final-lock.mjs",
  "scripts/guard-no-rsc-rate-limit.mjs",
  "scripts/ingest-cbam-official-sources.mjs",
  "scripts/smoke-cbam-live-final.mjs",
  "tests/cbam/cbam-config-lock.test.ts",
  "tests/cbam/cbam-paid-report-unlock-gate.test.ts",
  "tests/cbam/cbam-rsc-no-429.test.ts",
  "tests/cbam/service-page-copy.test.ts",
  "tests/cbam/billing-package.test.ts",
  "tests/cbam/insufficient-account-credits.test.ts",
  "tests/cbam/report-idempotency.test.ts",
  "tests/cbam/report-no-consume-on-block.test.ts",
  "tests/golden/cbam/engine.golden.json",
  "tests/golden/cbam/audit-seal.hash",
];

// Turkish visible characters
const TURKISH_CHARS_REGEX = /[çğıöşüÇĞİÖŞÜ]/;

// Turkish visible words
const TURKISH_WORDS_REGEX = /\b(ve|veya|için|uyarı|hata|başarılı|başarısız|kaynak|rapor|hesaplama|doğrulama|kilit|engel|ödeme|canlı|araç|dosya|kullanıcı|girdi|çıktı|geçti|kaldı|değer|başlangıç|bitiş|sonuç|sıcaklık|basınç|akım|gerilim|güç|enerji|kuvvet|maliyet|gelir|gider|kar|zarar|tutar|malzeme|işçilik|üretim|kalite|kontrol|arıza|duruş|güncel|mevcut|temel|yeni|eski|kayıt|işlem|onay|durum)\b/i;

let violations = 0;
let filesChecked = 0;

for (const relPath of CBAM_FILES) {
  const fullPath = join(ROOT, relPath);
  let content;
  try {
    content = readFileSync(fullPath, "utf-8");
  } catch {
    console.log(`  SKIP: ${relPath} — not found`);
    continue;
  }
  filesChecked++;
  const lines = content.split("\n");

  // Check Turkish characters
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (TURKISH_CHARS_REGEX.test(line)) {
      const trimmed = line.trim();
      // Skip regex pattern definitions (legitimate test code)
      if (
        trimmed.startsWith("const TURKISH_CHARS") ||
        trimmed.startsWith("const TURKISH_PATTERN") ||
        trimmed.startsWith("const SHORT_TURKISH_TERMS") ||
        trimmed.startsWith("// TURKISH_CHARS") ||
        trimmed.startsWith("TURKISH_CHARS_REGEX")
      ) {
        continue;
      }
      console.error(`  ❌ TURKISH_CHAR: ${relPath}:${i + 1} — ${line.slice(0, 120)}`);
      violations++;
    }
  }

  // Check Turkish words
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (
      trimmed.startsWith("const TURKISH_CHARS") ||
      trimmed.startsWith("const TURKISH_PATTERN") ||
      trimmed.startsWith("const SHORT_TURKISH_TERMS") ||
      trimmed.startsWith("// TURKISH_CHARS") ||
      trimmed.startsWith("TURKISH_CHARS_REGEX") ||
      trimmed.startsWith("TURKISH_WORDS_REGEX")
    ) {
      continue;
    }

    const match = trimmed.match(TURKISH_WORDS_REGEX);
    if (match) {
      console.error(`  ❌ TURKISH_WORD: ${relPath}:${i + 1} — "${match[0]}" in: ${line.slice(0, 120)}`);
      violations++;
    }
  }
}

// Summary
console.log(`\n📊 Results:`);
console.log(`  Files scanned: ${filesChecked}`);
console.log(`  Violations: ${violations}`);

if (violations > 0) {
  console.log("❌ ENGLISH_ONLY_CODEBASE_GUARD=FAIL");
  process.exit(1);
}
console.log("✅ ENGLISH_ONLY_CODEBASE_GUARD=PASS");
