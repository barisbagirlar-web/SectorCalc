import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const SMED_ROI_FORMULA_VERSION = "2.0.0";
export const SMED_ROI_SCHEMA_VERSION = "5.3.1-pro-smed-roi.1";
export const SMED_ROI_MODEL_ID = "PRO_SMED_SETUP_REDUCTION_ROI_V2";
export const SMED_ROI_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface SmedRoiInputs {
  machineRatePerHour: string | number;
  cycleSecondsPerUnit: string | number;
  currentSetupSeconds: string | number;
  batchQuantity: string | number;
  implementationCost: string | number;
  annualVolume: string | number;
  laborRatePerHour: string | number;
  avoidableOverheadRatePerHour: string | number;
  setupReductionRatio: string | number;
  sourceConfidenceRatio: string | number;
}

export interface SmedRoiResult {
  annualChangeoverEquivalents: Decimal;
  currentSetupSeconds: Decimal;
  targetSetupSeconds: Decimal;
  savedSecondsPerChangeover: Decimal;
  annualSavedHours: Decimal;
  additionalCapacityUnits: Decimal;
  avoidableHourlyRate: Decimal;
  annualGrossSaving: Decimal;
  implementationCost: Decimal;
  firstYearNetBenefit: Decimal;
  simplePaybackYears: Decimal;
  annualRoiRatio: Decimal;
  sourceConfidenceRatio: Decimal;
  annualSavingUncertainty: Decimal;
  savingLowerBound: Decimal;
  savingUpperBound: Decimal;
  primarySavingRateDriver: 0 | 1 | 2;
  decisionState: 0 | 1 | 2;
}

type Kind = "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO";

export function evaluateSmedRoi(inputs: SmedRoiInputs): DomainResult<SmedRoiResult> {
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
  const setup = read(inputs.currentSetupSeconds, "current_setup_seconds", "POSITIVE");
  if (!setup.ok) return setup;
  const batch = read(inputs.batchQuantity, "batch_quantity", "POSITIVE_INTEGER");
  if (!batch.ok) return batch;
  const implementation = read(inputs.implementationCost, "implementation_cost", "POSITIVE");
  if (!implementation.ok) return implementation;
  const volume = read(inputs.annualVolume, "annual_volume", "POSITIVE_INTEGER");
  if (!volume.ok) return volume;
  const laborRate = read(inputs.laborRatePerHour, "labor_rate_per_hour", "NON_NEGATIVE");
  if (!laborRate.ok) return laborRate;
  const overheadRate = read(inputs.avoidableOverheadRatePerHour, "avoidable_overhead_rate_per_hour", "NON_NEGATIVE");
  if (!overheadRate.ok) return overheadRate;
  const reduction = read(inputs.setupReductionRatio, "setup_reduction_ratio", "RATIO");
  if (!reduction.ok) return reduction;
  if (reduction.value.eq("0")) {
    return err({ code: "DOMAIN_VIOLATION", field: "setup_reduction_ratio", message: "Setup reduction ratio must be greater than zero." });
  }
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const avoidableHourlyRate = machineRate.value.plus(laborRate.value).plus(overheadRate.value);
  if (avoidableHourlyRate.lte("0")) {
    return err({ code: "DOMAIN_VIOLATION", field: "avoidable_hourly_rate", message: "At least one avoidable hourly cost rate must be greater than zero." });
  }
  const annualChangeoverEquivalents = volume.value.div(batch.value);
  const savedSecondsPerChangeover = setup.value.times(reduction.value);
  const targetSetupSeconds = setup.value.minus(savedSecondsPerChangeover);
  const annualSavedHours = savedSecondsPerChangeover.times(annualChangeoverEquivalents).div("3600");
  const additionalCapacityUnits = savedSecondsPerChangeover.times(annualChangeoverEquivalents).div(cycle.value);
  const annualGrossSaving = annualSavedHours.times(avoidableHourlyRate);
  const firstYearNetBenefit = annualGrossSaving.minus(implementation.value);
  const simplePaybackYears = implementation.value.div(annualGrossSaving);
  const annualRoiRatio = annualGrossSaving.div(implementation.value);
  const annualSavingUncertainty = annualGrossSaving.times(context.DecimalConstructor("1").minus(confidence.value));
  const savingLowerBound = annualGrossSaving.minus(annualSavingUncertainty);
  const savingUpperBound = annualGrossSaving.plus(annualSavingUncertainty);
  const drivers = [machineRate.value, laborRate.value, overheadRate.value] as const;
  let primarySavingRateDriver: 0 | 1 | 2 = 0;
  for (let index = 1; index < drivers.length; index += 1) {
    if (drivers[index].gt(drivers[primarySavingRateDriver])) primarySavingRateDriver = index as 1 | 2;
  }
  const decisionState: 0 | 1 | 2 = savingLowerBound.gte(implementation.value)
    ? 0
    : savingUpperBound.gte(implementation.value) ? 1 : 2;

  return ok({
    annualChangeoverEquivalents,
    currentSetupSeconds: setup.value,
    targetSetupSeconds,
    savedSecondsPerChangeover,
    annualSavedHours,
    additionalCapacityUnits,
    avoidableHourlyRate,
    annualGrossSaving,
    implementationCost: implementation.value,
    firstYearNetBenefit,
    simplePaybackYears,
    annualRoiRatio,
    sourceConfidenceRatio: confidence.value,
    annualSavingUncertainty,
    savingLowerBound,
    savingUpperBound,
    primarySavingRateDriver,
    decisionState,
  });
}
