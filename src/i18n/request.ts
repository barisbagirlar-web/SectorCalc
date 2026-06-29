import { getRequestConfig } from "next-intl/server";
import { routing, isAppLocale } from "@/i18n/routing";
import {
  collectMissingTranslationKeys,
  formatMissingTranslationReport,
  mergeLocaleMessages,
} from "@/lib/i18n/merge-locale-messages";
import { collectLocaleKeyParityGaps } from "@/lib/locale-center/locale-dictionary";
import { getOTATranslations } from "@/lib/i18n/ota";

import enManufacturingOs from "./locales/en/manufacturing-os.json";
import enSeoAuthority from "./locales/en/seo-authority.json";
import enLeadMagnet from "./locales/en/lead-magnet.json";

async function loadManufacturingOsMessages(_locale: string): Promise<Record<string, unknown>> {
  return enManufacturingOs as Record<string, unknown>;
}

async function loadSeoAuthorityMessages(_locale: string): Promise<Record<string, unknown>> {
  return enSeoAuthority as Record<string, unknown>;
}

async function loadLeadMagnetMessages(_locale: string): Promise<Record<string, unknown>> {
  return enLeadMagnet as Record<string, unknown>;
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

  const [enMessages, localeMessages, manufacturingOsMessages, seoAuthorityMessages, leadMagnetMessages] =
    await Promise.all([
    loadBaseMessages("en"),
    loadBaseMessages(locale),
    loadManufacturingOsMessages(locale),
    loadSeoAuthorityMessages(locale),
    loadLeadMagnetMessages(locale),
  ]);

  const messages =
    locale === "en" ? localeMessages : mergeLocaleMessages(enMessages, localeMessages);

  // OTA: overlay live translations from Lokalise when TMS is enabled
  const otaTranslations = await getOTATranslations(locale);
  const mergedMessages = otaTranslations
    ? mergeLocaleMessages(messages, otaTranslations)
    : messages;

  if (locale !== "en") {
    const missingKeys = collectMissingTranslationKeys(enMessages, localeMessages, locale);
    reportMissingTranslations(locale, missingKeys);
  }

  if (process.env.LOCALE_CENTER_STRICT === "1") {
    const parityGaps = collectLocaleKeyParityGaps();
    if (parityGaps.length > 0) {
      console.warn(
        `[locale-center] ${parityGaps.length} message key parity gap(s). Run npm run audit:locale-center`,
      );
    }
  }

  return {
    locale,
    messages: {
      ...mergedMessages,
      manufacturingOs: manufacturingOsMessages,
      seoAuthority: seoAuthorityMessages,
      leadMagnet: leadMagnetMessages,
    },
  };
});
