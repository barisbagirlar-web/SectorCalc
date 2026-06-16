// Auto-generated from lifting-calculator-schema.json
import * as z from 'zod';

export interface Lifting_calculatorInput {
  loadWeight: number;
  numberOfLegs: number;
  slingAngle: number;
  safetyFactor: number;
  dynamicFactor: number;
  loadDistributionFactor: number;
}

export const Lifting_calculatorInputSchema = z.object({
  loadWeight: z.number().default(1000),
  numberOfLegs: z.number().default(4),
  slingAngle: z.number().default(60),
  safetyFactor: z.number().default(5),
  dynamicFactor: z.number().default(1.1),
  loadDistributionFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Lifting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadWeight * input.safetyFactor * input.dynamicFactor * input.loadDistributionFactor; results["verticalLoad"] = Number.isFinite(v) ? v : 0; } catch { results["verticalLoad"] = 0; }
  try { const v = (input.loadWeight * input.safetyFactor * input.dynamicFactor * input.loadDistributionFactor) / (input.numberOfLegs * Math.cos(input.slingAngle * Math.PI / 180)); results["tensionPerLeg"] = Number.isFinite(v) ? v : 0; } catch { results["tensionPerLeg"] = 0; }
  try { const v = input.loadWeight * input.safetyFactor * input.dynamicFactor * input.loadDistributionFactor; results["requiredCraneCapacity"] = Number.isFinite(v) ? v : 0; } catch { results["requiredCraneCapacity"] = 0; }
  return results;
}


export function calculateLifting_calculator(input: Lifting_calculatorInput): Lifting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredCraneCapacity"] ?? 0;
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


export interface Lifting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
