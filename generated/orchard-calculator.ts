// Auto-generated from orchard-calculator-schema.json
import * as z from 'zod';

export interface Orchard_calculatorInput {
  area: number;
  rowSpacing: number;
  treeSpacing: number;
  yieldPerTree: number;
  pricePerKg: number;
  annualCostPerTree: number;
  initialInvestment: number;
}

export const Orchard_calculatorInputSchema = z.object({
  area: z.number().default(10),
  rowSpacing: z.number().default(4),
  treeSpacing: z.number().default(3),
  yieldPerTree: z.number().default(50),
  pricePerKg: z.number().default(2),
  annualCostPerTree: z.number().default(15),
  initialInvestment: z.number().default(50000),
});

function evaluateAllFormulas(input: Orchard_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10000 / (input.rowSpacing * input.treeSpacing); results["treesPerHa"] = Number.isFinite(v) ? v : 0; } catch { results["treesPerHa"] = 0; }
  try { const v = input.area * (results["treesPerHa"] ?? 0); results["totalTrees"] = Number.isFinite(v) ? v : 0; } catch { results["totalTrees"] = 0; }
  try { const v = (results["totalTrees"] ?? 0) * input.yieldPerTree; results["totalYield"] = Number.isFinite(v) ? v : 0; } catch { results["totalYield"] = 0; }
  try { const v = (results["totalYield"] ?? 0) * input.pricePerKg; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (results["totalTrees"] ?? 0) * input.annualCostPerTree; results["annualCost"] = Number.isFinite(v) ? v : 0; } catch { results["annualCost"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) - (results["annualCost"] ?? 0); results["annualProfit"] = Number.isFinite(v) ? v : 0; } catch { results["annualProfit"] = 0; }
  try { const v = input.initialInvestment / (results["annualProfit"] ?? 0); results["paybackPeriod"] = Number.isFinite(v) ? v : 0; } catch { results["paybackPeriod"] = 0; }
  return results;
}


export function calculateOrchard_calculator(input: Orchard_calculatorInput): Orchard_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annualProfit"] ?? 0;
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


export interface Orchard_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
