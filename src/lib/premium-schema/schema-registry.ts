import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import { AGRICULTURE_IRRIGATION_YIELD_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/agriculture-irrigation-yield-loss";
import { AUTO_REPAIR_PARTS_LABOR_QUOTE_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/auto-repair-parts-labor-quote-calculator";
import { AUTO_REPAIR_COMEBACK_COST_SCHEMA } from "@/lib/premium-schema/schemas/auto-repair-comeback-cost";
import { BREAK_EVEN_SAFETY_MARGIN_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/break-even-safety-margin-calculator";
import { CALIBRATION_DRIFT_RISK_SCHEMA } from "@/lib/premium-schema/schemas/calibration-drift-risk";
import { CARBON_FOOTPRINT_COMPLIANCE_RISK_SCHEMA } from "@/lib/premium-schema/schemas/carbon-footprint-compliance-risk";
import { CBAM_UNIT_PRODUCT_CARBON_FOOTPRINT_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/cbam-unit-product-carbon-footprint-calculator";
import { CLOUD_API_COST_OVERRUN_SCHEMA } from "@/lib/premium-schema/schemas/cloud-api-cost-overrun";
import { COMPRESSOR_LEAK_COST_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/compressor-leak-cost-calculator";
import { CNC_OEE_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/cnc-oee-loss";
import { CNC_TOOL_WEAR_COST_SCHEMA } from "@/lib/premium-schema/schemas/cnc-tool-wear-cost";
import { CONSTRUCTION_PROJECT_OVERRUN_SCHEMA } from "@/lib/premium-schema/schemas/construction-project-overrun";
import { CONSTRUCTION_SUBCONTRACTOR_MARGIN_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/construction-subcontractor-margin-leak";
import { DAIRY_FEED_EFFICIENCY_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/dairy-feed-efficiency-loss";
import { DOWNTIME_MINUTE_COST_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/downtime-minute-cost-calculator";
import { ELECTRICAL_PANEL_REWORK_COST_SCHEMA } from "@/lib/premium-schema/schemas/electrical-panel-rework-cost";
import { EMPLOYEE_TOTAL_COST_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/employee-total-cost-calculator";
import { ENERGY_COMPRESSOR_LEAK_COST_SCHEMA } from "@/lib/premium-schema/schemas/energy-compressor-leak-cost";
import { ENERGY_PEAK_COST_SCHEMA } from "@/lib/premium-schema/schemas/energy-peak-cost";
import { FOOD_WASTE_MARGIN_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/food-waste-margin-loss";
import { HVAC_CALLBACK_MARGIN_RISK_SCHEMA } from "@/lib/premium-schema/schemas/hvac-callback-margin-risk";
import { INVENTORY_CARRYING_COST_EOQ_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/inventory-carrying-cost-eoq-calculator";
import { LEGAL_INTEREST_FEE_CALCULATOR_PRO_SCHEMA } from "@/lib/premium-schema/schemas/legal-interest-fee-calculator-pro";
import { LOGISTICS_FUEL_ROUTE_DRIFT_SCHEMA } from "@/lib/premium-schema/schemas/logistics-fuel-route-drift";
import { LOGISTICS_ROUTE_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/logistics-route-loss";
import { OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/oee-equipment-effectiveness-calculator";
import { PAINTING_REWORK_COVERAGE_RISK_SCHEMA } from "@/lib/premium-schema/schemas/painting-rework-coverage-risk";
import { PLUMBING_LEAK_CALLBACK_COST_SCHEMA } from "@/lib/premium-schema/schemas/plumbing-leak-callback-cost";
import { PRINTING_REPRINT_MARGIN_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/printing-reprint-margin-leak";
import { PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/product-customer-profitability-calculator";
import { QUOTE_PRICE_PROFIT_MARGIN_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/quote-price-profit-margin-calculator";
import { RESTAURANT_MENU_MARGIN_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/restaurant-menu-margin-leak";
import { RETAIL_INVENTORY_TURNOVER_RISK_SCHEMA } from "@/lib/premium-schema/schemas/retail-inventory-turnover-risk";
import { ROOFING_WEATHER_DELAY_RISK_SCHEMA } from "@/lib/premium-schema/schemas/roofing-weather-delay-risk";
import { SHOP_RATE_HOURLY_COST_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/shop-rate-hourly-cost-calculator";
import { SHEET_METAL_SCRAP_RISK_SCHEMA } from "@/lib/premium-schema/schemas/sheet-metal-scrap-risk";
import { TOLERANCE_STACK_UP_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/tolerance-stack-up-calculator";
import { TEXTILE_FABRIC_WASTE_RISK_SCHEMA } from "@/lib/premium-schema/schemas/textile-fabric-waste-risk";
import { WELDED_BOLTED_CONNECTION_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/welded-bolted-connection-calculator";
import { WAREHOUSE_SPACE_COST_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/warehouse-space-cost-leak";
import { BOLT_TIGHTENING_TORQUE_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/bolt-tightening-torque-calculator";
import { FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/fire-system-flow-hydrant-calculator";
import { HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/hydraulic-pneumatic-cylinder-force-calculator";
import { QUALITY_COST_PAF_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/quality-cost-paf-calculator";
import { PRESSURE_VESSEL_WALL_THICKNESS_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/pressure-vessel-wall-thickness-calculator";
import { VALUE_STREAM_MAP_VSM_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/value-stream-map-vsm-calculator";
import { ENERGY_SAVINGS_PACKAGE_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/energy-savings-package-calculator";
import { INVESTMENT_PAYBACK_NPV_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/investment-payback-npv-calculator";
import { ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/annual-leave-severance-notice-calculator";
import { BELT_PULLEY_SPEED_LENGTH_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/belt-pulley-speed-length-calculator";
import { SLUG_3D_PRINT_JOB_MARGIN_TOOL_SCHEMA } from "@/lib/premium-schema/schemas/3d-print-job-margin-tool";
import { AUTO_SHOP_MARGIN_LEAK_DETECTOR_SCHEMA } from "@/lib/premium-schema/schemas/auto-shop-margin-leak-detector";
import { CHANGE_ORDER_IMPACT_ANALYZER_SCHEMA } from "@/lib/premium-schema/schemas/change-order-impact-analyzer";
import { CNC_QUOTE_RISK_ANALYZER_SCHEMA } from "@/lib/premium-schema/schemas/cnc-quote-risk-analyzer";
import { CROP_YIELD_LOSS_ANALYZER_SCHEMA } from "@/lib/premium-schema/schemas/crop-yield-loss-analyzer";
import { DAIRY_PROFIT_DETECTOR_SCHEMA } from "@/lib/premium-schema/schemas/dairy-profit-detector";
import { DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_SCHEMA } from "@/lib/premium-schema/schemas/doviz-pozisyonu-kur-farki-riski-hesabi";
import { FEED_EFFICIENCY_ANALYZER_SCHEMA } from "@/lib/premium-schema/schemas/feed-efficiency-analyzer";
import { HEAT_LOSS_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/heat-loss-calculator";
import { HVAC_PROJECT_MARGIN_GUARD_SCHEMA } from "@/lib/premium-schema/schemas/hvac-project-margin-guard";
import { LANDSCAPING_CONTRACT_PROFIT_TOOL_SCHEMA } from "@/lib/premium-schema/schemas/landscaping-contract-profit-tool";
import { MATERIAL_WASTE_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/material-waste-calculator";
import { MEAL_PLANNING_VERDICT_SCHEMA } from "@/lib/premium-schema/schemas/meal-planning-verdict";
import { MENU_PROFIT_LEAK_DETECTOR_SCHEMA } from "@/lib/premium-schema/schemas/menu-profit-leak-detector";
import { MILLWORK_BID_RISK_ANALYZER_SCHEMA } from "@/lib/premium-schema/schemas/millwork-bid-risk-analyzer";
import { OFFICE_CLEANING_BID_OPTIMIZER_SCHEMA } from "@/lib/premium-schema/schemas/office-cleaning-bid-optimizer";
import { PAINTING_JOB_PROFIT_VERDICT_SCHEMA } from "@/lib/premium-schema/schemas/painting-job-profit-verdict";
import { PANEL_SHOP_MARGIN_VERDICT_SCHEMA } from "@/lib/premium-schema/schemas/panel-shop-margin-verdict";
import { PLUMBING_JOB_MARGIN_VERDICT_SCHEMA } from "@/lib/premium-schema/schemas/plumbing-job-margin-verdict";
import { PROFIT_MARGIN_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/profit-margin-calculator";
import { RETURN_PROFIT_EROSION_TOOL_SCHEMA } from "@/lib/premium-schema/schemas/return-profit-erosion-tool";
import { ROOFING_CONTRACT_MARGIN_GUARD_SCHEMA } from "@/lib/premium-schema/schemas/roofing-contract-margin-guard";
import { ROUTE_OPTIMIZATION_ANALYZER_SCHEMA } from "@/lib/premium-schema/schemas/route-optimization-analyzer";
import { SCRAP_RATE_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/scrap-rate-calculator";
import { SHEET_METAL_QUOTE_RISK_TOOL_SCHEMA } from "@/lib/premium-schema/schemas/sheet-metal-quote-risk-tool";
import { SIGNAGE_BID_SAFE_PRICE_TOOL_SCHEMA } from "@/lib/premium-schema/schemas/signage-bid-safe-price-tool";
import { WATER_OPTIMIZATION_VERDICT_SCHEMA } from "@/lib/premium-schema/schemas/water-optimization-verdict";
import { WELDING_BID_RISK_ANALYZER_SCHEMA } from "@/lib/premium-schema/schemas/welding-bid-risk-analyzer";
import { SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/7-israf-muda-avcisi-parasal-karsilik-calculator";

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
  QUOTE_PRICE_PROFIT_MARGIN_CALCULATOR_SCHEMA,
  SHOP_RATE_HOURLY_COST_CALCULATOR_SCHEMA,
  BREAK_EVEN_SAFETY_MARGIN_CALCULATOR_SCHEMA,
  AUTO_REPAIR_PARTS_LABOR_QUOTE_CALCULATOR_SCHEMA,
  CBAM_UNIT_PRODUCT_CARBON_FOOTPRINT_CALCULATOR_SCHEMA,
  OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA,
  COMPRESSOR_LEAK_COST_CALCULATOR_SCHEMA,
  EMPLOYEE_TOTAL_COST_CALCULATOR_SCHEMA,
  DOWNTIME_MINUTE_COST_CALCULATOR_SCHEMA,
  PRODUCT_CUSTOMER_PROFITABILITY_CALCULATOR_SCHEMA,
  INVENTORY_CARRYING_COST_EOQ_CALCULATOR_SCHEMA,
  WELDED_BOLTED_CONNECTION_CALCULATOR_SCHEMA,
  TOLERANCE_STACK_UP_CALCULATOR_SCHEMA,
  BOLT_TIGHTENING_TORQUE_CALCULATOR_SCHEMA,
  FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_SCHEMA,
  HYDRAULIC_PNEUMATIC_CYLINDER_FORCE_CALCULATOR_SCHEMA,
  QUALITY_COST_PAF_CALCULATOR_SCHEMA,
  PRESSURE_VESSEL_WALL_THICKNESS_CALCULATOR_SCHEMA,
  VALUE_STREAM_MAP_VSM_CALCULATOR_SCHEMA,
  ENERGY_SAVINGS_PACKAGE_CALCULATOR_SCHEMA,
  INVESTMENT_PAYBACK_NPV_CALCULATOR_SCHEMA,
  ANNUAL_LEAVE_SEVERANCE_NOTICE_CALCULATOR_SCHEMA,
  BELT_PULLEY_SPEED_LENGTH_CALCULATOR_SCHEMA,
  SLUG_3D_PRINT_JOB_MARGIN_TOOL_SCHEMA,
  AUTO_SHOP_MARGIN_LEAK_DETECTOR_SCHEMA,
  CHANGE_ORDER_IMPACT_ANALYZER_SCHEMA,
  CNC_QUOTE_RISK_ANALYZER_SCHEMA,
  CROP_YIELD_LOSS_ANALYZER_SCHEMA,
  DAIRY_PROFIT_DETECTOR_SCHEMA,
  DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_SCHEMA,
  FEED_EFFICIENCY_ANALYZER_SCHEMA,
  HEAT_LOSS_CALCULATOR_SCHEMA,
  HVAC_PROJECT_MARGIN_GUARD_SCHEMA,
  LANDSCAPING_CONTRACT_PROFIT_TOOL_SCHEMA,
  MATERIAL_WASTE_CALCULATOR_SCHEMA,
  MEAL_PLANNING_VERDICT_SCHEMA,
  MENU_PROFIT_LEAK_DETECTOR_SCHEMA,
  MILLWORK_BID_RISK_ANALYZER_SCHEMA,
  OFFICE_CLEANING_BID_OPTIMIZER_SCHEMA,
  PAINTING_JOB_PROFIT_VERDICT_SCHEMA,
  PANEL_SHOP_MARGIN_VERDICT_SCHEMA,
  PLUMBING_JOB_MARGIN_VERDICT_SCHEMA,
  PROFIT_MARGIN_CALCULATOR_SCHEMA,
  RETURN_PROFIT_EROSION_TOOL_SCHEMA,
  ROOFING_CONTRACT_MARGIN_GUARD_SCHEMA,
  ROUTE_OPTIMIZATION_ANALYZER_SCHEMA,
  SCRAP_RATE_CALCULATOR_SCHEMA,
  SHEET_METAL_QUOTE_RISK_TOOL_SCHEMA,
  SIGNAGE_BID_SAFE_PRICE_TOOL_SCHEMA,
  WATER_OPTIMIZATION_VERDICT_SCHEMA,
  WELDING_BID_RISK_ANALYZER_SCHEMA,
  SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA,
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
