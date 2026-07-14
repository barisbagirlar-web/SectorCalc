import "server-only";

import {
  MACHINE_HOURLY_RATE_ARITHMETIC_MODE,
  MACHINE_HOURLY_RATE_FORMULA_VERSION,
  MACHINE_HOURLY_RATE_MODEL_ID,
  evaluateMachineHourlyRate,
} from "./machine-hourly-rate-core";
import { decimalToPresentationNumber, domainErrorMessage, isCanonicalDecimalSource, type Decimal, type DecimalSource } from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "machine-hourly-rate-proof-report";
export const formulaVersion = MACHINE_HOURLY_RATE_FORMULA_VERSION;
export const arithmeticMode = MACHINE_HOURLY_RATE_ARITHMETIC_MODE;
export const modelId = MACHINE_HOURLY_RATE_MODEL_ID;
export const verificationEvidenceId = "tests/pro-calculation-correctness/machine-hourly-rate.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_machine_rate",
  "n_cycle_time",
  "n_setup_time",
  "n_batch_quantity",
  "n_material_cost",
  "n_target_margin",
  "n_annual_volume",
  "n_labor_rate",
  "n_overhead_rate",
  "n_source_confidence_ratio",
] as const;

function blocked(warnings: string[]): ProFormulaResult {
  return {
    status: "BLOCKED",
    outputs: {},
    decimalOutputs: {},
    warnings,
    outputKeys: [],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export function calculate(inputs: Record<string, DecimalSource>): ProFormulaResult {
  const invalid = REQUIRED.filter((key) => !isCanonicalDecimalSource(inputs[key]));
  if (invalid.length > 0) return blocked([`Missing or non-finite normalized inputs: ${invalid.join(", ")}.`]);

  const evaluated = evaluateMachineHourlyRate({
    machineRatePerHour: inputs.n_machine_rate,
    cycleSecondsPerUnit: inputs.n_cycle_time,
    setupSecondsPerBatch: inputs.n_setup_time,
    batchQuantity: inputs.n_batch_quantity,
    materialCostPerUnit: inputs.n_material_cost,
    targetMarginRatio: inputs.n_target_margin,
    annualVolume: inputs.n_annual_volume,
    laborRatePerHour: inputs.n_labor_rate,
    annualOverhead: inputs.n_overhead_rate,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);

  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_setup_seconds_per_unit", value.setupSecondsPerUnit],
    ["out_effective_cycle_seconds", value.effectiveCycleSeconds],
    ["out_capacity_units_per_hour", value.capacityUnitsPerHour],
    ["out_annual_productive_hours", value.annualProductiveHours],
    ["out_direct_hourly_rate", value.directHourlyRate],
    ["out_overhead_hourly_rate", value.overheadHourlyRate],
    ["out_fully_loaded_hourly_rate", value.fullyLoadedHourlyRate],
    ["out_machine_cost_per_unit", value.machineCostPerUnit],
    ["out_labor_cost_per_unit", value.laborCostPerUnit],
    ["out_overhead_cost_per_unit", value.overheadCostPerUnit],
    ["out_material_cost_per_unit", value.materialCostPerUnit],
    ["out_fully_loaded_cost_per_unit", value.fullyLoadedCostPerUnit],
    ["out_quote_price_per_unit", value.quotePricePerUnit],
    ["out_profit_per_unit", value.profitPerUnit],
    ["out_annual_profit", value.annualProfit],
    ["out_source_confidence_ratio", value.sourceConfidenceRatio],
    ["out_rate_uncertainty_amount", value.rateUncertaintyAmount],
    ["out_rate_lower_bound", value.rateLowerBound],
    ["out_rate_upper_bound", value.rateUpperBound],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_primary_cost_driver = value.primaryCostDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_primary_cost_driver = String(value.primaryCostDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);

  const warnings = value.decisionState === 2
    ? ["Source confidence is below 75%; hold rate approval until source evidence is strengthened."]
    : value.decisionState === 1
      ? ["Source confidence is below 90%; review the calculated rate before commercial use."]
      : [];
  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    decimalOutputs,
    warnings,
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
