// Auto-generated from car-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Car_depreciation_calculatorInput {
  purchasePrice: number;
  residualValuePercentage: number;
  currentAge: number;
  expectedLifespan: number;
  mileage: number;
  expectedMileage: number;
}

export const Car_depreciation_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(30000),
  residualValuePercentage: z.number().default(20),
  currentAge: z.number().default(5),
  expectedLifespan: z.number().default(15),
  mileage: z.number().default(100000),
  expectedMileage: z.number().default(300000),
});

function evaluateAllFormulas(input: Car_depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice - (( (input.currentAge/input.expectedLifespan + input.mileage/input.expectedMileage + Math.sqrt((input.currentAge/input.expectedLifespan - input.mileage/input.expectedMileage) ** 2)) / 2 ) * (input.purchasePrice - input.purchasePrice * input.residualValuePercentage/100)); results["currentValue"] = Number.isFinite(v) ? v : 0; } catch { results["currentValue"] = 0; }
  try { const v = (( (input.currentAge/input.expectedLifespan + input.mileage/input.expectedMileage + Math.sqrt((input.currentAge/input.expectedLifespan - input.mileage/input.expectedMileage) ** 2)) / 2 ) * (input.purchasePrice - input.purchasePrice * input.residualValuePercentage/100)); results["totalDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["totalDepreciation"] = 0; }
  try { const v = (input.purchasePrice - input.purchasePrice * input.residualValuePercentage/100) / input.expectedLifespan; results["annualDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["annualDepreciation"] = 0; }
  try { const v = ((( (input.currentAge/input.expectedLifespan + input.mileage/input.expectedMileage + Math.sqrt((input.currentAge/input.expectedLifespan - input.mileage/input.expectedMileage) ** 2)) / 2 ) * (input.purchasePrice - input.purchasePrice * input.residualValuePercentage/100)) / input.purchasePrice) * 100; results["depreciationPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["depreciationPercentage"] = 0; }
  return results;
}


export function calculateCar_depreciation_calculator(input: Car_depreciation_calculatorInput): Car_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["currentValue"] ?? 0;
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


export interface Car_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
