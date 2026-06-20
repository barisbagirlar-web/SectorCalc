// Auto-generated from radical-calculator-schema.json
import * as z from 'zod';

export interface Radical_calculatorInput {
  multiplier: number;
  radicand: number;
  index: number;
  addend: number;
  dataConfidence?: number;
}

export const Radical_calculatorInputSchema = z.object({
  multiplier: z.number().default(1),
  radicand: z.number().default(16),
  index: z.number().default(2),
  addend: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Radical_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.radicand ** (1/input.index); results["rootValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rootValue"] = Number.NaN; }
  try { const v = input.multiplier * (toNumericFormulaValue(results["rootValue"])); results["multiplied"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["multiplied"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["multiplied"])) + input.addend; results["finalResult"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalResult"] = Number.NaN; }
  return results;
}


export function calculateRadical_calculator(input: Radical_calculatorInput): Radical_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalResult"]);
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


export interface Radical_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
