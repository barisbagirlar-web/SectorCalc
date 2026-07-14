import "server-only";

import {
  WELD_COST_ARITHMETIC_MODE,
  WELD_COST_FORMULA_VERSION,
  WELD_COST_MODEL_ID,
  evaluateWeldCost,
} from "./weld-cost-core";
import {
  decimalToPresentationNumber,
  domainErrorMessage,
  isCanonicalDecimalSource,
  type Decimal,
  type DecimalSource,
} from "./pro-decimal-domain";
import type { ProFormulaResult } from "./pro-formula-contract";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

export const toolKey = "weld-procedure-cost-consumable-estimation-suite";
export const formulaVersion = WELD_COST_FORMULA_VERSION;
export const arithmeticMode = WELD_COST_ARITHMETIC_MODE;
export const modelId = WELD_COST_MODEL_ID;
export const verificationEvidenceId =
  "tests/pro-calculation-correctness/weld-cost.property.test.ts";
export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

const REQUIRED = [
  "n_weld_length_m",
  "n_weld_throat_mm",
  "n_weld_density_g_per_cm3",
  "n_wire_cost_per_kg",
  "n_gas_cost_per_min",
  "n_arc_time_min",
  "n_weld_time_min",
  "n_labor_rate",
  "n_overhead_rate",
  "n_deposition_efficiency_pct",
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
  const invalid = REQUIRED.filter(
    (key) => !isCanonicalDecimalSource(inputs[key]),
  );
  if (invalid.length > 0) {
    return blocked(["Missing or non-finite normalized inputs: " + invalid.join(", ") + "."]);
  }

  const evaluated = evaluateWeldCost({
    weldLengthM: inputs.n_weld_length_m,
    effectiveThroatMm: inputs.n_weld_throat_mm,
    densityGPerCm3: inputs.n_weld_density_g_per_cm3,
    wireCostPerKg: inputs.n_wire_cost_per_kg,
    gasCostPerMinute: inputs.n_gas_cost_per_min,
    arcTimeMinutes: inputs.n_arc_time_min,
    elapsedWeldTimeMinutes: inputs.n_weld_time_min,
    laborRatePerHour: inputs.n_labor_rate,
    overheadRatePerHour: inputs.n_overhead_rate,
    depositionEfficiencyRatio: inputs.n_deposition_efficiency_pct,
    sourceConfidenceRatio: inputs.n_source_confidence_ratio,
  });
  if (!evaluated.ok) return blocked([domainErrorMessage(evaluated.error)]);

  const value = evaluated.value;
  const exact: Array<readonly [string, Decimal]> = [
    ["out_cross_section_area_mm2", value.crossSectionAreaMm2],
    ["out_deposited_weld_metal_mass_kg", value.depositedWeldMetalMassKg],
    ["out_wire_mass_kg", value.wireMassKg],
    ["out_wire_cost", value.wireCost],
    ["out_shielding_gas_cost", value.shieldingGasCost],
    ["out_labor_cost", value.laborCost],
    ["out_shop_overhead", value.shopOverhead],
    ["out_base_production_cost", value.baseProductionCost],
    ["out_total_estimated_cost", value.totalEstimatedCost],
    ["out_cost_per_meter", value.costPerMeter],
    ["out_arc_time_ratio", value.arcTimeRatio],
    ["out_consumable_efficiency", value.depositionEfficiencyRatio],
    ["out_evidence_completeness", value.sourceConfidenceRatio],
    ["out_expanded_uncertainty", value.costUncertainty],
    ["out_total_cost_floor", value.totalCostLowerBound],
    ["out_total_cost_ceiling", value.totalCostUpperBound],
    ["out_cost_per_meter_lower_bound", value.costPerMeterLowerBound],
    ["out_cost_per_meter_upper_bound", value.costPerMeterUpperBound],
  ];
  const outputs: Record<string, number> = {};
  const decimalOutputs: Record<string, string> = {};
  for (const [id, exactValue] of exact) {
    const presented = decimalToPresentationNumber(exactValue, id);
    if (!presented.ok) return blocked([domainErrorMessage(presented.error)]);
    outputs[id] = presented.value;
    decimalOutputs[id] = exactValue.toString();
  }
  outputs.out_sensitivity_driver = value.primaryCostDriver;
  outputs.out_decision_state = value.decisionState;
  decimalOutputs.out_sensitivity_driver = String(value.primaryCostDriver);
  decimalOutputs.out_decision_state = String(value.decisionState);

  const warnings = value.decisionState === 1
    ? ["The evidence-adjusted total-cost interval reaches zero; verify all price, time, geometry, efficiency, and confidence evidence before quoting."]
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
