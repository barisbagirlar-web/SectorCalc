import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [];

/** Maps legacy revenue paidSlug → schema id (pilot bridge only). */
export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = {};

export function getPremiumCalculatorSchema(id: string): PremiumCalculatorSchema | null {
  return PREMIUM_CALCULATOR_SCHEMAS.find((schema) => schema.id === id) ?? null;
}

export function getPremiumSchemaForPaidSlug(paidSlug: string): PremiumCalculatorSchema | null {
  const schemaId = PREMIUM_SCHEMA_SLUG_MAP[paidSlug];
  if (!schemaId) {
    return null;
  }
  return getPremiumCalculatorSchema(schemaId);
}

export function listPremiumSchemaIds(): readonly string[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map((s) => s.id);
}
