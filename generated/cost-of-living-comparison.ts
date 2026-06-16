// Auto-generated from cost-of-living-comparison-schema.json
import * as z from 'zod';

export interface Cost_of_living_comparisonInput {
  currentCostIndex: number;
  newCostIndex: number;
  currentSalary: number;
  currentMonthlyExpenses: number;
}

export const Cost_of_living_comparisonInputSchema = z.object({
  currentCostIndex: z.number().default(100),
  newCostIndex: z.number().default(120),
  currentSalary: z.number().default(50000),
  currentMonthlyExpenses: z.number().default(3000),
});

function evaluateAllFormulas(input: Cost_of_living_comparisonInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentSalary * (input.newCostIndex / input.currentCostIndex); results["equivalentSalary"] = Number.isFinite(v) ? v : 0; } catch { results["equivalentSalary"] = 0; }
  try { const v = input.currentMonthlyExpenses * (input.newCostIndex / input.currentCostIndex); results["equivalentMonthlyExpenses"] = Number.isFinite(v) ? v : 0; } catch { results["equivalentMonthlyExpenses"] = 0; }
  try { const v = ((input.newCostIndex - input.currentCostIndex) / input.currentCostIndex) * 100; results["percentageChange"] = Number.isFinite(v) ? v : 0; } catch { results["percentageChange"] = 0; }
  try { const v = (results["equivalentSalary"] ?? 0) - input.currentSalary; results["differenceAmount"] = Number.isFinite(v) ? v : 0; } catch { results["differenceAmount"] = 0; }
  return results;
}


export function calculateCost_of_living_comparison(input: Cost_of_living_comparisonInput): Cost_of_living_comparisonOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["equivalentSalary"] ?? 0;
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


export interface Cost_of_living_comparisonOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
