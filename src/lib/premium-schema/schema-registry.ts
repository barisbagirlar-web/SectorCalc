import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** Regeneration baseline — schemas repopulated after DeepSeek scan. */
export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [];
export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = {};

export function listPremiumSchemaIds(): readonly string[] {
  return [];
}

export function getPremiumCalculatorSchema(_slug: string): PremiumCalculatorSchema | undefined {
  return undefined;
}

export function getPremiumSchemaForPaidSlug(_paidSlug: string): PremiumCalculatorSchema | undefined {
  return undefined;
}
