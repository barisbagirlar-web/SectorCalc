/**
 * Active locale definitions — single source of truth for routing, formatting, and UI.
 */

export const SUPPORTED_LOCALES = ["en"] as const;

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
};

export const LOCALE_DEFINITION_LIST: readonly LocaleDefinition[] = SUPPORTED_LOCALES.map(
  (code) => LOCALE_DEFINITIONS[code],
);

export const PREFIXED_LOCALES: readonly SupportedLocale[] = SUPPORTED_LOCALES.filter(
  (locale) => locale !== ROOT_LOCALE,
);

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value as SupportedLocale);
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

export const N_EXT_LOCALE_COOKIE = "N_EXT_LOCALE";

/** ISO 3166-1 alpha-2 country from edge geo headers (client redirect fallback). */
export const COUNTRY_COOKIE = "sectorcalc_country";

export const COUNTRY_TO_LOCALE: Readonly<Record<string, SupportedLocale>> = {};
