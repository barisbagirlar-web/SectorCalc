/**
 * Active locale definitions - single source of truth for routing, formatting, and UI.
 *
 * Two concepts:
 *   SUPPORTED_LOCALES — locales the app actually renders (EN only for now).
 *   HREFLANG_LOCALES   — locales used for hreflang SEO tags and locale routing
 *                         (en, tr, de, ar per SectorCalc mandate).
 *
 * The app serves English content under all hreflang-prefixed paths
 * (/en/..., /tr/..., /de/..., /ar/...) via middleware rewrite. Canonical
 * always points to bare path (English).
 */

/** Locales the application renders actual content for. */
export const SUPPORTED_LOCALES = ["en"] as const;

/** Locales used for hreflang SEO tags and locale-prefixed URL routing. */
export const HREFLANG_LOCALES = ["en", "tr", "de", "ar"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type HreflangLocale = (typeof HREFLANG_LOCALES)[number];

export const ROOT_LOCALE: SupportedLocale = "en";

export const DEFAULT_LOCALE = ROOT_LOCALE;

export type TextDirection = "ltr" | "rtl";

export type LocaleDefaultRegion = "GLOBAL" | "TR" | "EU";

export type LocaleCurrency = "USD" | "TRY" | "EUR";

export type LocaleDefinition = {
  readonly code: HreflangLocale;
  readonly label: string;
  readonly nativeName: string;
  readonly shortLabel: string;
  readonly pathPrefix: string;
  readonly isRoot: boolean;
  readonly currency: LocaleCurrency;
  readonly unitSystem: "metric";
  readonly numberLocale: string;
  readonly dateLocale: string;
  readonly textDirection: TextDirection;
  readonly defaultRegion: LocaleDefaultRegion;
};

export const LOCALE_DEFINITIONS: Record<HreflangLocale, LocaleDefinition> = {
  en: {
    code: "en",
    label: "English",
    nativeName: "English",
    shortLabel: "EN",
    pathPrefix: "",
    isRoot: true,
    currency: "USD",
    unitSystem: "metric",
    numberLocale: "en-US",
    dateLocale: "en-US",
    textDirection: "ltr",
    defaultRegion: "GLOBAL",
  },
  tr: {
    code: "tr",
    label: "Turkish",
    nativeName: "T\u00FCrk\u00E7e",
    shortLabel: "TR",
    pathPrefix: "/tr",
    isRoot: false,
    currency: "TRY",
    unitSystem: "metric",
    numberLocale: "tr-TR",
    dateLocale: "tr-TR",
    textDirection: "ltr",
    defaultRegion: "TR",
  },
  de: {
    code: "de",
    label: "German",
    nativeName: "Deutsch",
    shortLabel: "DE",
    pathPrefix: "/de",
    isRoot: false,
    currency: "EUR",
    unitSystem: "metric",
    numberLocale: "de-DE",
    dateLocale: "de-DE",
    textDirection: "ltr",
    defaultRegion: "EU",
  },
  ar: {
    code: "ar",
    label: "Arabic",
    nativeName: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    shortLabel: "AR",
    pathPrefix: "/ar",
    isRoot: false,
    currency: "USD",
    unitSystem: "metric",
    numberLocale: "ar-SA",
    dateLocale: "ar-SA",
    textDirection: "rtl",
    defaultRegion: "GLOBAL",
  },
};

export const LOCALE_DEFINITION_LIST: readonly LocaleDefinition[] = HREFLANG_LOCALES.map(
  (code) => LOCALE_DEFINITIONS[code],
);

export const PREFIXED_LOCALES: readonly HreflangLocale[] = HREFLANG_LOCALES.filter(
  (locale) => locale !== ROOT_LOCALE,
);

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value as SupportedLocale);
}

export function isHreflangLocale(value: string): value is HreflangLocale {
  return (HREFLANG_LOCALES as readonly string[]).includes(value as HreflangLocale);
}

export function getLocaleDefinition(locale: HreflangLocale): LocaleDefinition {
  return LOCALE_DEFINITIONS[locale];
}

export function getActiveLocales(): readonly SupportedLocale[] {
  return SUPPORTED_LOCALES;
}

export function getHreflangLocales(): readonly HreflangLocale[] {
  return HREFLANG_LOCALES;
}

export function getLocalePathPrefix(locale: HreflangLocale): string {
  return LOCALE_DEFINITIONS[locale].pathPrefix;
}

export function getLocaleTextDirection(locale: HreflangLocale): TextDirection {
  return LOCALE_DEFINITIONS[locale].textDirection;
}

export const LOCALE_COOKIE = "sectorcalc_locale";

/** Set to `1` when the user explicitly picks a language in the UI. */
export const LOCALE_MANUAL_COOKIE = "sectorcalc_locale_manual";

export const N_EXT_LOCALE_COOKIE = "N_EXT_LOCALE";

/** ISO 3166-1 alpha-2 country from edge geo headers (client redirect fallback). */
export const COUNTRY_COOKIE = "sectorcalc_country";

export const COUNTRY_TO_LOCALE: Readonly<Record<string, HreflangLocale>> = {
  TR: "tr",
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
  SA: "ar",
  AE: "ar",
  QA: "ar",
  KW: "ar",
  BH: "ar",
  OM: "ar",
  EG: "ar",
  JO: "ar",
  LB: "ar",
  IQ: "ar",
  SY: "ar",
  YE: "ar",
  MA: "ar",
  DZ: "ar",
  TN: "ar",
  LY: "ar",
  SD: "ar",
};
