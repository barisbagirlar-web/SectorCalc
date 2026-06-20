// Auto-generated from truth-table-generator-calculator-schema.json
import * as z from 'zod';

export interface Truth_table_generator_calculatorInput {
  varA: number;
  varB: number;
  varC: number;
  varD: number;
  dataConfidence?: number;
}

export const Truth_table_generator_calculatorInputSchema = z.object({
  varA: z.number().default(0),
  varB: z.number().default(0),
  varC: z.number().default(0),
  varD: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Truth_table_generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.varA * input.varB; results["andAB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["andAB"] = Number.NaN; }
  try { const v = 1 - input.varD; results["notD"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["notD"] = Number.NaN; }
  try { const v = input.varC * (toNumericFormulaValue(results["notD"])); results["andCnotD"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["andCnotD"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["andAB"])) + (toNumericFormulaValue(results["andCnotD"])) - (toNumericFormulaValue(results["andAB"])) * (toNumericFormulaValue(results["andCnotD"])); results["finalResult"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalResult"] = Number.NaN; }
  return results;
}


export function calculateTruth_table_generator_calculator(input: Truth_table_generator_calculatorInput): Truth_table_generator_calculatorOutput {
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


export interface Truth_table_generator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
