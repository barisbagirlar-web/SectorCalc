import "server-only";

import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";
import type { ProFormulaResult } from "./pro-formula-contract";
import {
  createValidationState,
  divideOrError,
  finalizeResult,
  requireFiniteInputs,
  requireNonNegative,
  requirePositive,
  requireRange,
  roundDisplay,
} from "./pro-formula-safety";

export const toolKey = "weld-procedure-cost-consumable-estimation-suite";
export const formulaVersion = "5.3.1-pro-baris.2";

export const requiredInputKeys = [
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

export const declaredOutputKeys = [
  "out_total_cost_floor",
  "out_base_production_cost",
  "out_cost_per_meter",
  "out_wire_mass_kg",
  "out_wire_cost",
  "out_shielding_gas_cost",
  "out_labor_cost",
  "out_shop_overhead",
  "out_consumable_efficiency",
  "out_decision_state",
  "out_evidence_completeness",
  "out_expanded_uncertainty",
  "out_threshold_crossing",
  "out_sensitivity_driver",
  "out_fmea_trigger",
] as const;

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

/**
 * Equal-leg fillet weld using effective throat a:
 *   cross-sectional area = a²
 *   deposited mass = length × area × density
 *
 * The density input reaches this module in kg/m³. The legacy normalized key is
 * retained for compatibility; unit-normalizer converts the UI g/cm³ value to
 * kg/m³ before execution.
 */
export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const state = createValidationState();
  const values = requireFiniteInputs(inputs, requiredInputKeys, state);
  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const weldLengthM = values.n_weld_length_m;
  const effectiveThroatMm = values.n_weld_throat_mm;
  const densityKgM3 = values.n_weld_density_g_per_cm3;
  const wireCostPerKg = values.n_wire_cost_per_kg;
  const gasCostPerMin = values.n_gas_cost_per_min;
  const arcTimeMin = values.n_arc_time_min;
  const totalWeldTimeMin = values.n_weld_time_min;
  const laborRatePerHour = values.n_labor_rate;
  const overheadRatePerHour = values.n_overhead_rate;
  const depositionEfficiencyPct = values.n_deposition_efficiency_pct;
  const sourceConfidence = values.n_source_confidence_ratio;

  requirePositive(weldLengthM, "Weld length", state);
  requirePositive(effectiveThroatMm, "Effective weld throat", state);
  requireRange(densityKgM3, 500, 25000, "Weld metal density (kg/m³)", state);
  requireNonNegative(wireCostPerKg, "Wire cost per kg", state);
  requireNonNegative(gasCostPerMin, "Gas cost per minute", state);
  requirePositive(arcTimeMin, "Arc-on time", state);
  requirePositive(totalWeldTimeMin, "Total weld time", state);
  requireNonNegative(laborRatePerHour, "Labor rate", state);
  requireNonNegative(overheadRatePerHour, "Overhead rate", state);
  requireRange(depositionEfficiencyPct, 0, 100, "Deposition efficiency (%)", state, {
    minInclusive: false,
  });
  requireRange(sourceConfidence, 0, 1, "Source confidence", state);

  if (totalWeldTimeMin < arcTimeMin) {
    state.errors.push("Total weld time must be greater than or equal to arc-on time.");
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const throatM = effectiveThroatMm / 1000;
  const sectionAreaM2 = throatM ** 2;
  const depositedVolumeM3 = weldLengthM * sectionAreaM2;
  const depositedMassKg = depositedVolumeM3 * densityKgM3;
  const depositionEfficiency = depositionEfficiencyPct / 100;
  const wireMassKg = divideOrError(
    depositedMassKg,
    depositionEfficiency,
    "Wire mass / deposition efficiency",
    state,
  );

  const arcHours = arcTimeMin / 60;
  const travelSpeedMPerMin = divideOrError(
    weldLengthM,
    arcTimeMin,
    "Weld travel speed",
    state,
  );
  const depositionRateKgPerHour = divideOrError(
    depositedMassKg,
    arcHours,
    "Weld deposition rate",
    state,
  );

  // Broad process plausibility interlocks. These are deliberately generous;
  // exceeding them indicates a unit/time/geometry contradiction rather than a
  // normal process variation.
  if (travelSpeedMPerMin > 10) {
    state.errors.push(
      `Weld travel speed ${roundDisplay(travelSpeedMPerMin, 3)} m/min exceeds the calculation plausibility limit of 10 m/min.`,
    );
  }
  if (depositionRateKgPerHour > 100) {
    state.errors.push(
      `Deposited metal rate ${roundDisplay(depositionRateKgPerHour, 3)} kg/h exceeds the calculation plausibility limit of 100 kg/h.`,
    );
  }

  if (state.errors.length > 0) {
    return finalizeResult({ outputs: {}, outputKeys: declaredOutputKeys, state });
  }

  const wireCost = wireMassKg * wireCostPerKg;
  const gasCost = gasCostPerMin * arcTimeMin;
  const laborCost = laborRatePerHour * (totalWeldTimeMin / 60);
  const overheadCost = overheadRatePerHour * (totalWeldTimeMin / 60);
  const baseProductionCost = wireCost + gasCost + laborCost;
  const totalCost = baseProductionCost + overheadCost;
  const costPerMeter = divideOrError(totalCost, weldLengthM, "Cost per metre", state);
  const uncertainty = totalCost * (1 - sourceConfidence);

  const costDrivers = [wireCost, gasCost, laborCost, overheadCost];
  const sensitivityDriver = costDrivers.indexOf(Math.max(...costDrivers));

  // No selling price, target margin or external benchmark is present in the
  // schema. Therefore the engine may calculate cost but must not claim LOW COST,
  // competitive pricing or commercial efficiency.
  state.warnings.push(
    "Cost calculated from the entered geometry and rates; no competitiveness or margin conclusion is made without a benchmark or selling price.",
  );

  const outputs: Record<string, number> = {
    out_total_cost_floor: roundDisplay(totalCost, 2),
    out_base_production_cost: roundDisplay(baseProductionCost, 2),
    out_cost_per_meter: roundDisplay(costPerMeter, 2),
    out_wire_mass_kg: roundDisplay(wireMassKg, 3),
    out_wire_cost: roundDisplay(wireCost, 2),
    out_shielding_gas_cost: roundDisplay(gasCost, 2),
    out_labor_cost: roundDisplay(laborCost, 2),
    out_shop_overhead: roundDisplay(overheadCost, 2),
    out_consumable_efficiency: roundDisplay(depositionEfficiency, 4),
    out_decision_state: 1,
    out_evidence_completeness: roundDisplay(sourceConfidence, 3),
    out_expanded_uncertainty: roundDisplay(uncertainty, 2),
    out_threshold_crossing: 0,
    out_sensitivity_driver: sensitivityDriver,
    out_fmea_trigger: sourceConfidence < 0.7 ? 1 : 0,
  };

  return finalizeResult({
    outputs,
    outputKeys: declaredOutputKeys,
    state,
    status: "REVIEW",
  });
}
