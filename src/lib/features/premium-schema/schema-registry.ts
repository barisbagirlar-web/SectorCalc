
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
import { BREAK_EVEN_SCHEMA } from "@/lib/features/premium-schema/schemas/break-even-margin-of-safety-analyzer";
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
import { CASH_FLOW_GAP_SCHEMA } from "@/lib/features/premium-schema/schemas/cash-flow-gap-analyzer";
import { CLEANING_BID_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/cleaning-bid-optimizer-analyzer";
import { CONTRACT_INCENTIVE_ANALYZER } from "@/lib/features/premium-schema/schemas/contract-incentive-analyzer";
import { CROP_YIELD_LOSS_SCHEMA } from "@/lib/features/premium-schema/schemas/crop-yield-loss-analyzer";
import { DAIRY_PROFIT_DETECTOR_ANALYZER } from "@/lib/features/premium-schema/schemas/dairy-profit-detector-analyzer";
import { DEMAND_FORECAST_STOCK_SCHEMA } from "@/lib/features/premium-schema/schemas/demand-forecast-stock-analyzer";
import { FABRIC_CUTTING_SCHEMA } from "@/lib/features/premium-schema/schemas/fabric-cutting-optimizer-analyzer";
import { INVENTORY_TURNOVER_RISK_ANALYZER } from "@/lib/features/premium-schema/schemas/inventory-turnover-risk-analyzer";
import { IRRIGATION_COST_CHECK_ANALYZER } from "@/lib/features/premium-schema/schemas/irrigation-cost-check-analyzer";
import { OFFICE_SUPPLIES_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/office-supplies-cost-analyzer";
import { OVERTIME_HIRING_BREAKEVEN_SCHEMA } from "@/lib/features/premium-schema/schemas/overtime-hiring-breakeven-analyzer";
import { PALLET_RACK_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/pallet-rack-optimizer-analyzer";
import { PAYMENT_TERMS_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/payment-terms-optimizer-analyzer";
import { RECIPE_COST_CHECK_ANALYZER_SCHEMA } from "@/lib/features/premium-schema/schemas/recipe-cost-check-analyzer";
import { RESTAURANT_MENU_MARGIN_LEAK_SCHEMA } from "@/lib/features/premium-schema/schemas/restaurant-menu-margin-leak-analyzer";
import { SAAS_SHELFWARE_ANALYZER } from "@/lib/features/premium-schema/schemas/saas-shelfware-analyzer";
import { SEED_RATE_SCHEMA } from "@/lib/features/premium-schema/schemas/seed-rate-analyzer";
import { SUPPLY_CHAIN_DISRUPTION_SCHEMA } from "@/lib/features/premium-schema/schemas/supply-chain-disruption-analyzer";
import { TAGUCHI_QUALITY_LOSS_ANALYZER } from "@/lib/features/premium-schema/schemas/taguchi-quality-loss-analyzer";
import { TEXTILE_WASTE_RISK_SCHEMA } from "@/lib/features/premium-schema/schemas/textile-waste-risk-analyzer";
import { TOTAL_EMPLOYEE_COST_SCHEMA } from "@/lib/features/premium-schema/schemas/total-employee-cost-analyzer";
import { TRANSFER_PRICING_OPTIMIZER_SCHEMA } from "@/lib/features/premium-schema/schemas/transfer-pricing-optimizer-analyzer";
import { WATER_USAGE_OPTIMIZER_ANALYZER } from "@/lib/features/premium-schema/schemas/water-usage-optimizer-analyzer";

/** Premium 152 batch 1 - schema-backed calculators. */
export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [
  AI_TOKEN_COST_ANALYZER_SCHEMA,
  BREAK_EVEN_SCHEMA,
  TURNOVER_COST_SCHEMA,
  // ── Batch 2 (Tools 21-60) ──

  // ── Batch 3 (Tools 31-40) ──

  // ── Batch 4 (Tools 101-140) ──
  CASH_FLOW_GAP_SCHEMA,
  CLEANING_BID_OPTIMIZER_SCHEMA,
  CONTRACT_INCENTIVE_ANALYZER,
  CROP_YIELD_LOSS_SCHEMA,
  DAIRY_PROFIT_DETECTOR_ANALYZER,
  DEMAND_FORECAST_STOCK_SCHEMA,
  FABRIC_CUTTING_SCHEMA,
  INVENTORY_TURNOVER_RISK_ANALYZER,
  IRRIGATION_COST_CHECK_ANALYZER,
  OFFICE_SUPPLIES_COST_SCHEMA,
  OVERTIME_HIRING_BREAKEVEN_SCHEMA,
  PALLET_RACK_OPTIMIZER_SCHEMA,
  PAYMENT_TERMS_OPTIMIZER_SCHEMA,
  RECIPE_COST_CHECK_ANALYZER_SCHEMA,
  RESTAURANT_MENU_MARGIN_LEAK_SCHEMA,
  SAAS_SHELFWARE_ANALYZER,
  SEED_RATE_SCHEMA,
  SUPPLY_CHAIN_DISRUPTION_SCHEMA,
  TAGUCHI_QUALITY_LOSS_ANALYZER,
  TEXTILE_WASTE_RISK_SCHEMA,
  TOTAL_EMPLOYEE_COST_SCHEMA,
  TRANSFER_PRICING_OPTIMIZER_SCHEMA,
  WATER_USAGE_OPTIMIZER_ANALYZER,
];

export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = {
  "ai-token-cost-analyzer": "ai-token-cost-analyzer",
  "break-even-margin-of-safety-analyzer": "break-even-margin-of-safety-analyzer",
  "employee-turnover-cost-analyzer": "employee-turnover-cost-analyzer",
  "irr-npv-investment-analyzer": "irr-npv-investment-analyzer",
  "npv-risk-analyzer": "npv-risk-analyzer",
  "dcf-enterprise-valuator": "dcf-enterprise-valuator",
  "lease-vs-buy-analyzer": "lease-vs-buy-analyzer",
  "learning-curve-calculator": "learning-curve-calculator",
  "carbon-footprint-calculator": "carbon-footprint-calculator",
  "regression-analyzer": "regression-analyzer",
  "anova-analyzer": "anova-analyzer",
  "roi-analyzer": "roi-analyzer",
  // ── Batch 4 (Tools 101-140) ──
  "cash-flow-gap-analyzer": "cash-flow-gap-analyzer",
  "cleaning-bid-optimizer-analyzer": "cleaning-bid-optimizer-analyzer",
  "contract-incentive-analyzer": "contract-incentive-analyzer",
  "crop-yield-loss-analyzer": "crop-yield-loss-analyzer",
  "dairy-profit-detector-analyzer": "dairy-profit-detector-analyzer",
  "demand-forecast-stock-analyzer": "demand-forecast-stock-analyzer",
  "fabric-cutting-optimizer-analyzer": "fabric-cutting-optimizer-analyzer",
  "inventory-turnover-risk-analyzer": "inventory-turnover-risk-analyzer",
  "irrigation-cost-check-analyzer": "irrigation-cost-check-analyzer",
  "office-supplies-cost-analyzer": "office-supplies-cost-analyzer",
  "overtime-hiring-breakeven-analyzer": "overtime-hiring-breakeven-analyzer",
  "pallet-rack-optimizer-analyzer": "pallet-rack-optimizer-analyzer",
  "payment-terms-optimizer-analyzer": "payment-terms-optimizer-analyzer",
  "recipe-cost-check-analyzer": "recipe-cost-check-analyzer",
  "restaurant-menu-margin-leak-analyzer": "restaurant-menu-margin-leak-analyzer",
  "saas-shelfware-analyzer": "saas-shelfware-analyzer",
  "seed-rate-analyzer": "seed-rate-analyzer",
  "supply-chain-disruption-analyzer": "supply-chain-disruption-analyzer",
  "taguchi-quality-loss-analyzer": "taguchi-quality-loss-analyzer",
  "textile-waste-risk-analyzer": "textile-waste-risk-analyzer",
  "total-employee-cost-analyzer": "total-employee-cost-analyzer",
  "transfer-pricing-optimizer-analyzer": "transfer-pricing-optimizer-analyzer",
  "water-usage-optimizer-analyzer": "water-usage-optimizer-analyzer",
};

export function listPremiumSchemaIds(): readonly string[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map((schema) => schema.id);
}

/**
 * Deep-normalize a premium schema: replace all Turkish base fields
 * with their _i18n.en equivalents so the UI always renders English.
 */
function normalizeSchemaToEnglish(schema: PremiumCalculatorSchema): PremiumCalculatorSchema {
  // Cloned output - we mutate a working copy to bypass readonly
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
  // Always return English-normalized schema - no Turkish content in UI
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
