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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Truth_table_generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.varA * input.varB; results["andAB"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["andAB"] = 0; }
  try { const v = 1 - input.varD; results["notD"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["notD"] = 0; }
  try { const v = input.varC * (asFormulaNumber(results["notD"])); results["andCnotD"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["andCnotD"] = 0; }
  try { const v = (asFormulaNumber(results["andAB"])) + (asFormulaNumber(results["andCnotD"])) - (asFormulaNumber(results["andAB"])) * (asFormulaNumber(results["andCnotD"])); results["finalResult"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalResult"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
