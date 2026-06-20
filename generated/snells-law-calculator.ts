// Auto-generated from snells-law-calculator-schema.json
import * as z from 'zod';

export interface Snells_law_calculatorInput {
  n1: number;
  theta1: number;
  n2: number;
  theta2: number;
  dataConfidence?: number;
}

export const Snells_law_calculatorInputSchema = z.object({
  n1: z.number().default(1),
  theta1: z.number().default(30),
  n2: z.number().default(1.5),
  theta2: z.number().default(19.47),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Snells_law_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.n1 * input.theta1 * input.n2 * input.theta2; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.n1 * input.theta1 * input.n2 * input.theta2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSnells_law_calculator(input: Snells_law_calculatorInput): Snells_law_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Snells_law_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
