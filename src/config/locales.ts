export type LocaleCode = "en";

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
};

export const ENABLED_LOCALES = Object.values(LOCALES).filter((l) => l.enabled);
