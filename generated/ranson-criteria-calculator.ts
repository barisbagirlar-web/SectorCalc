// Auto-generated from ranson-criteria-calculator-schema.json
import * as z from 'zod';

export interface Ranson_criteria_calculatorInput {
  age: number;
  wbc: number;
  glucose: number;
  ldh: number;
  ast: number;
}

export const Ranson_criteria_calculatorInputSchema = z.object({
  age: z.number().default(55),
  wbc: z.number().default(16000),
  glucose: z.number().default(200),
  ldh: z.number().default(350),
  ast: z.number().default(250),
});

function evaluateAllFormulas(input: Ranson_criteria_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age > 55 ? 1 : 0; results["ageCriteria"] = Number.isFinite(v) ? v : 0; } catch { results["ageCriteria"] = 0; }
  try { const v = input.wbc > 16000 ? 1 : 0; results["wbcCriteria"] = Number.isFinite(v) ? v : 0; } catch { results["wbcCriteria"] = 0; }
  try { const v = input.glucose > 200 ? 1 : 0; results["glucoseCriteria"] = Number.isFinite(v) ? v : 0; } catch { results["glucoseCriteria"] = 0; }
  try { const v = input.ldh > 350 ? 1 : 0; results["ldhCriteria"] = Number.isFinite(v) ? v : 0; } catch { results["ldhCriteria"] = 0; }
  try { const v = input.ast > 250 ? 1 : 0; results["astCriteria"] = Number.isFinite(v) ? v : 0; } catch { results["astCriteria"] = 0; }
  try { const v = (results["ageCriteria"] ?? 0) + (results["wbcCriteria"] ?? 0) + (results["glucoseCriteria"] ?? 0) + (results["ldhCriteria"] ?? 0) + (results["astCriteria"] ?? 0); results["score"] = Number.isFinite(v) ? v : 0; } catch { results["score"] = 0; }
  return results;
}


export function calculateRanson_criteria_calculator(input: Ranson_criteria_calculatorInput): Ranson_criteria_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["score"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Ranson_criteria_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
