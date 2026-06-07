import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import { AGRICULTURE_IRRIGATION_YIELD_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/agriculture-irrigation-yield-loss";
import { AUTO_REPAIR_COMEBACK_COST_SCHEMA } from "@/lib/premium-schema/schemas/auto-repair-comeback-cost";
import { CALIBRATION_DRIFT_RISK_SCHEMA } from "@/lib/premium-schema/schemas/calibration-drift-risk";
import { CARBON_FOOTPRINT_COMPLIANCE_RISK_SCHEMA } from "@/lib/premium-schema/schemas/carbon-footprint-compliance-risk";
import { CLOUD_API_COST_OVERRUN_SCHEMA } from "@/lib/premium-schema/schemas/cloud-api-cost-overrun";
import { CNC_OEE_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/cnc-oee-loss";
import { CNC_TOOL_WEAR_COST_SCHEMA } from "@/lib/premium-schema/schemas/cnc-tool-wear-cost";
import { CONSTRUCTION_PROJECT_OVERRUN_SCHEMA } from "@/lib/premium-schema/schemas/construction-project-overrun";
import { CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/construction-subcontractor-margin-leak";
import { DAIRY_FEED_EFFICIENCY_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/dairy-feed-efficiency-loss";
import { ELECTRICAL_PANEL_REWORK_COST_SCHEMA } from "@/lib/premium-schema/schemas/electrical-panel-rework-cost";
import { ENERGY_COMPRESSOR_LEAK_COST_SCHEMA } from "@/lib/premium-schema/schemas/energy-compressor-leak-cost";
import { ENERGY_PEAK_COST_SCHEMA } from "@/lib/premium-schema/schemas/energy-peak-cost";
import { FOOD_WASTE_MARGIN_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/food-waste-margin-loss";
import { HVAC_CALLBACK_MARGIN_RISK_SCHEMA } from "@/lib/premium-schema/schemas/hvac-callback-margin-risk";
import { LEGAL_INTEREST_FEE_CALCULATOR_PRO_SCHEMA } from "@/lib/premium-schema/schemas/legal-interest-fee-calculator-pro";
import { LOGISTICS_FUEL_ROUTE_DRIFT_SCHEMA } from "@/lib/premium-schema/schemas/logistics-fuel-route-drift";
import { LOGISTICS_ROUTE_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/logistics-route-loss";
import { PAINTING_REWORK_COVERAGE_RISK_SCHEMA } from "@/lib/premium-schema/schemas/painting-rework-coverage-risk";
import { PLUMBING_LEAK_CALLBACK_COST_SCHEMA } from "@/lib/premium-schema/schemas/plumbing-leak-callback-cost";
import { PRINTING_REPRINT_MARGIN_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/printing-reprint-margin-leak";
import { RESTAURANT_MENU_MARGIN_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/restaurant-menu-margin-leak";
import { RETAIL_INVENTORY_TURNOVER_RISK_SCHEMA } from "@/lib/premium-schema/schemas/retail-inventory-turnover-risk";
import { ROOFING_WEATHER_DELAY_RISK_SCHEMA } from "@/lib/premium-schema/schemas/roofing-weather-delay-risk";
import { SHEET_METAL_SCRAP_RISK_SCHEMA } from "@/lib/premium-schema/schemas/sheet-metal-scrap-risk";
import { TEXTILE_FABRIC_WASTE_RISK_SCHEMA } from "@/lib/premium-schema/schemas/textile-fabric-waste-risk";
import { WAREHOUSE_SPACE_COST_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/warehouse-space-cost-leak";

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
  CNC_TOOL_WEAR_COST_SCHEMA,
  TEXTILE_FABRIC_WASTE_RISK_SCHEMA,
  PRINTING_REPRINT_MARGIN_LEAK_SCHEMA,
  AUTO_REPAIR_COMEBACK_COST_SCHEMA,
  HVAC_CALLBACK_MARGIN_RISK_SCHEMA,
  ELECTRICAL_PANEL_REWORK_COST_SCHEMA,
  PLUMBING_LEAK_CALLBACK_COST_SCHEMA,
  ROOFING_WEATHER_DELAY_RISK_SCHEMA,
  PAINTING_REWORK_COVERAGE_RISK_SCHEMA,
  DAIRY_FEED_EFFICIENCY_LOSS_SCHEMA,
  RETAIL_INVENTORY_TURNOVER_RISK_SCHEMA,
  WAREHOUSE_SPACE_COST_LEAK_SCHEMA,
  CALIBRATION_DRIFT_RISK_SCHEMA,
  LEGAL_INTEREST_FEE_CALCULATOR_PRO_SCHEMA,
  CARBON_FOOTPRINT_COMPLIANCE_RISK_SCHEMA,
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
  "cbam-compliance-verdict": "carbon-footprint-compliance-risk",
  "return-profit-erosion-tool": "cloud-api-cost-overrun",
  "crop-yield-loss-analyzer": "agriculture-irrigation-yield-loss",
  "welding-bid-risk-analyzer": "cnc-tool-wear-cost",
  "millwork-bid-risk-analyzer": "textile-fabric-waste-risk",
  "signage-bid-safe-price-tool": "printing-reprint-margin-leak",
  "auto-shop-margin-leak-detector": "auto-repair-comeback-cost",
  "hvac-project-margin-guard": "hvac-callback-margin-risk",
  "panel-shop-margin-verdict": "electrical-panel-rework-cost",
  "plumbing-job-margin-verdict": "plumbing-leak-callback-cost",
  "landscaping-contract-profit-tool": "roofing-weather-delay-risk",
  "painting-job-profit-verdict": "painting-rework-coverage-risk",
  "feed-efficiency-analyzer": "dairy-feed-efficiency-loss",
  "dairy-profit-detector": "dairy-feed-efficiency-loss",
  "water-optimization-verdict": "retail-inventory-turnover-risk",
  "office-cleaning-bid-optimizer": "warehouse-space-cost-leak",
  "3d-print-job-margin-tool": "calibration-drift-risk",
  "renovation-budget-optimizer": "legal-interest-fee-calculator-pro",
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
