// Auto-generated from metal-roofing-calculator-schema.json
import * as z from 'zod';

export interface Metal_roofing_calculatorInput {
  roofArea: number;
  materialCostPerUnit: number;
  laborCostPerUnit: number;
  wasteFactor: number;
}

export const Metal_roofing_calculatorInputSchema = z.object({
  roofArea: z.number().default(100),
  materialCostPerUnit: z.number().default(15),
  laborCostPerUnit: z.number().default(10),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Metal_roofing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofArea * input.materialCostPerUnit * (1 + input.wasteFactor / 100); results["materialCost"] = Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.roofArea * input.laborCostPerUnit; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = input.roofArea * input.materialCostPerUnit * input.wasteFactor / 100; results["wasteCost"] = Number.isFinite(v) ? v : 0; } catch { results["wasteCost"] = 0; }
  try { const v = (results["materialCost"] ?? 0) + (results["laborCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateMetal_roofing_calculator(input: Metal_roofing_calculatorInput): Metal_roofing_calculatorOutput {
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


export interface Metal_roofing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
