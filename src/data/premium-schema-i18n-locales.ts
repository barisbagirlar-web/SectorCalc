/**
 * Locale overrides for premium calculator schemas (DE, FR, ES, AR).
 *
 * English source lives in `src/lib/premium-schema/schemas/*`.
 * All non-English locale overrides have been cleared — English is the single source.
 * Only end-user fields are localized: title and painStatement.
 */

export const DE_SCHEMAS: Record<string, { title?: string; painStatement?: string }> = {};

export const FR_SCHEMAS: Record<string, { title?: string; painStatement?: string }> = {};

export const ES_SCHEMAS: Record<string, { title?: string; painStatement?: string }> = {};

export const AR_SCHEMAS: Record<string, { title?: string; painStatement?: string }> = {};
