/**
 * Locale-aware premium schema display names for user-facing UI.
 */
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedPremiumSchema } from "@/data/premium-schema-i18n";

const ANALYZER_SUFFIX = /\s+Analyzer$/i;

export function normalizePremiumCalculatorName(name: string): string {
  return name.replace(ANALYZER_SUFFIX, " Calculator").replace(/\bAnalysis\b/g, "Calculation");
}

export function resolvePremiumSchemaDisplayName(
  schemaId: string,
  schemaName: string,
  locale: string,
): string {
  const localized = getLocalizedPremiumSchema(schemaId, locale);
  if (localized?.title) {
    return localized.title;
  }
  if (locale === "en") {
    return normalizePremiumCalculatorName(schemaName);
  }
  return schemaName;
}

export function resolvePremiumSchemaPainStatement(
  schemaId: string,
  painStatement: string,
  locale: string,
): string {
  return getLocalizedPremiumSchema(schemaId, locale)?.painStatement ?? painStatement;
}

export function isAppLocaleValue(locale: string): locale is AppLocale {
  return locale === "en";
}
