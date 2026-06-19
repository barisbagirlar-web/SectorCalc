// Auto-generated from cortisol-calculator-schema.json
import * as z from 'zod';

export interface Cortisol_calculatorInput {
  raw_cortisol: number;
  unit_conversion: number;
  time_factor: number;
  stress_multiplier: number;
  age_factor: number;
  dataConfidence?: number;
}

export const Cortisol_calculatorInputSchema = z.object({
  raw_cortisol: z.number().default(10),
  unit_conversion: z.number().default(27.59),
  time_factor: z.number().default(1),
  stress_multiplier: z.number().default(1),
  age_factor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cortisol_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.raw_cortisol * input.unit_conversion * input.time_factor * input.stress_multiplier * input.age_factor; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.raw_cortisol * input.unit_conversion; results["base_converted"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_converted"] = 0; }
  try { const v = (asFormulaNumber(results["base_converted"])) * input.time_factor * input.stress_multiplier; results["time_stress_adjusted"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["time_stress_adjusted"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCortisol_calculator(input: Cortisol_calculatorInput): Cortisol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["primary"]));
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


export interface Cortisol_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
