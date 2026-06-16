// Auto-generated from cost-of-living-calculator-schema.json
import * as z from 'zod';

export interface Cost_of_living_calculatorInput {
  housing: number;
  food: number;
  transportation: number;
  utilities: number;
  healthcare: number;
  entertainment: number;
}

export const Cost_of_living_calculatorInputSchema = z.object({
  housing: z.number().default(0),
  food: z.number().default(0),
  transportation: z.number().default(0),
  utilities: z.number().default(0),
  healthcare: z.number().default(0),
  entertainment: z.number().default(0),
});

function evaluateAllFormulas(input: Cost_of_living_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.housing + input.food + input.transportation + input.utilities + input.healthcare + input.entertainment; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (input.housing / (results["totalCost"] ?? 0)) * 100; results["housingPercent"] = Number.isFinite(v) ? v : 0; } catch { results["housingPercent"] = 0; }
  try { const v = (input.food / (results["totalCost"] ?? 0)) * 100; results["foodPercent"] = Number.isFinite(v) ? v : 0; } catch { results["foodPercent"] = 0; }
  try { const v = (input.transportation / (results["totalCost"] ?? 0)) * 100; results["transportationPercent"] = Number.isFinite(v) ? v : 0; } catch { results["transportationPercent"] = 0; }
  try { const v = (input.utilities / (results["totalCost"] ?? 0)) * 100; results["utilitiesPercent"] = Number.isFinite(v) ? v : 0; } catch { results["utilitiesPercent"] = 0; }
  try { const v = (input.healthcare / (results["totalCost"] ?? 0)) * 100; results["healthcarePercent"] = Number.isFinite(v) ? v : 0; } catch { results["healthcarePercent"] = 0; }
  try { const v = (input.entertainment / (results["totalCost"] ?? 0)) * 100; results["entertainmentPercent"] = Number.isFinite(v) ? v : 0; } catch { results["entertainmentPercent"] = 0; }
  return results;
}


export function calculateCost_of_living_calculator(input: Cost_of_living_calculatorInput): Cost_of_living_calculatorOutput {
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


export interface Cost_of_living_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
