// Auto-generated from baby-cost-calculator-schema.json
import * as z from 'zod';

export interface Baby_cost_calculatorInput {
  months: number;
  monthlyDiapers: number;
  monthlyFormula: number;
  monthlyClothing: number;
  monthlyChildcare: number;
  monthlyMedical: number;
  oneTimeCosts: number;
  dataConfidence?: number;
}

export const Baby_cost_calculatorInputSchema = z.object({
  months: z.number().default(12),
  monthlyDiapers: z.number().default(80),
  monthlyFormula: z.number().default(120),
  monthlyClothing: z.number().default(50),
  monthlyChildcare: z.number().default(500),
  monthlyMedical: z.number().default(100),
  oneTimeCosts: z.number().default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baby_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyDiapers + input.monthlyFormula + input.monthlyClothing + input.monthlyChildcare + input.monthlyMedical; results["totalMonthly"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonthly"] = Number.NaN; }
  try { const v = input.oneTimeCosts; results["oneTimeExpenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oneTimeExpenses"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMonthly"])) * input.months + input.oneTimeCosts; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateBaby_cost_calculator(input: Baby_cost_calculatorInput): Baby_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Baby_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
