// SectorCalc PRO V2 — Canonical Catalog Manifest
// Source of truth for all 20 PRO tools.
// Must reconcile: PRO_TOOLS_PAGE_SLUGS == CATALOG_MANIFEST_SLUGS
// Build fails on: duplicate, missing, or orphan entries.

import { readFileSync, existsSync } from "fs";
import { join } from "path";

export type ToolRuntimeStatus =
  | "PRO_V2_LIVE"       // Full PRO V2: correct form, schema, formula, auth, execute
  | "PRO_V2_PARTIAL"    // PRO V2 form present but some layer incomplete
  | "LEGACY_FALLBACK"   // Uses legacy form/runtime
  | "BLOCKED";          // Intentionally disabled

export interface ProCatalogEntry {
  slug: string;
  title: string;
  category: string;
  accessMode: "PRO";
  schemaPath: string;
  formulaPath: string;
  contractPath: string;
  adapterPath: string;
  insightPath: string;
  presetPath: string;
  registrationPath: string;  // init-registry.ts
  expectedInputCount: number;
  expectedOutputCount: number;
  decisionConvention: string;
  pdfCapable: boolean;
  currentRenderer: "ProExecutionFormV2" | "LegacyForm" | "Hybrid";
  runtimeStatus: ToolRuntimeStatus;
}

export const PRO_CATALOG: ProCatalogEntry[] = [
  // ── Wave A — Cost & Quotation ────────────────────────────────
  {
    slug: "break-even-survival-cash-calculator",
    title: "Break-Even & Survival Cash Calculator",
    category: "Finance",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/break-even-survival-cash-calculator.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/break-even-survival-cash-calculator.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/break-even-survival-cash-calculator.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/break-even-survival-cash-calculator.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/break-even-survival-cash-calculator.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/break-even-survival-cash-calculator.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 12,
    expectedOutputCount: 17,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "machine-hourly-rate-proof-report",
    title: "Machine Hourly Rate Proof Report",
    category: "Operations",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/machine-hourly-rate-proof-report.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/machine-hourly-rate-proof-report.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/machine-hourly-rate-proof-report.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/machine-hourly-rate-proof-report.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/machine-hourly-rate-proof-report.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 23,
    expectedOutputCount: 34,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "job-quote-builder-pro-pack",
    title: "Job Quote Builder Pro Pack",
    category: "Cost & Quotation",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/job-quote-builder-pro-pack.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/job-quote-builder-pro-pack.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/job-quote-builder-pro-pack.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/job-quote-builder-pro-pack.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/job-quote-builder-pro-pack.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/job-quote-builder-pro-pack.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 18,
    expectedOutputCount: 34,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "loss-making-job-detector",
    title: "Loss-Making Job Detector",
    category: "Cost & Quotation",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/loss-making-job-detector.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/loss-making-job-detector.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/loss-making-job-detector.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/loss-making-job-detector.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/loss-making-job-detector.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/loss-making-job-detector.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 12,
    expectedOutputCount: 21,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "true-employee-cost-statement",
    title: "True Employee Cost Statement",
    category: "Finance",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/true-employee-cost-statement.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/true-employee-cost-statement.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/true-employee-cost-statement.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/true-employee-cost-statement.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/true-employee-cost-statement.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/true-employee-cost-statement.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 12,
    expectedOutputCount: 18,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },

  // ── Wave B — Profitability ───────────────────────────────────
  {
    slug: "product-sku-margin-ranker",
    title: "Product & SKU Margin Ranker",
    category: "Profitability",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/product-sku-margin-ranker.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/product-sku-margin-ranker.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/product-sku-margin-ranker.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/product-sku-margin-ranker.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/product-sku-margin-ranker.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 12,
    expectedOutputCount: 13,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "customer-sku-profitability-forensics",
    title: "Customer & SKU Profitability Forensics",
    category: "Profitability",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/customer-sku-profitability-forensics.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/customer-sku-profitability-forensics.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/customer-sku-profitability-forensics.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/customer-sku-profitability-forensics.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/customer-sku-profitability-forensics.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 7,
    expectedOutputCount: 15,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "receivables-cost-payment-term-addendum",
    title: "Receivables Cost & Payment Term Addendum",
    category: "Finance",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/receivables-cost-payment-term-addendum.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/receivables-cost-payment-term-addendum.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/receivables-cost-payment-term-addendum.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/receivables-cost-payment-term-addendum.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/receivables-cost-payment-term-addendum.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 12,
    expectedOutputCount: 12,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "fx-commodity-pass-through-pricer",
    title: "FX & Commodity Pass-Through Pricer",
    category: "Pricing",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/fx-commodity-pass-through-pricer.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/fx-commodity-pass-through-pricer.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/fx-commodity-pass-through-pricer.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/fx-commodity-pass-through-pricer.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/fx-commodity-pass-through-pricer.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 9,
    expectedOutputCount: 15,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "plant-wide-shop-rate-cost-structure-audit",
    title: "Plant-Wide Shop Rate & Cost Structure Audit",
    category: "Operations",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/plant-wide-shop-rate-cost-structure-audit.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/plant-wide-shop-rate-cost-structure-audit.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/plant-wide-shop-rate-cost-structure-audit.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/plant-wide-shop-rate-cost-structure-audit.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/plant-wide-shop-rate-cost-structure-audit.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 9,
    expectedOutputCount: 15,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },

  // ── Wave C — Operations ──────────────────────────────────────
  {
    slug: "downtime-scrap-loss-statement",
    title: "Downtime & Scrap Loss Statement",
    category: "Operations",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/downtime-scrap-loss-statement.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/downtime-scrap-loss-statement.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/downtime-scrap-loss-statement.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/downtime-scrap-loss-statement.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/downtime-scrap-loss-statement.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 10,
    expectedOutputCount: 13,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "oee-loss-monetization-improvement-business-case",
    title: "OEE Loss Monetization & Improvement Business Case",
    category: "Operations",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/oee-loss-monetization-improvement-business-case.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/oee-loss-monetization-improvement-business-case.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/oee-loss-monetization-improvement-business-case.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/oee-loss-monetization-improvement-business-case.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/oee-loss-monetization-improvement-business-case.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 10,
    expectedOutputCount: 16,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "scrap-rework-cost-tracker",
    title: "Scrap & Rework Cost Tracker",
    category: "Quality",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/scrap-rework-cost-tracker.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/scrap-rework-cost-tracker.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/scrap-rework-cost-tracker.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/scrap-rework-cost-tracker.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/scrap-rework-cost-tracker.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 10,
    expectedOutputCount: 14,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "setup-time-reduction-roi-smed",
    title: "Setup Time Reduction ROI (SMED)",
    category: "Operations",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/setup-time-reduction-roi-smed.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/setup-time-reduction-roi-smed.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/setup-time-reduction-roi-smed.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/setup-time-reduction-roi-smed.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/setup-time-reduction-roi-smed.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 12,
    expectedOutputCount: 12,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "outsource-vs-in-house-analyzer",
    title: "Outsource vs. In-House Analyzer",
    category: "Operations",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/outsource-vs-in-house-analyzer.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/outsource-vs-in-house-analyzer.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/outsource-vs-in-house-analyzer.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/outsource-vs-in-house-analyzer.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/outsource-vs-in-house-analyzer.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 10,
    expectedOutputCount: 14,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },

  // ── Wave D — Investment & Energy ─────────────────────────────
  {
    slug: "capital-equipment-investment-appraisal-npv-irr",
    title: "Capital Equipment Investment Appraisal (NPV/IRR)",
    category: "Investment",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/capital-equipment-investment-appraisal-npv-irr.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/capital-equipment-investment-appraisal-npv-irr.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/capital-equipment-investment-appraisal-npv-irr.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/capital-equipment-investment-appraisal-npv-irr.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/capital-equipment-investment-appraisal-npv-irr.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/capital-equipment-investment-appraisal-npv-irr.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 12,
    expectedOutputCount: 17,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "machine-investment-feasibility-buy-lease-keep",
    title: "Machine Investment Feasibility — Buy / Lease / Keep",
    category: "Investment",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/machine-investment-feasibility-buy-lease-keep.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/machine-investment-feasibility-buy-lease-keep.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/machine-investment-feasibility-buy-lease-keep.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/machine-investment-feasibility-buy-lease-keep.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/machine-investment-feasibility-buy-lease-keep.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 12,
    expectedOutputCount: 15,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "motor-compressor-replacement-roi",
    title: "Motor & Compressor Replacement ROI",
    category: "Energy",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/motor-compressor-replacement-roi.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/motor-compressor-replacement-roi.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/motor-compressor-replacement-roi.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/motor-compressor-replacement-roi.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/motor-compressor-replacement-roi.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 11,
    expectedOutputCount: 14,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
  {
    slug: "energy-efficiency-grant-incentive-feasibility-pack",
    title: "Energy Efficiency Grant & Incentive Feasibility Pack",
    category: "Energy",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/energy-efficiency-grant-incentive-feasibility-pack.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/energy-efficiency-grant-incentive-feasibility-pack.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/energy-efficiency-grant-incentive-feasibility-pack.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/energy-efficiency-grant-incentive-feasibility-pack.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 10,
    expectedOutputCount: 14,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },

  // ── Wave 0 — Golden Reference ────────────────────────────────
  {
    slug: "weld-procedure-cost-consumable-estimation-suite",
    title: "Weld Procedure Cost & Consumable Estimation Suite",
    category: "Welding",
    accessMode: "PRO",
    schemaPath: "src/sectorcalc/schemas/pro-v531/weld-procedure-cost-consumable-estimation-suite.schema.json",
    formulaPath: "src/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula.ts",
    contractPath: "src/sectorcalc/pro-v2/contracts/weld-procedure-cost-consumable-estimation-suite.contract.ts",
    adapterPath: "src/sectorcalc/pro-v2/adapters/weld-procedure-cost-consumable-estimation-suite.adapter.ts",
    insightPath: "src/sectorcalc/pro-v2/insights/weld-procedure-cost-consumable-estimation-suite.insight.ts",
    presetPath: "src/sectorcalc/pro-v2/presets/weld-procedure-cost-consumable-estimation-suite.presets.ts",
    registrationPath: "src/sectorcalc/pro-v2/init-registry.ts",
    expectedInputCount: 11,
    expectedOutputCount: 16,
    decisionConvention: "0=GOOD,1=REVIEW,2=BLOCKED",
    pdfCapable: true,
    currentRenderer: "ProExecutionFormV2",
    runtimeStatus: "PRO_V2_LIVE",
  },
];

/** Verify no duplicates in the manifest. */
export function getCatalogSlugs(): string[] {
  return PRO_CATALOG.map((e) => e.slug);
}

const slugSet = new Set(PRO_CATALOG.map((e) => e.slug));
if (slugSet.size !== PRO_CATALOG.length) {
  throw new Error(
    `CATALOG_MANIFEST_ERROR: ${PRO_CATALOG.length - slugSet.size} duplicate slug(s) detected`
  );
}

/** Get the expected output count for a tool (from manifest). */
export function getExpectedOutputCount(slug: string): number | null {
  return PRO_CATALOG.find((e) => e.slug === slug)?.expectedOutputCount ?? null;
}

/** Check if all manifest files exist on disk. */
export function verifyManifestFiles(): string[] {
  const errors: string[] = [];
  for (const entry of PRO_CATALOG) {
    for (const key of ["schemaPath", "formulaPath", "contractPath", "adapterPath", "insightPath", "presetPath"] as const) {
      const p = join(process.cwd(), entry[key]);
      if (!existsSync(p)) {
        errors.push(`MISSING: ${entry[key]} for ${entry.slug}`);
      }
    }
  }
  return errors;
}

/** Reconcile 3 slug sets: catalog, active-tool-allowlist, and render tool definitions. */
export function reconcileSlugSets(
  catalogSlugs: string[],
  allowlistSlugs: string[],
  registrySlugs: string[],
): string[] {
  const errors: string[] = [];
  const c = new Set(catalogSlugs);
  const a = new Set(allowlistSlugs);
  const r = new Set(registrySlugs);

  for (const s of c) {
    if (!a.has(s)) errors.push(`ALLOWLIST_MISSING: ${s} is in catalog but not in allowlist`);
    if (!r.has(s)) errors.push(`REGISTRY_MISSING: ${s} is in catalog but not in registry`);
  }
  for (const s of a) {
    if (!c.has(s)) errors.push(`CATALOG_MISSING: ${s} is in allowlist but not in catalog`);
  }
  for (const s of r) {
    if (!c.has(s)) errors.push(`CATALOG_MISSING: ${s} is in registry but not in catalog`);
  }

  return errors;
}

export const CATALOG_TOOL_COUNT = PRO_CATALOG.length;
