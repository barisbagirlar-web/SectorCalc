// Auto-generated from home-maintenance-calculator-schema.json
import * as z from 'zod';

export interface Home_maintenance_calculatorInput {
  area: number;
  age: number;
  baseCostPerSqFt: number;
  ageMultiplier: number;
  inflation: number;
  yearsToProject: number;
}

export const Home_maintenance_calculatorInputSchema = z.object({
  area: z.number().default(1500),
  age: z.number().default(10),
  baseCostPerSqFt: z.number().default(1.5),
  ageMultiplier: z.number().default(0.02),
  inflation: z.number().default(0.03),
  yearsToProject: z.number().default(5),
});

function evaluateAllFormulas(input: Home_maintenance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.baseCostPerSqFt * (1 + input.age * input.ageMultiplier); results["currentAnnualCost"] = Number.isFinite(v) ? v : 0; } catch { results["currentAnnualCost"] = 0; }
  try { const v = input.baseCostPerSqFt * (1 + input.age * input.ageMultiplier); results["perSqFtCost"] = Number.isFinite(v) ? v : 0; } catch { results["perSqFtCost"] = 0; }
  try { const v = (results["currentAnnualCost"] ?? 0) * ((1+input.inflation)**input.yearsToProject - 1) / input.inflation; results["projectedTotal"] = Number.isFinite(v) ? v : 0; } catch { results["projectedTotal"] = 0; }
  return results;
}


export function calculateHome_maintenance_calculator(input: Home_maintenance_calculatorInput): Home_maintenance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["currentAnnualCost"] ?? 0;
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


export interface Home_maintenance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
