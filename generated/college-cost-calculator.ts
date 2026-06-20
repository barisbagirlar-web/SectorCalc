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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: College_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tuition + input.living + input.books; results["grossTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossTotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossTotal"])) * input.years; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.scholarship * input.years; results["totalScholarship"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalScholarship"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) - (toNumericFormulaValue(results["totalScholarship"])); results["netCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) * (1 + input.inflation/100); results["inflatedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inflatedCost"] = Number.NaN; }
  return results;
}


export function calculateCollege_cost_calculator(input: College_cost_calculatorInput): College_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netCost"]);
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


export interface College_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
