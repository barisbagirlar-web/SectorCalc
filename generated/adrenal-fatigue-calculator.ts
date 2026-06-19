// Auto-generated from adrenal-fatigue-calculator-schema.json
import * as z from 'zod';

export interface Adrenal_fatigue_calculatorInput {
  shift_length: number;
  consecutive_shifts: number;
  rest_between_shifts: number;
  noise_level: number;
  temperature: number;
  load_factor: number;
  dataConfidence?: number;
}

export const Adrenal_fatigue_calculatorInputSchema = z.object({
  shift_length: z.number().default(8),
  consecutive_shifts: z.number().default(5),
  rest_between_shifts: z.number().default(16),
  noise_level: z.number().default(70),
  temperature: z.number().default(22),
  load_factor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Adrenal_fatigue_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shift_length * input.load_factor / (input.rest_between_shifts + 1) * 10; results["shift_contribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shift_contribution"] = 0; }
  try { const v = input.consecutive_shifts * 2; results["cumulative_contribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cumulative_contribution"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAdrenal_fatigue_calculator(input: Adrenal_fatigue_calculatorInput): Adrenal_fatigue_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cumulative_contribution"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Adrenal_fatigue_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
