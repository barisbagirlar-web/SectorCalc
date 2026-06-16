// Auto-generated from cost-segregation-calculator-schema.json
import * as z from 'zod';

export interface Cost_segregation_calculatorInput {
  totalPropertyCost: number;
  landPercentage: number;
  buildingPercentage: number;
  personalPropertyPercentage: number;
  landImprovementsPercentage: number;
  buildingLife: number;
  personalPropertyLife: number;
  landImprovementsLife: number;
}

export const Cost_segregation_calculatorInputSchema = z.object({
  totalPropertyCost: z.number().default(1000000),
  landPercentage: z.number().default(20),
  buildingPercentage: z.number().default(60),
  personalPropertyPercentage: z.number().default(15),
  landImprovementsPercentage: z.number().default(5),
  buildingLife: z.number().default(39),
  personalPropertyLife: z.number().default(7),
  landImprovementsLife: z.number().default(15),
});

function evaluateAllFormulas(input: Cost_segregation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalPropertyCost * (input.buildingPercentage / 100); results["buildingCost"] = Number.isFinite(v) ? v : 0; } catch { results["buildingCost"] = 0; }
  try { const v = input.totalPropertyCost * (input.personalPropertyPercentage / 100); results["personalPropertyCost"] = Number.isFinite(v) ? v : 0; } catch { results["personalPropertyCost"] = 0; }
  try { const v = input.totalPropertyCost * (input.landImprovementsPercentage / 100); results["landImprovementsCost"] = Number.isFinite(v) ? v : 0; } catch { results["landImprovementsCost"] = 0; }
  try { const v = (results["buildingCost"] ?? 0) / input.buildingLife; results["buildingDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["buildingDepreciation"] = 0; }
  try { const v = (results["personalPropertyCost"] ?? 0) / input.personalPropertyLife; results["personalPropertyDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["personalPropertyDepreciation"] = 0; }
  try { const v = (results["landImprovementsCost"] ?? 0) / input.landImprovementsLife; results["landImprovementsDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["landImprovementsDepreciation"] = 0; }
  try { const v = (results["buildingDepreciation"] ?? 0) + (results["personalPropertyDepreciation"] ?? 0) + (results["landImprovementsDepreciation"] ?? 0); results["totalAnnualDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualDepreciation"] = 0; }
  return results;
}


export function calculateCost_segregation_calculator(input: Cost_segregation_calculatorInput): Cost_segregation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalAnnualDepreciation"] ?? 0;
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


export interface Cost_segregation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
