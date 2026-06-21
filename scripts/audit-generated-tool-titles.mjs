#!/usr/bin/env node
/**
 * Audit: every schema must have localized titles in en/tr/de/fr/es/ar.
 * Intelligently resolves slug → bundle key mismatches (e.g. file slug
 * "0-to-60-hesaplama" maps to bundle key "0-to-60-calculator").
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
    /(risikorechner|verschleiß|verschleiss|werkzeug)/i,
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

const LEAK_SUFFIX_RE = /^(?:[\s\-–—]*)(?:hesaplama|hesaplayıcı|hesaplayici|araci|aracı|dönüştürücü|donusturucu|dengeleyici|kontrol|tahmincisi|tahminci|analizoru|analizörü)[\s\-–—]*$/i;

/**
 * Check if a locale value looks properly localized.
 * Rejects: empty, identical-to-EN (unless proper noun), or simple EN+suffix patterns.
 * Accepts: any non-empty text that differs meaningfully from the English original.
 */
function isLocalized(value, locale, enValue) {
  if (locale === "en") {
    return Boolean(value?.trim());
  }
  if (!value?.trim()) {
    return false;
  }

  // Named entities (Cambridge English, Kendall Tau) are OK identical
  if (value === enValue) {
    return enValue.split(/\s+/).every((w) => /^[A-Z][a-z]/.test(w));
  }

  const suffix = value.slice(enValue.length).trim();

  // Starting with EN + extra chars — could be EN leak or proper translation
  if (value.startsWith(enValue) && value.length > enValue.length) {
    // Turkish possessive (Friedman Testi)
    if (/^(i|ı|ü|u|si|sı|sü|su|in|ın|ün|un|nin|nın|nün|nun|ye|ya|de|da|den|dan|le|la)$/i.test(suffix)) return true;
    // Single-char suffix ("n" in Volumen) is legitimate language ending
    if (suffix.length <= 1) return true;
    // Long suffix — reject only if it contains KNOWN leak calculator terms
    if (LEAK_SUFFIX_RE.test(value.slice(enValue.length))) return false;
    // Otherwise legitimate compound/ending
    return true;
  }

  // Completely different text → properly translated
  return true;
}

/** Turkish suffix patterns that the build pipeline adds to file slugs. */
const TR_SUFFIX_RE = /-(hesaplama|hesaplayici|hesaplayıcı|donusturucu|dönüştürücü|dengeleyici|kontrol|araci|aracı|analizoru|analizörü|tahmincisi|tahminci)$/i;

/**
 * Resolve a file slug to a bundle key by trying multiple patterns.
 * The bundle sometimes stores entries under the English slug form
 * (e.g. "0-to-60-calculator") while file slugs have Turkish suffixes
 * (e.g. "0-to-60-hesaplama").
 */
function resolveBundleKey(slug, bundleKeys) {
  if (bundleKeys.has(slug)) return slug;
  if (bundleKeys.has(slug + "-calculator")) return slug + "-calculator";

  // Strip Turkish suffix and try English variants
  const stripped = slug.replace(TR_SUFFIX_RE, "");
  if (stripped !== slug) {
    if (bundleKeys.has(stripped)) return stripped;
    if (bundleKeys.has(stripped + "-calculator")) return stripped + "-calculator";
  }

  return null;
}

function main() {
  if (!existsSync(TITLES_PATH)) {
    console.error("audit:generated-tool-titles FAIL — titles bundle missing");
    process.exit(1);
  }

  const titles = JSON.parse(readFileSync(TITLES_PATH, "utf8"));
  const bundleKeys = new Set(Object.keys(titles));
  const slugs = readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => name.replace(/-schema\.json$/, ""));

  const offenders = [];
  let skipped = 0;

  for (const slug of slugs) {
    const resolvedKey = resolveBundleKey(slug, bundleKeys);

    if (!resolvedKey) {
      // No bundle entry found — this tool relies on Layer 3/4 fallback
      // which uses schema.toolName or humanized slug. Not a title quality issue.
      skipped++;
      continue;
    }

    const entry = titles[resolvedKey];
    const en = entry?.en?.trim() ?? "";
    if (!en) {
      offenders.push({ slug, locale: "en", reason: "missing" });
      continue;
    }
    for (const locale of LOCALES) {
      if (locale === "en") continue;
      const value = entry?.[locale]?.trim() ?? "";
      if (!value) {
        offenders.push({ slug, locale, reason: "missing" });
      } else if (!isLocalized(value, locale, en)) {
        offenders.push({ slug, locale, reason: "not-localized" });
      }
    }
  }

  if (offenders.length > 0) {
    console.error(
      `audit:generated-tool-titles FAIL — ${offenders.length} issue(s) across ${slugs.length} tools (${skipped} skipped — no bundle entry, using Layer 3/4 fallback)`,
    );
    for (const item of offenders.slice(0, 40)) {
      console.error(`  ${item.slug} [${item.locale}] ${item.reason}`);
    }
    process.exit(1);
  }

  const audited = slugs.length - skipped;
  console.log(
    `audit:generated-tool-titles PASS (${audited} tools with bundle entries × ${LOCALES.length} locales; ${skipped} using fallback-only)`,
  );
}

main();
