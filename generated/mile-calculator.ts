// Auto-generated from mile-calculator-schema.json
import * as z from 'zod';

export interface Mile_calculatorInput {
  distanceMiles: number;
  fuelEfficiency: number;
  fuelPrice: number;
  maintenanceCost: number;
  otherFixedCosts: number;
  annualMiles: number;
}

export const Mile_calculatorInputSchema = z.object({
  distanceMiles: z.number().default(100),
  fuelEfficiency: z.number().default(25),
  fuelPrice: z.number().default(3.5),
  maintenanceCost: z.number().default(0.05),
  otherFixedCosts: z.number().default(1200),
  annualMiles: z.number().default(12000),
});

function evaluateAllFormulas(input: Mile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelPrice / input.fuelEfficiency; results["fuelCostPerMile"] = Number.isFinite(v) ? v : 0; } catch { results["fuelCostPerMile"] = 0; }
  try { const v = input.maintenanceCost; results["maintenanceCostPerMile"] = Number.isFinite(v) ? v : 0; } catch { results["maintenanceCostPerMile"] = 0; }
  try { const v = input.otherFixedCosts / input.annualMiles; results["fixedCostPerMile"] = Number.isFinite(v) ? v : 0; } catch { results["fixedCostPerMile"] = 0; }
  try { const v = input.fuelPrice / input.fuelEfficiency + input.maintenanceCost + input.otherFixedCosts / input.annualMiles; results["totalCostPerMile"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostPerMile"] = 0; }
  return results;
}


export function calculateMile_calculator(input: Mile_calculatorInput): Mile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCostPerMile"] ?? 0;
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


export interface Mile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
