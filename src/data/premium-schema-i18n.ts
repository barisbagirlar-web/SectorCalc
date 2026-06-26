import type { AppLocale } from "@/i18n/routing";
import {
  AR_SCHEMAS,
  DE_SCHEMAS,
  ES_SCHEMAS,
  FR_SCHEMAS,
} from "@/data/premium-schema-i18n-locales";

/**
 * Locale-aware overrides for premium calculator schemas.
 *
 * Schema definitions live in `src/lib/premium-schema/schemas/*` with English
 * `name` and `painStatement`.
 */

export interface LocalizedPremiumSchema {
  title?: string;
  painStatement?: string;
}

const TR_SCHEMAS: Record<string, LocalizedPremiumSchema> = {};

const PREMIUM_SCHEMA_I18N: Partial<Record<string, Record<string, LocalizedPremiumSchema>>> = {
  de: DE_SCHEMAS,
  fr: FR_SCHEMAS,
  es: ES_SCHEMAS,
  ar: AR_SCHEMAS,
};

export function getLocalizedPremiumSchema(
  schemaId: string,
  locale: string,
): LocalizedPremiumSchema | undefined {
  return PREMIUM_SCHEMA_I18N[locale as AppLocale]?.[schemaId];
}
