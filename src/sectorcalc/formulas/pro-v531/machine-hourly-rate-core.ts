import "server-only";

import type { Decimal, DomainResult } from "./pro-decimal-domain";
import { createDecimalContext, err, ok } from "./pro-decimal-domain";

export const MACHINE_HOURLY_RATE_FORMULA_VERSION = "2.0.0";
export const MACHINE_HOURLY_RATE_SCHEMA_VERSION = "5.3.1-pro-machine-hourly-rate.1";
export const MACHINE_HOURLY_RATE_MODEL_ID = "PRO_MACHINE_HOURLY_RATE_COST_BUILDUP_V2";
export const MACHINE_HOURLY_RATE_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;

export interface MachineHourlyRateInputs {
  machineRatePerHour: string | number;
  cycleSecondsPerUnit: string | number;
  setupSecondsPerBatch: string | number;
  batchQuantity: string | number;
  materialCostPerUnit: string | number;
  targetMarginRatio: string | number;
  annualVolume: string | number;
  laborRatePerHour: string | number;
  annualOverhead: string | number;
  sourceConfidenceRatio: string | number;
}

export interface MachineHourlyRateResult {
  setupSecondsPerUnit: Decimal;
  effectiveCycleSeconds: Decimal;
  capacityUnitsPerHour: Decimal;
  annualProductiveHours: Decimal;
  directHourlyRate: Decimal;
  overheadHourlyRate: Decimal;
  fullyLoadedHourlyRate: Decimal;
  machineCostPerUnit: Decimal;
  laborCostPerUnit: Decimal;
  overheadCostPerUnit: Decimal;
  materialCostPerUnit: Decimal;
  fullyLoadedCostPerUnit: Decimal;
  quotePricePerUnit: Decimal;
  profitPerUnit: Decimal;
  annualProfit: Decimal;
  sourceConfidenceRatio: Decimal;
  rateUncertaintyAmount: Decimal;
  rateLowerBound: Decimal;
  rateUpperBound: Decimal;
  primaryCostDriver: 0 | 1 | 2 | 3;
  decisionState: 0 | 1 | 2;
}

type InputKind = "POSITIVE" | "NON_NEGATIVE" | "POSITIVE_INTEGER" | "RATIO";

export function evaluateMachineHourlyRate(
  inputs: MachineHourlyRateInputs,
): DomainResult<MachineHourlyRateResult> {
  const context = createDecimalContext();
  const read = (value: string | number, field: string, kind: InputKind): DomainResult<Decimal> => {
    const parsed = context.decimal(value, field);
    if (!parsed.ok) return parsed;
    if (kind === "POSITIVE" && parsed.value.lte("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be greater than zero.` });
    }
    if (kind === "NON_NEGATIVE" && parsed.value.lt("0")) {
      return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be non-negative.` });
    }
    if (kind === "POSITIVE_INTEGER") {
      if (parsed.value.lte("0") || !parsed.value.round(0, 0).eq(parsed.value)) {
        return err({ code: "DOMAIN_VIOLATION", field, message: `${field} must be a positive integer count.` });
      }
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
  const setup = read(inputs.setupSecondsPerBatch, "setup_seconds_per_batch", "NON_NEGATIVE");
  if (!setup.ok) return setup;
  const batch = read(inputs.batchQuantity, "batch_quantity", "POSITIVE_INTEGER");
  if (!batch.ok) return batch;
  const material = read(inputs.materialCostPerUnit, "material_cost_per_unit", "NON_NEGATIVE");
  if (!material.ok) return material;
  const margin = read(inputs.targetMarginRatio, "target_margin_ratio", "RATIO");
  if (!margin.ok) return margin;
  if (margin.value.eq("1")) {
    return err({ code: "DOMAIN_VIOLATION", field: "target_margin_ratio", message: "Target gross margin must be less than 1." });
  }
  const volume = read(inputs.annualVolume, "annual_volume", "POSITIVE_INTEGER");
  if (!volume.ok) return volume;
  const laborRate = read(inputs.laborRatePerHour, "labor_rate_per_hour", "NON_NEGATIVE");
  if (!laborRate.ok) return laborRate;
  const annualOverhead = read(inputs.annualOverhead, "annual_overhead", "NON_NEGATIVE");
  if (!annualOverhead.ok) return annualOverhead;
  const confidence = read(inputs.sourceConfidenceRatio, "source_confidence_ratio", "RATIO");
  if (!confidence.ok) return confidence;

  const setupSecondsPerUnit = setup.value.div(batch.value);
  const effectiveCycleSeconds = cycle.value.plus(setupSecondsPerUnit);
  const capacityUnitsPerHour = context.DecimalConstructor("3600").div(effectiveCycleSeconds);
  const annualProductiveHours = volume.value.times(effectiveCycleSeconds).div("3600");
  if (annualProductiveHours.gt("8760")) {
    return err({
      code: "DOMAIN_VIOLATION",
      field: "annual_volume",
      message: "Annual volume requires more than 8,760 productive hours for one continuously available machine.",
    });
  }

  const directHourlyRate = machineRate.value.plus(laborRate.value);
  const overheadHourlyRate = annualOverhead.value.div(annualProductiveHours);
  const fullyLoadedHourlyRate = directHourlyRate.plus(overheadHourlyRate);
  const machineCostPerUnit = machineRate.value.times(effectiveCycleSeconds).div("3600");
  const laborCostPerUnit = laborRate.value.times(effectiveCycleSeconds).div("3600");
  const overheadCostPerUnit = annualOverhead.value.div(volume.value);
  const fullyLoadedCostPerUnit = material.value
    .plus(machineCostPerUnit)
    .plus(laborCostPerUnit)
    .plus(overheadCostPerUnit);
  const quotePricePerUnit = fullyLoadedCostPerUnit.div(context.DecimalConstructor("1").minus(margin.value));
  const profitPerUnit = quotePricePerUnit.minus(fullyLoadedCostPerUnit);
  const annualProfit = profitPerUnit.times(volume.value);
  const rateUncertaintyAmount = fullyLoadedHourlyRate.times(context.DecimalConstructor("1").minus(confidence.value));
  const rateLowerBound = fullyLoadedHourlyRate.minus(rateUncertaintyAmount);
  const rateUpperBound = fullyLoadedHourlyRate.plus(rateUncertaintyAmount);

  const costDrivers = [machineCostPerUnit, laborCostPerUnit, overheadCostPerUnit, material.value] as const;
  let primaryCostDriver: 0 | 1 | 2 | 3 = 0;
  for (let index = 1; index < costDrivers.length; index += 1) {
    if (costDrivers[index].gt(costDrivers[primaryCostDriver])) {
      primaryCostDriver = index as 1 | 2 | 3;
    }
  }
  const decisionState: 0 | 1 | 2 = confidence.value.gte("0.90")
    ? 0
    : confidence.value.gte("0.75") ? 1 : 2;

  return ok({
    setupSecondsPerUnit,
    effectiveCycleSeconds,
    capacityUnitsPerHour,
    annualProductiveHours,
    directHourlyRate,
    overheadHourlyRate,
    fullyLoadedHourlyRate,
    machineCostPerUnit,
    laborCostPerUnit,
    overheadCostPerUnit,
    materialCostPerUnit: material.value,
    fullyLoadedCostPerUnit,
    quotePricePerUnit,
    profitPerUnit,
    annualProfit,
    sourceConfidenceRatio: confidence.value,
    rateUncertaintyAmount,
    rateLowerBound,
    rateUpperBound,
    primaryCostDriver,
    decisionState,
  });
}
