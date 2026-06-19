// Auto-generated from osmolarity-calculator-schema.json
import * as z from 'zod';

export interface Osmolarity_calculatorInput {
  sodium: number;
  glucose: number;
  bun: number;
  measuredOsmolarity: number;
  dataConfidence?: number;
}

export const Osmolarity_calculatorInputSchema = z.object({
  sodium: z.number().default(140),
  glucose: z.number().default(90),
  bun: z.number().default(14),
  measuredOsmolarity: z.number().default(285),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Osmolarity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * input.sodium + input.glucose / 18 + input.bun / 2.8; results["calculatedOsmolarity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calculatedOsmolarity"] = 0; }
  try { const v = input.measuredOsmolarity - (2 * input.sodium + input.glucose / 18 + input.bun / 2.8); results["osmolarGap"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["osmolarGap"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOsmolarity_calculator(input: Osmolarity_calculatorInput): Osmolarity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["calculatedOsmolarity"]);
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


export interface Osmolarity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
