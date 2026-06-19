// Auto-generated from reading-addition-calculator-schema.json
import * as z from 'zod';

export interface Reading_addition_calculatorInput {
  reading1: number;
  reading2: number;
  reading3: number;
  reading4: number;
  dataConfidence?: number;
}

export const Reading_addition_calculatorInputSchema = z.object({
  reading1: z.number().default(0),
  reading2: z.number().default(0),
  reading3: z.number().default(0),
  reading4: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reading_addition_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.reading1 + input.reading2 + input.reading3 + input.reading4; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = (input.reading1 + input.reading2 + input.reading3 + input.reading4) / 4; results["average"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["average"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReading_addition_calculator(input: Reading_addition_calculatorInput): Reading_addition_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total"]));
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


export interface Reading_addition_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
