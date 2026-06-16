#!/usr/bin/env node
/**
 * Audit: every schema slug must have localized titles in en/tr/de/fr/es/ar.
 * Markers kept in sync with src/lib/i18n/tool-title-locale-policy.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const TITLES_PATH = join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const MARKERS = {
  en: [/[A-Za-z]/],
  tr: [
    /[çğıöşüÇĞİÖŞÜ]/,
    /\b(hesap|hesapla|hesaplay|hesaplama|dönüştür|analiz|optimiz|dengeley|karşılaştır|tahmin|simül|kontrol|değerlendir|tespit|izleme|rapor|maliyet|oran|aracı|hesaplayıcı|dönüştürücü|dengeleyici|optimize|teklif|temizlik|kimyasal|denklem)\b/i,
  ],
  de: [
    /[äöüßÄÖÜ]/,
    /\b(rechner|umrechner|analys|optimier|vergleichs?|simulator|schätz|prüf|bewert|detektor|bericht|tracker|kosten|berechn|gleichung|ausgleich|engpass|verlust|prioris|reinigung|angebot|ernte|manuelle|arbeit|cobot|leasing|kauf)\b/i,
  ],
  fr: [
    /[àâçéèêëîïôùûü]/i,
    /\b(calculateur|convertisseur|analys|optimis|compar|simulateur|estimat|vérifi|équilibr|détect|coût|perte|matrice|devis|nettoyage|changement|cobot|travail|rendement|culture)\b/i,
  ],
  es: [
    /[áéíóúñü]/i,
    /\b(calculadora|convertidor|analis|optimiz|compar|simulador|estim|verific|equilib|detect|costo|pérdida|cumplimiento|presupuesto|limpieza|veredicto|cambio|matriz|cobot|trabajo|rendimiento|cultivo)\b/i,
  ],
  ar: [/[\u0600-\u06FF]/],
};

function isLocalized(value, locale) {
  if (locale === "en") {
    return Boolean(value?.trim());
  }
  if (!value?.trim()) {
    return false;
  }
  return MARKERS[locale]?.some((re) => re.test(value)) ?? false;
}

function main() {
  if (!existsSync(TITLES_PATH)) {
    console.error("audit:generated-tool-titles FAIL — titles bundle missing");
    process.exit(1);
  }

  const titles = JSON.parse(readFileSync(TITLES_PATH, "utf8"));
  const slugs = readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => name.replace(/-schema\.json$/, ""));

  const offenders = [];
  for (const slug of slugs) {
    const entry = titles[slug];
    const en = entry?.en?.trim() ?? "";
    if (!en) {
      offenders.push({ slug, locale: "en", reason: "missing" });
      continue;
    }
    for (const locale of LOCALES) {
      if (locale === "en") {
        continue;
      }
      const value = entry?.[locale]?.trim() ?? "";
      if (!value) {
        offenders.push({ slug, locale, reason: "missing" });
      } else if (value === en) {
        offenders.push({ slug, locale, reason: "en-identical" });
      } else if (!isLocalized(value, locale)) {
        offenders.push({ slug, locale, reason: "not-localized" });
      }
    }
  }

  if (offenders.length > 0) {
    console.error(
      `audit:generated-tool-titles FAIL — ${offenders.length} issue(s) across ${slugs.length} tools`,
    );
    for (const item of offenders.slice(0, 40)) {
      console.error(`  ${item.slug} [${item.locale}] ${item.reason}`);
    }
    process.exit(1);
  }

  console.log(`audit:generated-tool-titles PASS (${slugs.length} tools × ${LOCALES.length} locales)`);
}

main();
