// SectorCalc V5.4 Core — PRO Formula Module Resolver
// Static registry that maps toolKey → calculate() for all 20 live PRO tools.
// Server-side only. Never imported by client modules.
// Avoids dynamic import() which Next.js/Webpack cannot tree-shake reliably.

import "server-only";

export interface FormulaModuleResult {
  status: string;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: string;
}

interface FormulaModule {
  toolKey: string;
  formulaVersion: string;
  calculate: (inputs: Record<string, number>) => FormulaModuleResult;
}

// Static imports — all 20 PRO tool formula modules
// Batch 1 (10 tools)
import * as breakEven from "./break-even-survival-cash-calculator.formula";
import * as machineHourly from "./machine-hourly-rate-proof-report.formula";
import * as lossMakingJob from "./loss-making-job-detector.formula";
import * as receivablesCost from "./receivables-cost-payment-term-addendum.formula";
import * as setupTimeRoi from "./setup-time-reduction-roi-smed.formula";
import * as productSku from "./product-sku-margin-ranker.formula";
import * as trueEmployee from "./true-employee-cost-statement.formula";
import * as jobQuote from "./job-quote-builder-pro-pack.formula";
import * as machineFeasibility from "./machine-investment-feasibility-buy-lease-keep.formula";
import * as capitalEquipment from "./capital-equipment-investment-appraisal-npv-irr.formula";

// Batch 2 (10 tools)
import * as customerSku from "./customer-sku-profitability-forensics.formula";
import * as downtimeScrap from "./downtime-scrap-loss-statement.formula";
import * as oeeLoss from "./oee-loss-monetization-improvement-business-case.formula";
import * as scrapRework from "./scrap-rework-cost-tracker.formula";
import * as outsource from "./outsource-vs-in-house-analyzer.formula";
import * as plantWide from "./plant-wide-shop-rate-cost-structure-audit.formula";
import * as fxCommodity from "./fx-commodity-pass-through-pricer.formula";
import * as energyEfficiency from "./energy-efficiency-grant-incentive-feasibility-pack.formula";
import * as motorCompressor from "./motor-compressor-replacement-roi.formula";
import * as weldProcedure from "./weld-procedure-cost-consumable-estimation-suite.formula";

const MODULES: FormulaModule[] = [
  // Batch 1
  breakEven, machineHourly, lossMakingJob, receivablesCost,
  setupTimeRoi, productSku, trueEmployee, jobQuote,
  machineFeasibility, capitalEquipment,
  // Batch 2
  customerSku, downtimeScrap, oeeLoss, scrapRework,
  outsource, plantWide, fxCommodity, energyEfficiency,
  motorCompressor, weldProcedure,
] as unknown as FormulaModule[];

const moduleByToolKey = new Map<string, FormulaModule>();
for (const mod of MODULES) {
  if (mod.toolKey) {
    moduleByToolKey.set(mod.toolKey, mod);
  }
}

export function resolveFormulaModule(toolKey: string): FormulaModule | null {
  return moduleByToolKey.get(toolKey) ?? null;
}

export function hasFormulaModule(toolKey: string): boolean {
  return moduleByToolKey.has(toolKey);
}

export function getRegisteredToolKeys(): string[] {
  return Array.from(moduleByToolKey.keys());
}
