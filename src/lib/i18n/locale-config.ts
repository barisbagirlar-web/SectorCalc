/**
 * Active locale definitions — single source of truth for routing, formatting, and UI.
 */

export const SUPPORTED_LOCALES = ["en", "tr", "de", "fr", "es", "ar"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const ROOT_LOCALE: SupportedLocale = "en";

export const DEFAULT_LOCALE = ROOT_LOCALE;

export type TextDirection = "ltr" | "rtl";

export type LocaleDefaultRegion = "GLOBAL" | "TR" | "EU";

export type LocaleCurrency = "USD" | "TRY" | "EUR";

export type LocaleDefinition = {
  readonly code: SupportedLocale;
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

export const LOCALE_DEFINITIONS: Record<SupportedLocale, LocaleDefinition> = {
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
    nativeName: "Türkçe",
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
  fr: {
    code: "fr",
    label: "French",
    nativeName: "Français",
    shortLabel: "FR",
    pathPrefix: "/fr",
    isRoot: false,
    currency: "EUR",
    unitSystem: "metric",
    numberLocale: "fr-FR",
    dateLocale: "fr-FR",
    textDirection: "ltr",
    defaultRegion: "EU",
  },
  es: {
    code: "es",
    label: "Spanish",
    nativeName: "Español",
    shortLabel: "ES",
    pathPrefix: "/es",
    isRoot: false,
    currency: "EUR",
    unitSystem: "metric",
    numberLocale: "es-ES",
    dateLocale: "es-ES",
    textDirection: "ltr",
    defaultRegion: "EU",
  },
  ar: {
    code: "ar",
    label: "Arabic",
    nativeName: "العربية",
    shortLabel: "AR",
    pathPrefix: "/ar",
    isRoot: false,
    currency: "USD",
    unitSystem: "metric",
    numberLocale: "ar",
    dateLocale: "ar",
    textDirection: "rtl",
    defaultRegion: "GLOBAL",
  },
};

export const LOCALE_DEFINITION_LIST: readonly LocaleDefinition[] = SUPPORTED_LOCALES.map(
  (code) => LOCALE_DEFINITIONS[code],
);

export const PREFIXED_LOCALES: readonly SupportedLocale[] = SUPPORTED_LOCALES.filter(
  (locale) => locale !== ROOT_LOCALE,
);

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleDefinition(locale: SupportedLocale): LocaleDefinition {
  return LOCALE_DEFINITIONS[locale];
}

export function getActiveLocales(): readonly SupportedLocale[] {
  return SUPPORTED_LOCALES;
}

export function getLocalePathPrefix(locale: SupportedLocale): string {
  return LOCALE_DEFINITIONS[locale].pathPrefix;
}

export function getLocaleTextDirection(locale: SupportedLocale): TextDirection {
  return LOCALE_DEFINITIONS[locale].textDirection;
}

export const LOCALE_COOKIE = "sectorcalc_locale";

/** Set to `1` when the user explicitly picks a language in the UI. */
export const LOCALE_MANUAL_COOKIE = "sectorcalc_locale_manual";

export const NEXT_LOCALE_COOKIE = "NEXT_LOCALE";

export const COUNTRY_TO_LOCALE: Readonly<Record<string, SupportedLocale>> = {
  TR: "tr",
  DE: "de",
  AT: "de",
  CH: "de",
  FR: "fr",
  BE: "fr",
  ES: "es",
  MX: "es",
  AR: "es",
  SA: "ar",
  AE: "ar",
  EG: "ar",
  QA: "ar",
  KW: "ar",
  BH: "ar",
  OM: "ar",
  JO: "ar",
  LB: "ar",
  MA: "ar",
  DZ: "ar",
  TN: "ar",
};
