// Auto-generated from lifting-calculator-schema.json
import * as z from 'zod';

export interface Lifting_calculatorInput {
  loadWeight: number;
  numberOfLegs: number;
  slingAngle: number;
  safetyFactor: number;
  dynamicFactor: number;
  loadDistributionFactor: number;
  dataConfidence?: number;
}

export const Lifting_calculatorInputSchema = z.object({
  loadWeight: z.number().default(1000),
  numberOfLegs: z.number().default(4),
  slingAngle: z.number().default(60),
  safetyFactor: z.number().default(5),
  dynamicFactor: z.number().default(1.1),
  loadDistributionFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lifting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadWeight * input.safetyFactor * input.dynamicFactor * input.loadDistributionFactor; results["verticalLoad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["verticalLoad"] = Number.NaN; }
  try { const v = input.loadWeight * input.safetyFactor * input.dynamicFactor * input.loadDistributionFactor; results["requiredCraneCapacity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredCraneCapacity"] = Number.NaN; }
  return results;
}


export function calculateLifting_calculator(input: Lifting_calculatorInput): Lifting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredCraneCapacity"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
