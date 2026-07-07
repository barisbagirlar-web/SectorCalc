#!/usr/bin/env node
/**
 * guard-sectorcalc-non-english-visible-text.mjs
 *
 * Fails if:
 * - public UI contains Turkish visible text
 * - public UI contains mixed-language tool titles
 * - public metadata contains Turkish
 * - public JSON-LD contains Turkish
 * - public route labels contain Turkish
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const turkishWords = [
  "analizi", "analiz", "donusturucu", "dönüştürücü",
  "imalat", "uretim", "uretim", "atolye", "atölye",
  "tamir", "bakim", "bakım", "guvenilirlik", "güvenilirlik",
  "tasarim", "tasarım", "makine", "insaat", "inşaat",
  "yapi", "yapı", "enerji", "surdurulebilirlik", "sürdürülebilirlik",
  "lojistik", "tedarik", "zinciri", "maliyet", "butceleme", "bütçeleme",
  "proje", "yatirim", "yatırım", "diger", "diğer",
  "perakende", "muhasebe", "finans", "sevkiyat", "kargo",
  "hesap", "makinesi", "ucretsiz", "ücretsiz", "araclari", "araçları",
  "vitrini", "dizini", "haritasi", "haritası",
  "gelistirici", "geliştirici",
];

const filesToCheck = [
  resolve(root, "src/components/landing/LandingPageContent.tsx"),
  resolve(root, "src/app/page.tsx"),
  resolve(root, "src/lib/features/semantic/build-home-jsonld.ts"),
  resolve(root, "src/components/layout/SiteHeader.tsx"),
  resolve(root, "src/components/layout/EnterpriseFooter.tsx"),
];

let errors = [];

for (const f of filesToCheck) {
  let content;
  try {
    content = readFileSync(f, "utf8");
  } catch {
    errors.push(`FILE_NOT_FOUND: ${f}`);
    continue;
  }

  for (const tw of turkishWords) {
    // Case-insensitive check on the file content
    const regex = new RegExp(`\\b${tw}\\b`, "i");
    if (regex.test(content)) {
      errors.push(`TURKISH_TEXT: "${tw}" found in ${f}`);
    }
  }
}

if (errors.length > 0) {
  console.error("NON-ENGLISH TEXT GUARD FAILED:");
  for (const e of errors) {
    console.error(`  ❌ ${e}`);
  }
  process.exit(1);
} else {
  console.log("✅ NON-ENGLISH TEXT GUARD PASSED");
}
