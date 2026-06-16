// Auto-generated from sausage-calculator-schema.json
import * as z from 'zod';

export interface Sausage_calculatorInput {
  totalWeight: number;
  fatPercentage: number;
  meatCost: number;
  fatCost: number;
  casingDiameter: number;
  casingCost: number;
}

export const Sausage_calculatorInputSchema = z.object({
  totalWeight: z.number().default(10),
  fatPercentage: z.number().default(20),
  meatCost: z.number().default(5),
  fatCost: z.number().default(2),
  casingDiameter: z.number().default(30),
  casingCost: z.number().default(0.5),
});

function evaluateAllFormulas(input: Sausage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWeight * (1 - input.fatPercentage / 100); results["meatWeight"] = Number.isFinite(v) ? v : 0; } catch { results["meatWeight"] = 0; }
  try { const v = input.totalWeight * (input.fatPercentage / 100); results["fatWeight"] = Number.isFinite(v) ? v : 0; } catch { results["fatWeight"] = 0; }
  try { const v = (4000 * input.totalWeight) / (Math.PI * Math.pow(input.casingDiameter, 2)); results["casingLength"] = Number.isFinite(v) ? v : 0; } catch { results["casingLength"] = 0; }
  try { const v = (results["meatWeight"] ?? 0) * input.meatCost + (results["fatWeight"] ?? 0) * input.fatCost + (results["casingLength"] ?? 0) * input.casingCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateSausage_calculator(input: Sausage_calculatorInput): Sausage_calculatorOutput {
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


export interface Sausage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
