import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const JOB_QUOTE_FORMULA_VERSION = "2.0.0";
export const JOB_QUOTE_SCHEMA_VERSION = "5.3.1-pro-job-quote.1";
export const JOB_QUOTE_MODEL_ID = "PRO_JOB_QUOTE_FULL_COST_GROSS_MARGIN_V2";
export const JOB_QUOTE_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface JobQuoteInputs {
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
  sourceConfidenceRatio: string | number;
  uncertaintyCoverageMultiplier: string | number;
}

export interface JobQuoteResult {
  setupSecondsPerUnit: Decimal;
  effectiveSecondsPerUnit: Decimal;
  machineCostPerUnit: Decimal;
  laborCostPerUnit: Decimal;
  overheadCostPerUnit: Decimal;
  materialCostPerUnit: Decimal;
  otherDirectCostPerUnit: Decimal;
  fullyLoadedCostPerUnit: Decimal;
  fullyLoadedJobCost: Decimal;
  targetQuotePerUnit: Decimal;
  targetQuoteTotal: Decimal;
  grossProfitPerUnit: Decimal;
  grossProfitTotal: Decimal;
  achievedGrossMarginRatio: Decimal;
  sourceConfidenceRatio: Decimal;
  costUncertaintyPerUnit: Decimal;
  costLowerBoundPerUnit: Decimal;
  costUpperBoundPerUnit: Decimal;
  quoteLowerBoundPerUnit: Decimal;
  quoteUpperBoundPerUnit: Decimal;
  primaryUnitCostDriver: 0 | 1 | 2 | 3 | 4;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO" | "COVERAGE";

export function evaluateJobQuote(inputs: JobQuoteInputs): DomainResult<JobQuoteResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: Kind): DomainResult<Decimal> => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if (kind === "POSITIVE" && parsed.value.lte("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    }
    if ((kind === "NON_NEGATIVE" || kind === "COVERAGE") && parsed.value.lt("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if (kind === "COVERAGE" && parsed.value.gt("5")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} cannot exceed 5.` });
    }
    if (kind === "POSITIVE_INTEGER" && (parsed.value.lte("0") || !parsed.value.round(0, 0).eq(parsed.value))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer count.` });
    }
    if (kind === "RATIO" && (parsed.value.lt("0") || parsed.value.gt("1"))) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be within [0, 1].` });
    }
    return parsed;
  };

  const machine = read(inputs.machineRatePerHour, "machine_rate_per_hour", "NON_NEGATIVE");
  if (!machine.ok) return machine;
  const cycle = read(inputs.cycleSecondsPerUnit, "cycle_seconds_per_unit", "POSITIVE");
  if (!cycle.ok) return cycle;
  const setup = read(inputs.setupSecondsPerJob, "setup_seconds_per_job", "NON_NEGATIVE");
  if (!setup.ok) return setup;
  const quantity = read(inputs.jobQuantity, "job_quantity", "POSITIVE_INTEGER");
  if (!quantity.ok) return quantity;
  const material = read(inputs.materialCostPerUnit, "material_cost_per_unit", "NON_NEGATIVE");
  if (!material.ok) return material;
  const margin = read(inputs.targetGrossMarginRatio, "target_gross_margin_ratio", "RATIO");
  if (!margin.ok) return margin;
  if (margin.value.eq("1")) {
    return err({ code: "DOMAIN_VIOLATION", field: "target_gross_margin_ratio", message: "Target gross margin must be less than 1." });
  }
  const annualVolume = read(inputs.annualVolume, "annual_volume", "POSITIVE_INTEGER");
  if (!annualVolume.ok) return annualVolume;
  const labor = read(inputs.laborRatePerHour, "labor_rate_per_hour", "NON_NEGATIVE");
  if (!labor.ok) return labor;
  const overhead = read(inputs.annualOverheadPool, "annual_overhead_pool", "NON_NEGATIVE");
  if (!overhead.ok) return overhead;
  const otherJobCost = read(inputs.otherDirectJobCost, "other_direct_job_cost", "NON_NEGATIVE");
  if (!otherJobCost.ok) return otherJobCost;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;
  const coverage = read(inputs.uncertaintyCoverageMultiplier, "uncertainty_coverage_multiplier", "COVERAGE");
  if (!coverage.ok) return coverage;

  const setupSecondsPerUnit = setup.value.div(quantity.value);
  const effectiveSecondsPerUnit = cycle.value.plus(setupSecondsPerUnit);
  const machineCostPerUnit = machine.value.times(effectiveSecondsPerUnit).div("3600");
  const laborCostPerUnit = labor.value.times(effectiveSecondsPerUnit).div("3600");
  const overheadCostPerUnit = overhead.value.div(annualVolume.value);
  const otherDirectCostPerUnit = otherJobCost.value.div(quantity.value);
  const fullyLoadedCostPerUnit = material.value
    .plus(machineCostPerUnit)
    .plus(laborCostPerUnit)
    .plus(overheadCostPerUnit)
    .plus(otherDirectCostPerUnit);
  const fullyLoadedJobCost = fullyLoadedCostPerUnit.times(quantity.value);
  const targetQuotePerUnit = fullyLoadedCostPerUnit.div(context.DecimalConstructor("1").minus(margin.value));
  const targetQuoteTotal = targetQuotePerUnit.times(quantity.value);
  const grossProfitPerUnit = targetQuotePerUnit.minus(fullyLoadedCostPerUnit);
  const grossProfitTotal = targetQuoteTotal.minus(fullyLoadedJobCost);
  const achievedGrossMarginRatio = grossProfitPerUnit.div(targetQuotePerUnit);
  const relativeUncertainty = context.DecimalConstructor("1").minus(confidence.value).times(coverage.value);
  const costUncertaintyPerUnit = fullyLoadedCostPerUnit.times(relativeUncertainty);
  const costLowerBoundPerUnit = fullyLoadedCostPerUnit.minus(costUncertaintyPerUnit);
  const costUpperBoundPerUnit = fullyLoadedCostPerUnit.plus(costUncertaintyPerUnit);
  const quoteLowerBoundPerUnit = costLowerBoundPerUnit.div(context.DecimalConstructor("1").minus(margin.value));
  const quoteUpperBoundPerUnit = costUpperBoundPerUnit.div(context.DecimalConstructor("1").minus(margin.value));
  const drivers = [material.value, machineCostPerUnit, laborCostPerUnit, overheadCostPerUnit, otherDirectCostPerUnit] as const;
  let primaryUnitCostDriver: 0 | 1 | 2 | 3 | 4 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primaryUnitCostDriver])) primaryUnitCostDriver = index as 1 | 2 | 3 | 4;
  }
  const decisionState: 0 | 1 | 2 = relativeUncertainty.lte("0.10")
    ? 0
    : relativeUncertainty.lte("0.25") ? 1 : 2;

  return ok({
    setupSecondsPerUnit,
    effectiveSecondsPerUnit,
    machineCostPerUnit,
    laborCostPerUnit,
    overheadCostPerUnit,
    materialCostPerUnit: material.value,
    otherDirectCostPerUnit,
    fullyLoadedCostPerUnit,
    fullyLoadedJobCost,
    targetQuotePerUnit,
    targetQuoteTotal,
    grossProfitPerUnit,
    grossProfitTotal,
    achievedGrossMarginRatio,
    sourceConfidenceRatio: confidence.value,
    costUncertaintyPerUnit,
    costLowerBoundPerUnit,
    costUpperBoundPerUnit,
    quoteLowerBoundPerUnit,
    quoteUpperBoundPerUnit,
    primaryUnitCostDriver,
    decisionState,
  });
}
