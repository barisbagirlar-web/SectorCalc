import { getRequestConfig } from "next-intl/server";
import { routing, isAppLocale } from "@/i18n/routing";
import {
  collectMissingTranslationKeys,
  formatMissingTranslationReport,
  mergeLocaleMessages,
} from "@/lib/i18n/merge-locale-messages";

async function loadManufacturingOsMessages(locale: string) {
  try {
    return (await import(`./locales/${locale}/manufacturing-os.json`)).default;
  } catch {
    return (await import("./locales/en/manufacturing-os.json")).default;
  }
}

async function loadBaseMessages(locale: string): Promise<Record<string, unknown>> {
  try {
    return (await import(`../../messages/${locale}.json`)).default as Record<string, unknown>;
  } catch {
    return (await import("../../messages/en.json")).default as Record<string, unknown>;
  }
}

const reportedMissingLocales = new Set<string>();

function reportMissingTranslations(locale: string, missingKeys: ReturnType<typeof collectMissingTranslationKeys>): void {
  if (locale === "en" || missingKeys.length === 0 || reportedMissingLocales.has(locale)) {
    return;
  }

  reportedMissingLocales.add(locale);
  const report = formatMissingTranslationReport(missingKeys);
  if (!report) {
    return;
  }

  if (process.env.NODE_ENV === "production") {
    console.warn(`[i18n] English fallback keys for locale "${locale}":\n${report}`);
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isAppLocale(locale)) {
    locale = routing.defaultLocale;
  }

  const [enMessages, localeMessages, manufacturingOsMessages] = await Promise.all([
    loadBaseMessages("en"),
    loadBaseMessages(locale),
    loadManufacturingOsMessages(locale),
  ]);

  const messages =
    locale === "en" ? localeMessages : mergeLocaleMessages(enMessages, localeMessages);

  if (locale !== "en") {
    const missingKeys = collectMissingTranslationKeys(enMessages, localeMessages, locale);
    reportMissingTranslations(locale, missingKeys);
  }

  return {
    locale,
    messages: {
      ...messages,
      manufacturingOs: manufacturingOsMessages,
    },
  };
});
