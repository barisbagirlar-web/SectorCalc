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

function evaluateAllFormulas(input: Baby_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.monthlyDiapers + input.monthlyFormula + input.monthlyClothing + input.monthlyChildcare + input.monthlyMedical; results["totalMonthly"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonthly"] = 0; }
  try { const v = input.oneTimeCosts; results["oneTimeExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["oneTimeExpenses"] = 0; }
  try { const v = (results["totalMonthly"] ?? 0) * input.months + input.oneTimeCosts; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateBaby_cost_calculator(input: Baby_cost_calculatorInput): Baby_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Baby_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
