// Auto-generated from stat-calculator-schema.json
import * as z from 'zod';

export interface Stat_calculatorInput {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  dataConfidence?: number;
}

export const Stat_calculatorInputSchema = z.object({
  value1: z.number().default(0),
  value2: z.number().default(0),
  value3: z.number().default(0),
  value4: z.number().default(0),
  value5: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.value1 + input.value2 + input.value3 + input.value4 + input.value5; results["sum"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sum"] = 0; }
  try { const v = (input.value1 + input.value2 + input.value3 + input.value4 + input.value5) / 5; results["mean"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mean"] = 0; }
  try { const v = ((input.value1 - (asFormulaNumber(results["mean"]))) ** 2 + (input.value2 - (asFormulaNumber(results["mean"]))) ** 2 + (input.value3 - (asFormulaNumber(results["mean"]))) ** 2 + (input.value4 - (asFormulaNumber(results["mean"]))) ** 2 + (input.value5 - (asFormulaNumber(results["mean"]))) ** 2) / 4; results["variance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["variance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStat_calculator(input: Stat_calculatorInput): Stat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mean"]);
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


export interface Stat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
