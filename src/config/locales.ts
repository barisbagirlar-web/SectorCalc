export type LocaleCode = "en" | "tr" | "de" | "ar" | "pt" | "es" | "fr";

export interface LocaleConfig {
  code: LocaleCode;
  label: string;
  pathPrefix: string;
  direction: "ltr" | "rtl";
  /** BCP 47 language tag for formatting */
  languageTag: string;
  /** Default currency for this locale (placeholder) */
  defaultCurrency: string;
  /** Whether locale routes are active */
  enabled: boolean;
}

export const LOCALES: Record<LocaleCode, LocaleConfig> = {
  en: {
    code: "en",
    label: "English",
    pathPrefix: "",
    direction: "ltr",
    languageTag: "en-US",
    defaultCurrency: "USD",
    enabled: true,
  },
  tr: {
    code: "tr",
    label: "Türkçe",
    pathPrefix: "/tr",
    direction: "ltr",
    languageTag: "tr-TR",
    defaultCurrency: "TRY",
    enabled: false,
  },
  de: {
    code: "de",
    label: "Deutsch",
    pathPrefix: "/de",
    direction: "ltr",
    languageTag: "de-DE",
    defaultCurrency: "EUR",
    enabled: false,
  },
  ar: {
    code: "ar",
    label: "العربية",
    pathPrefix: "/ar",
    direction: "rtl",
    languageTag: "ar-SA",
    defaultCurrency: "SAR",
    enabled: false,
  },
  pt: {
    code: "pt",
    label: "Português (BR)",
    pathPrefix: "/pt",
    direction: "ltr",
    languageTag: "pt-BR",
    defaultCurrency: "BRL",
    enabled: false,
  },
  es: {
    code: "es",
    label: "Español",
    pathPrefix: "/es",
    direction: "ltr",
    languageTag: "es-ES",
    defaultCurrency: "EUR",
    enabled: false,
  },
  fr: {
    code: "fr",
    label: "Français",
    pathPrefix: "/fr",
    direction: "ltr",
    languageTag: "fr-FR",
    defaultCurrency: "EUR",
    enabled: false,
  },
};

export const ENABLED_LOCALES = Object.values(LOCALES).filter((l) => l.enabled);
