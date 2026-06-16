// Auto-generated from child-growth-calculator-schema.json
import * as z from 'zod';

export interface Child_growth_calculatorInput {
  parentQuantity: number;
  bomMultiplier: number;
  scrapRate: number;
  safetyStockFactor: number;
}

export const Child_growth_calculatorInputSchema = z.object({
  parentQuantity: z.number().default(100),
  bomMultiplier: z.number().default(1),
  scrapRate: z.number().default(0),
  safetyStockFactor: z.number().default(0),
});

function evaluateAllFormulas(input: Child_growth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.parentQuantity * input.bomMultiplier; results["grossRequirement"] = Number.isFinite(v) ? v : 0; } catch { results["grossRequirement"] = 0; }
  try { const v = (results["grossRequirement"] ?? 0) / (1 - input.scrapRate / 100); results["netRequirement"] = Number.isFinite(v) ? v : 0; } catch { results["netRequirement"] = 0; }
  try { const v = (results["netRequirement"] ?? 0) * (1 + input.safetyStockFactor / 100); results["finalRequirement"] = Number.isFinite(v) ? v : 0; } catch { results["finalRequirement"] = 0; }
  return results;
}


export function calculateChild_growth_calculator(input: Child_growth_calculatorInput): Child_growth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalRequirement"] ?? 0;
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


export interface Child_growth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
