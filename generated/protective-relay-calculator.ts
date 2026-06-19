// Auto-generated from protective-relay-calculator-schema.json
import * as z from 'zod';

export interface Protective_relay_calculatorInput {
  ct_ratio: number;
  relay_pickup: number;
  fault_current_primary: number;
  tms: number;
  curve_constant_k: number;
  curve_constant_alpha: number;
  curve_constant_c: number;
  dataConfidence?: number;
}

export const Protective_relay_calculatorInputSchema = z.object({
  ct_ratio: z.number().default(40),
  relay_pickup: z.number().default(5),
  fault_current_primary: z.number().default(1000),
  tms: z.number().default(0.1),
  curve_constant_k: z.number().default(0.14),
  curve_constant_alpha: z.number().default(0.02),
  curve_constant_c: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Protective_relay_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fault_current_primary / input.ct_ratio; results["secondary_fault_current"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["secondary_fault_current"] = 0; }
  try { const v = (asFormulaNumber(results["secondary_fault_current"])) / input.relay_pickup; results["plug_setting_multiple"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["plug_setting_multiple"] = 0; }
  try { const v = input.tms * (input.curve_constant_k / ((asFormulaNumber(results["plug_setting_multiple"])) ^ input.curve_constant_alpha - 1) + input.curve_constant_c); results["trip_time"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["trip_time"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateProtective_relay_calculator(input: Protective_relay_calculatorInput): Protective_relay_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["trip_time"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Protective_relay_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
