// Auto-generated from visual-acuity-calculator-schema.json
import * as z from 'zod';

export interface Visual_acuity_calculatorInput {
  distance: number;
  letterHeight: number;
  snellenNumerator: number;
  overrideDenom: number;
  dataConfidence?: number;
}

export const Visual_acuity_calculatorInputSchema = z.object({
  distance: z.number().default(20),
  letterHeight: z.number().default(8.87),
  snellenNumerator: z.number().default(20),
  overrideDenom: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Visual_acuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.letterHeight / 304.8; results["H_ft"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["H_ft"] = 0; }
  try { const v = input.letterHeight / 304.8; results["H_ft_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["H_ft_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVisual_acuity_calculator(input: Visual_acuity_calculatorInput): Visual_acuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["H_ft_aux"]);
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


export interface Visual_acuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
