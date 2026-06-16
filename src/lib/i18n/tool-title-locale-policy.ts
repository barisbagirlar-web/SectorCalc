import type { SupportedLocale } from "@/lib/i18n/locale-config";

export const TOOL_TITLE_LOCALES = ["en", "tr", "de", "fr", "es", "ar"] as const;
export type ToolTitleLocale = (typeof TOOL_TITLE_LOCALES)[number];

const TOOL_TYPE_SUFFIX_EN =
  /\b(calculator|converter|optimizer|analyz(?:er|er)|estimator|checker|verdict|simulator|predictor|assessment|detector|comparator|report|tracker|balancer|prioritizer|function|converter)\b/i;

/** Locale-specific markers that a tool title is localized (not raw EN). */
export const TOOL_TITLE_LOCALE_MARKERS: Record<ToolTitleLocale, readonly RegExp[]> = {
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

export function humanizeToolSlug(slug: string): string {
  return slug
    .replace(/-calculator$/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function resolveSchemaEnglishTitle(
  slug: string,
  raw: { readonly title?: string; readonly toolName?: string },
): string {
  const fromTitle = raw.title?.trim();
  if (fromTitle && fromTitle.length > 2) {
    return normalizeEnglishToolTitle(fromTitle);
  }
  const fromToolName = raw.toolName?.trim();
  if (fromToolName && fromToolName !== slug && !fromToolName.includes("-")) {
    return normalizeEnglishToolTitle(fromToolName);
  }
  const base = slug.replace(/-calculator$/i, "");
  const typeMatch = base.match(
    /-(converter|optimizer|analyzer|analyser|estimator|checker|verdict|simulator|predictor|detector|comparator|report|tracker|balancer|prioritizer|function)$/i,
  );
  if (typeMatch?.[1]) {
    const stem = base.slice(0, -(typeMatch[1].length + 1));
    const typeLabel =
      typeMatch[1].charAt(0).toUpperCase() + typeMatch[1].slice(1).toLowerCase();
    const stemHumanized = stem
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
    return `${stemHumanized} ${typeLabel}`;
  }
  return `${humanizeToolSlug(slug)} Calculator`;
}

export function normalizeEnglishToolTitle(title: string): string {
  const collapsed = title.replace(/\s+/g, " ").trim();
  if (!collapsed) {
    return collapsed;
  }
  if (TOOL_TYPE_SUFFIX_EN.test(collapsed)) {
    return collapsed;
  }
  if (/\bcalculator\b/i.test(collapsed)) {
    return collapsed;
  }
  return `${collapsed} Calculator`;
}

export function isLocalizedToolTitle(title: string, locale: ToolTitleLocale): boolean {
  const value = title.trim();
  if (!value) {
    return false;
  }
  if (locale === "en") {
    return true;
  }
  return TOOL_TITLE_LOCALE_MARKERS[locale].some((pattern) => pattern.test(value));
}

export function titleNeedsLocaleTranslation(
  entry: Partial<Record<ToolTitleLocale, string>> | undefined,
  locale: ToolTitleLocale,
  english: string,
): boolean {
  const value = entry?.[locale]?.trim();
  if (!value) {
    return true;
  }
  if (locale !== "en" && value === english.trim()) {
    return true;
  }
  return !isLocalizedToolTitle(value, locale);
}

export function sortToolTitleLocales(): ToolTitleLocale[] {
  return [...TOOL_TITLE_LOCALES];
}
