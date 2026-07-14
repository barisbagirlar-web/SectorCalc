import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const LOSS_MAKING_JOB_FORMULA_VERSION = "2.0.0";
export const LOSS_MAKING_JOB_SCHEMA_VERSION = "5.3.1-pro-loss-making-job.1";
export const LOSS_MAKING_JOB_MODEL_ID = "PRO_FULL_COST_JOB_PROFITABILITY_V2";
export const LOSS_MAKING_JOB_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface LossMakingJobInputs {
  machineRatePerHour: string | number;
  cycleSecondsPerUnit: string | number;
  setupSecondsPerJob: string | number;
  jobQuantity: string | number;
  materialCostPerUnit: string | number;
  targetGrossMarginRatio: string | number;
  annualVolume: string | number;
  laborRatePerHour: string | number;
  annualOverheadPool: string | number;
  otherDirectJobCost: string | number;
  quotedJobRevenue: string | number;
  sourceConfidenceRatio: string | number;
}

export interface LossMakingJobResult {
  setupSecondsPerUnit: Decimal;
  effectiveSecondsPerUnit: Decimal;
  machineCostPerUnit: Decimal;
  laborCostPerUnit: Decimal;
  materialCostPerUnit: Decimal;
  overheadCostPerUnit: Decimal;
  otherDirectCostPerUnit: Decimal;
  fullyLoadedCostPerUnit: Decimal;
  fullyLoadedJobCost: Decimal;
  quotedJobRevenue: Decimal;
  grossProfit: Decimal;
  grossMarginRatio: Decimal;
  targetGrossMarginRatio: Decimal;
  minimumQuoteTotal: Decimal;
  quoteGapToTarget: Decimal;
  annualEquivalentJobs: Decimal;
  annualEquivalentGrossProfit: Decimal;
  sourceConfidenceRatio: Decimal;
  profitUncertainty: Decimal;
  profitLowerBound: Decimal;
  profitUpperBound: Decimal;
  moneyAtRisk: Decimal;
  primaryUnitCostDriver: 0 | 1 | 2 | 3 | 4;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO";

export function evaluateLossMakingJob(
  inputs: LossMakingJobInputs,
): DomainResult<LossMakingJobResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: Kind): DomainResult<Decimal> => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if (kind === "POSITIVE" && parsed.value.lte("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    }
    if (kind === "NON_NEGATIVE" && parsed.value.lt("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if (kind === "POSITIVE_INTEGER" && (parsed.value.lte("0") || !parsed.value.round(0, 0).eq(parsed.value))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer count.` });
    }
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    return parsed;
  };

  const machineRate = read(inputs.machineRatePerHour, "machine_rate_per_hour", "NON_NEGATIVE");
  if (!machineRate.ok) return machineRate;
  const cycle = read(inputs.cycleSecondsPerUnit, "cycle_seconds_per_unit", "POSITIVE");
  if (!cycle.ok) return cycle;
  const setup = read(inputs.setupSecondsPerJob, "setup_seconds_per_job", "NON_NEGATIVE");
  if (!setup.ok) return setup;
  const quantity = read(inputs.jobQuantity, "job_quantity", "POSITIVE_INTEGER");
  if (!quantity.ok) return quantity;
  const material = read(inputs.materialCostPerUnit, "material_cost_per_unit", "NON_NEGATIVE");
  if (!material.ok) return material;
  const targetMargin = read(inputs.targetGrossMarginRatio, "target_gross_margin_ratio", "RATIO");
  if (!targetMargin.ok) return targetMargin;
  if (targetMargin.value.eq("1")) {
    return err({ code: "DOMAIN_VIOLATION", field: "target_gross_margin_ratio", message: "Target gross margin must be less than 1." });
  }
  const annualVolume = read(inputs.annualVolume, "annual_volume", "POSITIVE_INTEGER");
  if (!annualVolume.ok) return annualVolume;
  const laborRate = read(inputs.laborRatePerHour, "labor_rate_per_hour", "NON_NEGATIVE");
  if (!laborRate.ok) return laborRate;
  const overhead = read(inputs.annualOverheadPool, "annual_overhead_pool", "NON_NEGATIVE");
  if (!overhead.ok) return overhead;
  const otherDirect = read(inputs.otherDirectJobCost, "other_direct_job_cost", "NON_NEGATIVE");
  if (!otherDirect.ok) return otherDirect;
  const quotedRevenue = read(inputs.quotedJobRevenue, "quoted_job_revenue", "POSITIVE");
  if (!quotedRevenue.ok) return quotedRevenue;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const setupSecondsPerUnit = setup.value.div(quantity.value);
  const effectiveSecondsPerUnit = cycle.value.plus(setupSecondsPerUnit);
  const machineCostPerUnit = machineRate.value.times(effectiveSecondsPerUnit).div("3600");
  const laborCostPerUnit = laborRate.value.times(effectiveSecondsPerUnit).div("3600");
  const overheadCostPerUnit = overhead.value.div(annualVolume.value);
  const otherDirectCostPerUnit = otherDirect.value.div(quantity.value);
  const fullyLoadedCostPerUnit = material.value
    .plus(machineCostPerUnit)
    .plus(laborCostPerUnit)
    .plus(overheadCostPerUnit)
    .plus(otherDirectCostPerUnit);
  const fullyLoadedJobCost = fullyLoadedCostPerUnit.times(quantity.value);
  const grossProfit = quotedRevenue.value.minus(fullyLoadedJobCost);
  const grossMarginRatio = grossProfit.div(quotedRevenue.value);
  const minimumQuoteTotal = fullyLoadedJobCost.div(context.DecimalConstructor("1").minus(targetMargin.value));
  const quoteGapToTarget = quotedRevenue.value.minus(minimumQuoteTotal);
  const annualEquivalentJobs = annualVolume.value.div(quantity.value);
  const annualEquivalentGrossProfit = grossProfit.times(annualEquivalentJobs);
  const profitUncertainty = fullyLoadedJobCost.times(context.DecimalConstructor("1").minus(confidence.value));
  const profitLowerBound = grossProfit.minus(profitUncertainty);
  const profitUpperBound = grossProfit.plus(profitUncertainty);
  const moneyAtRisk = profitLowerBound.lt("0") ? profitLowerBound.abs() : context.DecimalConstructor("0");

  const drivers = [material.value, machineCostPerUnit, laborCostPerUnit, overheadCostPerUnit, otherDirectCostPerUnit] as const;
  let primaryUnitCostDriver: 0 | 1 | 2 | 3 | 4 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primaryUnitCostDriver])) primaryUnitCostDriver = index as 1 | 2 | 3 | 4;
  }
  const decisionState: 0 | 1 | 2 = profitLowerBound.gte("0") && grossMarginRatio.gte(targetMargin.value)
    ? 0
    : profitUpperBound.gte("0") ? 1 : 2;

  return ok({
    setupSecondsPerUnit,
    effectiveSecondsPerUnit,
    machineCostPerUnit,
    laborCostPerUnit,
    materialCostPerUnit: material.value,
    overheadCostPerUnit,
    otherDirectCostPerUnit,
    fullyLoadedCostPerUnit,
    fullyLoadedJobCost,
    quotedJobRevenue: quotedRevenue.value,
    grossProfit,
    grossMarginRatio,
    targetGrossMarginRatio: targetMargin.value,
    minimumQuoteTotal,
    quoteGapToTarget,
    annualEquivalentJobs,
    annualEquivalentGrossProfit,
    sourceConfidenceRatio: confidence.value,
    profitUncertainty,
    profitLowerBound,
    profitUpperBound,
    moneyAtRisk,
    primaryUnitCostDriver,
    decisionState,
  });
}
