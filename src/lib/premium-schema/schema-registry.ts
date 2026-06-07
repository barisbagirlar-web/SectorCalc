import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import { AGRICULTURE_IRRIGATION_YIELD_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/agriculture-irrigation-yield-loss";
import { CLOUD_API_COST_OVERRUN_SCHEMA } from "@/lib/premium-schema/schemas/cloud-api-cost-overrun";
import { CNC_OEE_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/cnc-oee-loss";
import { CONSTRUCTION_PROJECT_OVERRUN_SCHEMA } from "@/lib/premium-schema/schemas/construction-project-overrun";
import { CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/construction-subcontractor-margin-leak";
import { ENERGY_COMPRESSOR_LEAK_COST_SCHEMA } from "@/lib/premium-schema/schemas/energy-compressor-leak-cost";
import { ENERGY_PEAK_COST_SCHEMA } from "@/lib/premium-schema/schemas/energy-peak-cost";
import { FOOD_WASTE_MARGIN_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/food-waste-margin-loss";
import { LOGISTICS_FUEL_ROUTE_DRIFT_SCHEMA } from "@/lib/premium-schema/schemas/logistics-fuel-route-drift";
import { LOGISTICS_ROUTE_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/logistics-route-loss";
import { RESTAURANT_MENU_MARGIN_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/restaurant-menu-margin-leak";
import { SHEET_METAL_SCRAP_RISK_SCHEMA } from "@/lib/premium-schema/schemas/sheet-metal-scrap-risk";

export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [
  CNC_OEE_LOSS_SCHEMA,
  LOGISTICS_ROUTE_LOSS_SCHEMA,
  ENERGY_PEAK_COST_SCHEMA,
  FOOD_WASTE_MARGIN_LOSS_SCHEMA,
  CONSTRUCTION_PROJECT_OVERRUN_SCHEMA,
  SHEET_METAL_SCRAP_RISK_SCHEMA,
  RESTAURANT_MENU_MARGIN_LEAK_SCHEMA,
  CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_SCHEMA,
  LOGISTICS_FUEL_ROUTE_DRIFT_SCHEMA,
  ENERGY_COMPRESSOR_LEAK_COST_SCHEMA,
  CLOUD_API_COST_OVERRUN_SCHEMA,
  AGRICULTURE_IRRIGATION_YIELD_LOSS_SCHEMA,
];

/** Maps legacy revenue paidSlug → schema id (pilot bridge only). */
export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = {
  "cnc-quote-risk-analyzer": "cnc-oee-loss",
  "route-optimization-analyzer": "logistics-route-loss",
  "energy-efficiency-report": "energy-peak-cost",
  "menu-profit-leak-detector": "restaurant-menu-margin-leak",
  "meal-planning-verdict": "food-waste-margin-loss",
  "change-order-impact-analyzer": "construction-project-overrun",
  "sheet-metal-quote-risk-tool": "sheet-metal-scrap-risk",
  "roofing-contract-margin-guard": "construction-subcontractor-margin-leak",
  "trip-budget-optimizer": "logistics-fuel-route-drift",
  "cbam-compliance-verdict": "energy-compressor-leak-cost",
  "return-profit-erosion-tool": "cloud-api-cost-overrun",
  "crop-yield-loss-analyzer": "agriculture-irrigation-yield-loss",
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
