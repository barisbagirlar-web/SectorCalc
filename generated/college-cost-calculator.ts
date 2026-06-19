// Auto-generated from college-cost-calculator-schema.json
import * as z from 'zod';

export interface College_cost_calculatorInput {
  tuition: number;
  living: number;
  books: number;
  years: number;
  inflation: number;
  scholarship: number;
  dataConfidence?: number;
}

export const College_cost_calculatorInputSchema = z.object({
  tuition: z.number().default(20000),
  living: z.number().default(15000),
  books: z.number().default(2000),
  years: z.number().default(4),
  inflation: z.number().default(3),
  scholarship: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: College_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tuition + input.living + input.books; results["grossTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossTotal"] = 0; }
  try { const v = (asFormulaNumber(results["grossTotal"])) * input.years; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.scholarship * input.years; results["totalScholarship"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalScholarship"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) - (asFormulaNumber(results["totalScholarship"])); results["netCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) * (1 + input.inflation/100); results["inflatedCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["inflatedCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCollege_cost_calculator(input: College_cost_calculatorInput): College_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netCost"]));
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


export interface College_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
