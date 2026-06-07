import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import { CNC_OEE_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/cnc-oee-loss";
import { ENERGY_PEAK_COST_SCHEMA } from "@/lib/premium-schema/schemas/energy-peak-cost";
import { LOGISTICS_ROUTE_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/logistics-route-loss";

export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [
  CNC_OEE_LOSS_SCHEMA,
  LOGISTICS_ROUTE_LOSS_SCHEMA,
  ENERGY_PEAK_COST_SCHEMA,
];

/** Maps legacy revenue paidSlug → schema id (pilot bridge only). */
export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = {
  "cnc-quote-risk-analyzer": "cnc-oee-loss",
  "route-optimization-analyzer": "logistics-route-loss",
  "energy-efficiency-report": "energy-peak-cost",
};

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
