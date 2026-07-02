
//import { ICI_GRID_SCHEMA } from "./schemas/ici-grid";
//import { ICI_GIGAFACTORY_FORMATION_SCHEMA } from "./schemas/ici-gigafactory-formation";

//import { ICI_LYO_SCHEMA } from "./schemas/ici-lyo";
//import { ICI_RETROFIT_SCHEMA } from "./schemas/ici-retrofit";

//import { ICI_INFRA_LIFE_SCHEMA } from "./schemas/ici-infra-life";

//import { ICI_WELD_PWHT_SCHEMA } from "./schemas/ici-weld-pwht";

//import { ICI_STACK_SCHEMA } from "./schemas/ici-stack";

//import { ICI_WELL_SCHEMA } from "./schemas/ici-well";
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
import { AI_TOKEN_COST_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/ai-token-cost-analyzer";
import { SIX_SIGMA_PRIORITIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/six-sigma-project-prioritizer";
import { AQL_SAMPLING_SCHEMA } from "@/lib/features/premium-schema/schemas/aql-sampling-risk-analyzer";
import { VEHICLE_DEPRECIATION_SCHEMA } from "@/lib/features/premium-schema/schemas/vehicle-depreciation-tco-analyzer";
import { DOWNTIME_COST_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/downtime-cost-analyzer";
import { AUTO_REPAIR_COMEBACK_SCHEMA } from "@/lib/features/premium-schema/schemas/auto-repair-comeback-analyzer";
import { AUTO_REPAIR_QUOTE_SCHEMA } from "@/lib/features/premium-schema/schemas/auto-repair-quote-consistency-analyzer";
import { AUTO_SHOP_MARGIN_LEAK_SCHEMA } from "@/lib/features/premium-schema/schemas/auto-shop-margin-leak-analyzer";
import { ASME_VESSEL_SCHEMA } from "@/lib/features/premium-schema/schemas/asme-pressure-vessel-analyzer";
import { COMPRESSED_AIR_SCHEMA } from "@/lib/features/premium-schema/schemas/compressed-air-energy-cost-analyzer";
import { BREAK_EVEN_SCHEMA } from "@/lib/features/premium-schema/schemas/break-even-margin-of-safety-analyzer";
import { CONCRETE_VOLUME_SCHEMA } from "@/lib/features/premium-schema/schemas/concrete-volume-cost-analyzer";
import { CALIBRATION_DRIFT_SCHEMA } from "@/lib/features/premium-schema/schemas/calibration-drift-risk-analyzer";
import { CBAM_COMPLIANCE_SCHEMA } from "@/lib/features/premium-schema/schemas/cbam-compliance-verdict-analyzer";
import { CHATTER_SCHEMA } from "@/lib/features/premium-schema/schemas/chatter-surface-quality-analyzer";
import { BOLT_TORQUE_SCHEMA } from "@/lib/features/premium-schema/schemas/bolt-torque-preload-analyzer";
import { TURNOVER_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/employee-turnover-cost-analyzer";
// ── Batch 2 (Tools 21-60) imports ──

//import { CPM_DELAY_SCHEMA } from "@/lib/features/premium-schema/schemas/cpm-delay-penalty-analyzer";
//import { BOTTLENECK_INVESTMENT_SCHEMA } from "@/lib/features/premium-schema/schemas/bottleneck-investment-analyzer";

//import { ABSENTEEISM_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/absenteeism-cost-analyzer";

//import { ENERGY_CONSUMPTION_SCHEMA } from "@/lib/features/premium-schema/schemas/energy-consumption-report-analyzer";

//import { FACTORY_LAYOUT_SCHEMA } from "@/lib/features/premium-schema/schemas/factory-layout-distance-analyzer";

//import { FLEXIBLE_MFG_ROI_SCHEMA } from "@/lib/features/premium-schema/schemas/flexible-manufacturing-roi-analyzer";

//import { HVAC_CAPACITY_SCHEMA } from "@/lib/features/premium-schema/schemas/hvac-capacity-analyzer";
//import { HEAT_EXCHANGER_FOULING_SCHEMA } from "@/lib/features/premium-schema/schemas/heat-exchanger-fouling-analyzer";
//import { ISO50001_BASELINE_SCHEMA } from "@/lib/features/premium-schema/schemas/iso-50001-baseline-analyzer";

// ── Batch 3 (Tools 31-40) imports ──
//import { PRODUCT_COMPLEXITY_SCHEMA } from "@/lib/features/premium-schema/schemas/product-complexity-hidden-cost-analyzer";

//import { FUEL_ROUTE_DRIFT_SCHEMA } from "@/lib/features/premium-schema/schemas/fuel-route-drift-analyzer";
//import { FIRE_HYDRANT_SCHEMA } from "@/lib/features/premium-schema/schemas/fire-hydrant-flow-analyzer";

// ── Batch 4 (Tools 101-140) imports ──
import { BEAM_WEIGHT_SCHEMA } from "@/lib/features/premium-schema/schemas/beam-weight-analyzer";
import { BID_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/bid-risk-analyzer";
import { CASH_FLOW_GAP_SCHEMA } from "@/lib/features/premium-schema/schemas/cash-flow-gap-analyzer";
import { CLEANING_BID_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/cleaning-bid-optimizer-analyzer";
import { COMPRESSOR_TANK_SCHEMA } from "@/lib/features/premium-schema/schemas/compressor-tank-sizing-analyzer";
import { CONTAINER_LOAD_SCHEMA } from "@/lib/features/premium-schema/schemas/container-load-analyzer";
import { CONTRACT_INCENTIVE_ANALYZER } from "@/lib/features/premium-schema/schemas/contract-incentive-analyzer";
import { CROP_YIELD_LOSS_SCHEMA } from "@/lib/features/premium-schema/schemas/crop-yield-loss-analyzer";
import { CUT_FILL_BALANCE_SCHEMA } from "@/lib/features/premium-schema/schemas/cut-fill-balance-analyzer";
import { DAIRY_PROFIT_DETECTOR_ANALYZER } from "@/lib/features/premium-schema/schemas/dairy-profit-detector-analyzer";
import { DEMAND_FORECAST_STOCK_SCHEMA } from "@/lib/features/premium-schema/schemas/demand-forecast-stock-analyzer";
import { FABRIC_CUTTING_SCHEMA } from "@/lib/features/premium-schema/schemas/fabric-cutting-optimizer-analyzer";
import { FREIGHT_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/freight-cost-analyzer";
import { INVENTORY_TURNOVER_RISK_ANALYZER } from "@/lib/features/premium-schema/schemas/inventory-turnover-risk-analyzer";
import { IRRIGATION_COST_CHECK_ANALYZER } from "@/lib/features/premium-schema/schemas/irrigation-cost-check-analyzer";
import { KWH_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/kwh-cost-analyzer";
import { MACHINE_ECONOMIC_LIFE_SCHEMA } from "@/lib/features/premium-schema/schemas/machine-economic-life-analyzer";
import { MATERIAL_REPLACEMENT_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/material-replacement-cost-analyzer";
import { MTBF_MTTR_FINANCIAL_SCHEMA } from "@/lib/features/premium-schema/schemas/mtbf-mttr-financial-analyzer";
import { NOISE_VIBRATION_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/noise-vibration-cost-analyzer";
import { OFFICE_SUPPLIES_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/office-supplies-cost-analyzer";
import { OVERTIME_HIRING_BREAKEVEN_SCHEMA } from "@/lib/features/premium-schema/schemas/overtime-hiring-breakeven-analyzer";
import { PALLET_RACK_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/pallet-rack-optimizer-analyzer";
import { PAYMENT_TERMS_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/payment-terms-optimizer-analyzer";
import { POKA_YOKE_ROI_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/poka-yoke-roi-analyzer";
import { PROJECT_OVERRUN_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/project-overrun-analyzer";
import { QUALITY_COST_PAF_SCHEMA } from "@/lib/features/premium-schema/schemas/quality-cost-paf-analyzer";
import { RECIPE_COST_CHECK_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/recipe-cost-check-analyzer";
import { REPAIR_SHOP_QUOTE_SCHEMA } from "@/lib/features/premium-schema/schemas/repair-shop-quote-analyzer";
import { RESTAURANT_MENU_MARGIN_LEAK_SCHEMA } from "@/lib/features/premium-schema/schemas/restaurant-menu-margin-leak-analyzer";
import { ROBOT_VS_MANUAL_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/robot-vs-manual-analyzer";
import { ROUTE_OPTIMIZATION_ANALYZER } from "@/lib/features/premium-schema/schemas/route-optimization-analyzer";
import { SAAS_SHELFWARE_ANALYZER } from "@/lib/features/premium-schema/schemas/saas-shelfware-analyzer";
import { SEED_RATE_SCHEMA } from "@/lib/features/premium-schema/schemas/seed-rate-analyzer";
import { SMED_CHANGEOVER_OPTIMIZER_ANALYZER } from "@/lib/features/premium-schema/schemas/smed-changeover-optimizer-analyzer";
import { STEAM_TRAP_ENERGY_LOSS_ANALYZER } from "@/lib/features/premium-schema/schemas/steam-trap-energy-loss-analyzer";
import { SUBCONTRACTOR_MARGIN_LEAK_SCHEMA } from "@/lib/features/premium-schema/schemas/subcontractor-margin-leak-analyzer";
import { SUPPLIER_PERFORMANCE_TCO_ANALYZER } from "@/lib/features/premium-schema/schemas/supplier-performance-tco-analyzer";
import { SUPPLY_CHAIN_DISRUPTION_SCHEMA } from "@/lib/features/premium-schema/schemas/supply-chain-disruption-analyzer";
import { TAGUCHI_QUALITY_LOSS_ANALYZER } from "@/lib/features/premium-schema/schemas/taguchi-quality-loss-analyzer";
import { TAKT_TIME_FLEXIBILITY_SCHEMA } from "@/lib/features/premium-schema/schemas/takt-time-flexibility-analyzer";
import { TEXTILE_WASTE_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/textile-waste-risk-analyzer";
import { TOTAL_EMPLOYEE_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/total-employee-cost-analyzer";
import { TRANSFER_PRICING_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/transfer-pricing-optimizer-analyzer";
import { TRANSPORT_MODE_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/transport-mode-risk-analyzer";
import { WATER_USAGE_OPTIMIZER_ANALYZER } from "@/lib/features/premium-schema/schemas/water-usage-optimizer-analyzer";
import { WELD_STRENGTH_SCHEMA } from "@/lib/features/premium-schema/schemas/weld-strength-analyzer";
import { WELD_VOLUME_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/weld-volume-cost-analyzer";

/** Premium 152 batch 1 — schema-backed calculators. */
export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [
  AI_TOKEN_COST_ANALYZER_SCHEMA,
  SIX_SIGMA_PRIORITIZER_SCHEMA,
  AQL_SAMPLING_SCHEMA,
  VEHICLE_DEPRECIATION_SCHEMA,
  DOWNTIME_COST_ANALYZER_SCHEMA,
  AUTO_REPAIR_COMEBACK_SCHEMA,
  AUTO_REPAIR_QUOTE_SCHEMA,
  AUTO_SHOP_MARGIN_LEAK_SCHEMA,
  ASME_VESSEL_SCHEMA,
  COMPRESSED_AIR_SCHEMA,
  BREAK_EVEN_SCHEMA,
  CONCRETE_VOLUME_SCHEMA,
  CALIBRATION_DRIFT_SCHEMA,
  CBAM_COMPLIANCE_SCHEMA,
  CHATTER_SCHEMA,
  BOLT_TORQUE_SCHEMA,
  TURNOVER_COST_SCHEMA,
  // ── Batch 2 (Tools 21-60) ──

  // ── Batch 3 (Tools 31-40) ──

  // ── Batch 4 (Tools 101-140) ──
  BEAM_WEIGHT_SCHEMA,
  BID_RISK_SCHEMA,
  CASH_FLOW_GAP_SCHEMA,
  CLEANING_BID_OPTIMIZER_SCHEMA,
  COMPRESSOR_TANK_SCHEMA,
  CONTAINER_LOAD_SCHEMA,
  CONTRACT_INCENTIVE_ANALYZER,
  CROP_YIELD_LOSS_SCHEMA,
  CUT_FILL_BALANCE_SCHEMA,
  DAIRY_PROFIT_DETECTOR_ANALYZER,
  DEMAND_FORECAST_STOCK_SCHEMA,
  FABRIC_CUTTING_SCHEMA,
  FREIGHT_COST_SCHEMA,
  INVENTORY_TURNOVER_RISK_ANALYZER,
  IRRIGATION_COST_CHECK_ANALYZER,
  KWH_COST_SCHEMA,
  MACHINE_ECONOMIC_LIFE_SCHEMA,
  MATERIAL_REPLACEMENT_COST_SCHEMA,
  MTBF_MTTR_FINANCIAL_SCHEMA,
  NOISE_VIBRATION_COST_SCHEMA,
  OFFICE_SUPPLIES_COST_SCHEMA,
  OVERTIME_HIRING_BREAKEVEN_SCHEMA,
  PALLET_RACK_OPTIMIZER_SCHEMA,
  PAYMENT_TERMS_OPTIMIZER_SCHEMA,
  POKA_YOKE_ROI_ANALYZER_SCHEMA,
  PROJECT_OVERRUN_ANALYZER_SCHEMA,
  QUALITY_COST_PAF_SCHEMA,
  RECIPE_COST_CHECK_ANALYZER_SCHEMA,
  REPAIR_SHOP_QUOTE_SCHEMA,
  RESTAURANT_MENU_MARGIN_LEAK_SCHEMA,
  ROBOT_VS_MANUAL_ANALYZER_SCHEMA,
  ROUTE_OPTIMIZATION_ANALYZER,
  SAAS_SHELFWARE_ANALYZER,
  SEED_RATE_SCHEMA,
  SMED_CHANGEOVER_OPTIMIZER_ANALYZER,
  STEAM_TRAP_ENERGY_LOSS_ANALYZER,
  SUBCONTRACTOR_MARGIN_LEAK_SCHEMA,
  SUPPLIER_PERFORMANCE_TCO_ANALYZER,
  SUPPLY_CHAIN_DISRUPTION_SCHEMA,
  TAGUCHI_QUALITY_LOSS_ANALYZER,
  TAKT_TIME_FLEXIBILITY_SCHEMA,
  TEXTILE_WASTE_RISK_SCHEMA,
  TOTAL_EMPLOYEE_COST_SCHEMA,
  TRANSFER_PRICING_OPTIMIZER_SCHEMA,
  TRANSPORT_MODE_RISK_SCHEMA,
  WATER_USAGE_OPTIMIZER_ANALYZER,
  WELD_STRENGTH_SCHEMA,
  WELD_VOLUME_COST_SCHEMA,
];

export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = {
  "ai-token-cost-analyzer": "ai-token-cost-analyzer",
  "six-sigma-project-prioritizer": "six-sigma-project-prioritizer",
  "aql-sampling-risk-analyzer": "aql-sampling-risk-analyzer",
  "vehicle-depreciation-tco-analyzer": "vehicle-depreciation-tco-analyzer",
  "downtime-cost-analyzer": "downtime-cost-analyzer",
  "auto-repair-comeback-analyzer": "auto-repair-comeback-analyzer",
  "auto-repair-quote-consistency-analyzer": "auto-repair-quote-consistency-analyzer",
  "auto-shop-margin-leak-analyzer": "auto-shop-margin-leak-analyzer",
  "asme-pressure-vessel-analyzer": "asme-pressure-vessel-analyzer",
  "compressed-air-energy-cost-analyzer": "compressed-air-energy-cost-analyzer",
  "break-even-margin-of-safety-analyzer": "break-even-margin-of-safety-analyzer",
  "concrete-volume-cost-analyzer": "concrete-volume-cost-analyzer",
  "calibration-drift-risk-analyzer": "calibration-drift-risk-analyzer",
  "cbam-compliance-verdict-analyzer": "cbam-compliance-verdict-analyzer",
  "chatter-surface-quality-analyzer": "chatter-surface-quality-analyzer",
  "bolt-torque-preload-analyzer": "bolt-torque-preload-analyzer",
  "employee-turnover-cost-analyzer": "employee-turnover-cost-analyzer",
  "irr-npv-investment-analyzer": "irr-npv-investment-analyzer",
  "npv-risk-analyzer": "npv-risk-analyzer",
  "dcf-enterprise-valuator": "dcf-enterprise-valuator",
  "lease-vs-buy-analyzer": "lease-vs-buy-analyzer",
  "darcy-weisbach-pipe-flow-calculator": "darcy-weisbach-pipe-flow-calculator",
  "lmtd-heat-exchanger-calculator": "lmtd-heat-exchanger-calculator",
  "oee-six-big-losses-analyzer": "oee-six-big-losses-analyzer",
  "line-balancing-analyzer": "line-balancing-analyzer",
  "standard-time-work-study-calculator": "standard-time-work-study-calculator",
  "learning-curve-calculator": "learning-curve-calculator",
  "spring-design-calculator": "spring-design-calculator",
  "carbon-footprint-calculator": "carbon-footprint-calculator",
  "regression-analyzer": "regression-analyzer",
  "sample-size-calculator": "sample-size-calculator",
  "anova-analyzer": "anova-analyzer",
  "roi-analyzer": "roi-analyzer",
  "belt-pulley-gear-calculator": "belt-pulley-gear-calculator",
  // ── Batch 4 (Tools 101-140) ──
  "beam-weight-analyzer": "beam-weight-analyzer",
  "bid-risk-analyzer": "bid-risk-analyzer",
  "cash-flow-gap-analyzer": "cash-flow-gap-analyzer",
  "cleaning-bid-optimizer-analyzer": "cleaning-bid-optimizer-analyzer",
  "compressor-tank-sizing-analyzer": "compressor-tank-sizing-analyzer",
  "container-load-analyzer": "container-load-analyzer",
  "contract-incentive-analyzer": "contract-incentive-analyzer",
  "crop-yield-loss-analyzer": "crop-yield-loss-analyzer",
  "cut-fill-balance-analyzer": "cut-fill-balance-analyzer",
  "dairy-profit-detector-analyzer": "dairy-profit-detector-analyzer",
  "demand-forecast-stock-analyzer": "demand-forecast-stock-analyzer",
  "fabric-cutting-optimizer-analyzer": "fabric-cutting-optimizer-analyzer",
  "freight-cost-analyzer": "freight-cost-analyzer",
  "inventory-turnover-risk-analyzer": "inventory-turnover-risk-analyzer",
  "irrigation-cost-check-analyzer": "irrigation-cost-check-analyzer",
  "kwh-cost-analyzer": "kwh-cost-analyzer",
  "machine-economic-life-analyzer": "machine-economic-life-analyzer",
  "material-replacement-cost-analyzer": "material-replacement-cost-analyzer",
  "mtbf-mttr-financial-analyzer": "mtbf-mttr-financial-analyzer",
  "noise-vibration-cost-analyzer": "noise-vibration-cost-analyzer",
  "office-supplies-cost-analyzer": "office-supplies-cost-analyzer",
  "overtime-hiring-breakeven-analyzer": "overtime-hiring-breakeven-analyzer",
  "pallet-rack-optimizer-analyzer": "pallet-rack-optimizer-analyzer",
  "payment-terms-optimizer-analyzer": "payment-terms-optimizer-analyzer",
  "poka-yoke-roi-analyzer": "poka-yoke-roi-analyzer",
  "project-overrun-analyzer": "project-overrun-analyzer",
  "quality-cost-paf-analyzer": "quality-cost-paf-analyzer",
  "recipe-cost-check-analyzer": "recipe-cost-check-analyzer",
  "repair-shop-quote-analyzer": "repair-shop-quote-analyzer",
  "restaurant-menu-margin-leak-analyzer": "restaurant-menu-margin-leak-analyzer",
  "robot-vs-manual-analyzer": "robot-vs-manual-analyzer",
  "route-optimization-analyzer": "route-optimization-analyzer",
  "saas-shelfware-analyzer": "saas-shelfware-analyzer",
  "seed-rate-analyzer": "seed-rate-analyzer",
  "smed-changeover-optimizer-analyzer": "smed-changeover-optimizer-analyzer",
  "steam-trap-energy-loss-analyzer": "steam-trap-energy-loss-analyzer",
  "subcontractor-margin-leak-analyzer": "subcontractor-margin-leak-analyzer",
  "supplier-performance-tco-analyzer": "supplier-performance-tco-analyzer",
  "supply-chain-disruption-analyzer": "supply-chain-disruption-analyzer",
  "taguchi-quality-loss-analyzer": "taguchi-quality-loss-analyzer",
  "takt-time-flexibility-analyzer": "takt-time-flexibility-analyzer",
  "textile-waste-risk-analyzer": "textile-waste-risk-analyzer",
  "total-employee-cost-analyzer": "total-employee-cost-analyzer",
  "transfer-pricing-optimizer-analyzer": "transfer-pricing-optimizer-analyzer",
  "transport-mode-risk-analyzer": "transport-mode-risk-analyzer",
  "water-usage-optimizer-analyzer": "water-usage-optimizer-analyzer",
  "weld-strength-analyzer": "weld-strength-analyzer",
  "weld-volume-cost-analyzer": "weld-volume-cost-analyzer",
};

export function listPremiumSchemaIds(): readonly string[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map((schema) => schema.id);
}

/**
 * Deep-normalize a premium schema: replace all Turkish base fields
 * with their _i18n.en equivalents so the UI always renders English.
 */
function normalizeSchemaToEnglish(schema: PremiumCalculatorSchema): PremiumCalculatorSchema {
  // Cloned output — we mutate a working copy to bypass readonly
  const out = JSON.parse(JSON.stringify(schema)) as any;

  if (out.name_i18n?.en) out.name = out.name_i18n.en;
  if (out.painStatement_i18n?.en) out.painStatement = out.painStatement_i18n.en;

  if (out.inputs) {
    out.inputs = out.inputs.map((inp: any) => {
      if (inp.label_i18n?.en) inp.label = inp.label_i18n.en;
      if (inp.helper_i18n?.en) inp.helper = inp.helper_i18n.en;
      if (inp.expertMeaning_i18n?.en) inp.expertMeaning = inp.expertMeaning_i18n.en;
      if (inp.placeholder_i18n?.en) inp.placeholder = inp.placeholder_i18n.en;
      return inp;
    });
  }

  if (out.outputs) {
    out.outputs = out.outputs.map((o: any) => {
      if (o.label_i18n?.en) o.label = o.label_i18n.en;
      return o;
    });
  }

  if (out.thresholds) {
    out.thresholds = out.thresholds.map((t: any) => {
      if (t.warningMessage_i18n?.en) t.warningMessage = t.warningMessage_i18n.en;
      if (t.criticalMessage_i18n?.en) t.criticalMessage = t.criticalMessage_i18n.en;
      return t;
    });
  }

  if (out.reportTemplate) {
    if (out.reportTemplate.title_i18n?.en) {
      out.reportTemplate.title = out.reportTemplate.title_i18n.en;
    }
  }

  if (out.assumptions?.assumptionNotes && out.assumptions?.assumptionNotes_i18n) {
    out.assumptions.assumptionNotes = out.assumptions.assumptionNotes.map(
      (note: string, idx: number) =>
        out.assumptions.assumptionNotes_i18n[idx]?.en ?? note,
    );
  }

  return out as PremiumCalculatorSchema;
}

export function getPremiumCalculatorSchema(slug: string): PremiumCalculatorSchema | null {
  const normalized = slug.trim();
  const raw = PREMIUM_CALCULATOR_SCHEMAS.find(
    (schema) => schema.id === normalized || schema.legacyPaidSlug === normalized,
  ) ?? null;
  if (!raw) return null;
  // Always return English-normalized schema — no Turkish content in UI
  return normalizeSchemaToEnglish(raw);
}

export function getAllPremiumSchemas(): PremiumCalculatorSchema[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map(normalizeSchemaToEnglish);
}

export function getPremiumSchemaForPaidSlug(paidSlug: string): PremiumCalculatorSchema | null {
  const trimmed = paidSlug.trim();
  const schemaId = PREMIUM_SCHEMA_SLUG_MAP[trimmed];
  if (schemaId) {
    return getPremiumCalculatorSchema(schemaId);
  }
  return getPremiumCalculatorSchema(trimmed);
}
