// Auto-generated from ciwa-calculator-schema.json
import * as z from 'zod';

export interface Ciwa_calculatorInput {
  cost1: number;
  weight1: number;
  cost2: number;
  weight2: number;
  dataConfidence?: number;
}

export const Ciwa_calculatorInputSchema = z.object({
  cost1: z.number().default(10),
  weight1: z.number().default(5),
  cost2: z.number().default(15),
  weight2: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ciwa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.cost1 * input.weight1 + input.cost2 * input.weight2) / (input.weight1 + input.weight2); results["weightedAverage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightedAverage"] = 0; }
  try { const v = input.cost1 * input.weight1 + input.cost2 * input.weight2; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.weight1 + input.weight2; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCiwa_calculator(input: Ciwa_calculatorInput): Ciwa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["weightedAverage"]));
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


export interface Ciwa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
