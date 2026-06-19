// Auto-generated from percentile-rank-calculator-schema.json
import * as z from 'zod';

export interface Percentile_rank_calculatorInput {
  target: number;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  dataConfidence?: number;
}

export const Percentile_rank_calculatorInputSchema = z.object({
  target: z.number().default(50),
  value1: z.number().default(10),
  value2: z.number().default(20),
  value3: z.number().default(30),
  value4: z.number().default(40),
  value5: z.number().default(60),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Percentile_rank_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (((input.value1 < input.target ? 1 : 0) + (input.value2 < input.target ? 1 : 0) + (input.value3 < input.target ? 1 : 0) + (input.value4 < input.target ? 1 : 0) + (input.value5 < input.target ? 1 : 0) + 0.5 * ((input.value1 == input.target ? 1 : 0) + (input.value2 == input.target ? 1 : 0) + (input.value3 == input.target ? 1 : 0) + (input.value4 == input.target ? 1 : 0) + (input.value5 == input.target ? 1 : 0))) / 5 * 100); results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.target; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePercentile_rank_calculator(input: Percentile_rank_calculatorInput): Percentile_rank_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Percentile_rank_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
