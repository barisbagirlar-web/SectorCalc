// SectorCalc PRO Engine Governance — Formula Module Resolver
// Static registry that maps toolKey → calculate() for all 20 LIVE PRO tools.
// Server-side only. Never imported by client modules.
// No PASS_THROUGH. No stubs. No dynamic import.

import "server-only";
import type { ProFormulaModule } from "./pro-formula-contract";

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

const MODULES: ProFormulaModule[] = [
  breakEven, machineHourly, lossMakingJob, receivablesCost,
  setupTimeRoi, productSku, trueEmployee, jobQuote,
  machineFeasibility, capitalEquipment,
  customerSku, downtimeScrap, oeeLoss, scrapRework,
  outsource, plantWide, fxCommodity, energyEfficiency,
  motorCompressor, weldProcedure,
] as ProFormulaModule[];

const moduleByToolKey = new Map<string, ProFormulaModule>();
for (const mod of MODULES) {
  if (mod.toolKey) {
    moduleByToolKey.set(mod.toolKey, mod);
  }
}

export function resolveFormulaModule(toolKey: string): ProFormulaModule | null {
  return moduleByToolKey.get(toolKey) ?? null;
}

export function hasFormulaModule(toolKey: string): boolean {
  return moduleByToolKey.has(toolKey);
}

export function getRegisteredToolKeys(): string[] {
  return Array.from(moduleByToolKey.keys());
}

export function getAllModules(): ProFormulaModule[] {
  return [...MODULES];
}

export { type ProFormulaModule };
