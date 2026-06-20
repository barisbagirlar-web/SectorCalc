import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import { THREE_B_PRINTING_SUPPORT_POST_PROCESS_SCHEMA } from "@/lib/premium-schema/schemas/3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator";
import { THREE_B_PRINTING_BATCH_NESTING_SCHEMA } from "@/lib/premium-schema/schemas/3b-baski-parti-optimizasyonu-ve-yuvalama-calculator";
import { THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_SCHEMA } from "@/lib/premium-schema/schemas/3b-baski-vs-talasli-imalat-basabas-noktasi-calculator";
import { FIVE_S_AUDIT_EFFICIENCY_LOSS_SCHEMA } from "@/lib/premium-schema/schemas/5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator";
import { SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA } from "@/lib/premium-schema/schemas/7-israf-muda-avcisi-parasal-karsilik-calculator";
import { ALL_INDUSTRIAL_FORMULA_SCHEMAS } from "@/lib/premium-schema/schemas/industrial-formulas-schemas";
import { AI_TOKEN_COST_ANALYZER_SCHEMA } from "@/lib/premium-schema/schemas/ai-token-cost-analyzer";
import { SIX_SIGMA_PRIORITIZER_SCHEMA } from "@/lib/premium-schema/schemas/six-sigma-project-prioritizer";
import { AQL_SAMPLING_SCHEMA } from "@/lib/premium-schema/schemas/aql-sampling-risk-analyzer";
import { VEHICLE_DEPRECIATION_SCHEMA } from "@/lib/premium-schema/schemas/vehicle-depreciation-tco-analyzer";
import { DOWNTIME_COST_ANALYZER_SCHEMA } from "@/lib/premium-schema/schemas/downtime-cost-analyzer";
import { AUTO_REPAIR_COMEBACK_SCHEMA } from "@/lib/premium-schema/schemas/auto-repair-comeback-analyzer";
import { AUTO_REPAIR_QUOTE_SCHEMA } from "@/lib/premium-schema/schemas/auto-repair-quote-consistency-analyzer";
import { AUTO_SHOP_MARGIN_LEAK_SCHEMA } from "@/lib/premium-schema/schemas/auto-shop-margin-leak-analyzer";
import { ASME_VESSEL_SCHEMA } from "@/lib/premium-schema/schemas/asme-pressure-vessel-analyzer";
import { COMPRESSED_AIR_SCHEMA } from "@/lib/premium-schema/schemas/compressed-air-energy-cost-analyzer";
import { BREAK_EVEN_SCHEMA } from "@/lib/premium-schema/schemas/break-even-margin-of-safety-analyzer";
import { CONCRETE_VOLUME_SCHEMA } from "@/lib/premium-schema/schemas/concrete-volume-cost-analyzer";
import { CALIBRATION_DRIFT_SCHEMA } from "@/lib/premium-schema/schemas/calibration-drift-risk-analyzer";
import { CBAM_EXPOSURE_SCHEMA } from "@/lib/premium-schema/schemas/cbam-exposure-analyzer";
import { CBAM_COMPLIANCE_SCHEMA } from "@/lib/premium-schema/schemas/cbam-compliance-verdict-analyzer";
import { CHATTER_SCHEMA } from "@/lib/premium-schema/schemas/chatter-surface-quality-analyzer";
import { BOLT_TORQUE_SCHEMA } from "@/lib/premium-schema/schemas/bolt-torque-preload-analyzer";
import { TURNOVER_COST_SCHEMA } from "@/lib/premium-schema/schemas/employee-turnover-cost-analyzer";
import { CLOUD_API_OVERRUN_SCHEMA } from "@/lib/premium-schema/schemas/cloud-api-overrun-analyzer";
import { CLOUD_WASTE_ELIMINATION_SCHEMA } from "@/lib/premium-schema/schemas/cloud-waste-elimination-analyzer";

/** Premium 152 batch 1 — schema-backed calculators. */
export const PREMIUM_CALCULATOR_SCHEMAS: readonly PremiumCalculatorSchema[] = [
  SEVEN_MUDA_WASTE_COST_CALCULATOR_SCHEMA,
  FIVE_S_AUDIT_EFFICIENCY_LOSS_SCHEMA,
  THREE_B_PRINTING_SUPPORT_POST_PROCESS_SCHEMA,
  THREE_B_PRINTING_BATCH_NESTING_SCHEMA,
  THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_SCHEMA,
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
  CBAM_EXPOSURE_SCHEMA,
  CBAM_COMPLIANCE_SCHEMA,
  CHATTER_SCHEMA,
  BOLT_TORQUE_SCHEMA,
  TURNOVER_COST_SCHEMA,
  CLOUD_API_OVERRUN_SCHEMA,
  CLOUD_WASTE_ELIMINATION_SCHEMA,
  ...ALL_INDUSTRIAL_FORMULA_SCHEMAS,
];

export const PREMIUM_SCHEMA_SLUG_MAP: Readonly<Record<string, string>> = {
  "7-israf-muda-avcisi-parasal-karsilik-calculator":
    "7-israf-muda-avcisi-parasal-karsilik-calculator",
  "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator":
    "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator":
    "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator":
    "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator":
    "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator",
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
  "cbam-exposure-analyzer": "cbam-exposure-analyzer",
  "cbam-compliance-verdict-analyzer": "cbam-compliance-verdict-analyzer",
  "chatter-surface-quality-analyzer": "chatter-surface-quality-analyzer",
  "bolt-torque-preload-analyzer": "bolt-torque-preload-analyzer",
  "employee-turnover-cost-analyzer": "employee-turnover-cost-analyzer",
  "cloud-api-overrun-analyzer": "cloud-api-overrun-analyzer",
  "cloud-waste-elimination-analyzer": "cloud-waste-elimination-analyzer",
  "irr-investment-analyzer": "irr-investment-analyzer",
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
  "hydraulic-cylinder-calculator": "hydraulic-cylinder-calculator",
};

export function listPremiumSchemaIds(): readonly string[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map((schema) => schema.id);
}

export function getPremiumCalculatorSchema(slug: string): PremiumCalculatorSchema | null {
  const normalized = slug.trim();
  return PREMIUM_CALCULATOR_SCHEMAS.find(
    (schema) => schema.id === normalized || schema.legacyPaidSlug === normalized,
  ) ?? null;
}

export function getPremiumSchemaForPaidSlug(paidSlug: string): PremiumCalculatorSchema | null {
  const schemaId = PREMIUM_SCHEMA_SLUG_MAP[paidSlug.trim()];
  if (!schemaId) {
    return null;
  }
  return getPremiumCalculatorSchema(schemaId);
}
