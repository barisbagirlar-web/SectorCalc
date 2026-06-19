// Auto-generated from life-table-calculator-schema.json
import * as z from 'zod';

export interface Life_table_calculatorInput {
  l0: number;
  B: number;
  c: number;
  age: number;
  dataConfidence?: number;
}

export const Life_table_calculatorInputSchema = z.object({
  l0: z.number().default(100000),
  B: z.number().default(0.0001),
  c: z.number().default(1.1),
  age: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Life_table_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.l0 * input.B * input.c * input.age; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.l0 * input.B * input.c * input.age; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLife_table_calculator(input: Life_table_calculatorInput): Life_table_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Life_table_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
