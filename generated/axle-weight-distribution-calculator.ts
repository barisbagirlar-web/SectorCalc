// Auto-generated from axle-weight-distribution-calculator-schema.json
import * as z from 'zod';

export interface Axle_weight_distribution_calculatorInput {
  totalWeight: number;
  wheelbase: number;
  cgDistance: number;
  dynamicFactor: number;
  dataConfidence?: number;
}

export const Axle_weight_distribution_calculatorInputSchema = z.object({
  totalWeight: z.number().default(10000),
  wheelbase: z.number().default(4.5),
  cgDistance: z.number().default(2),
  dynamicFactor: z.number().default(1.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Axle_weight_distribution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWeight * (input.wheelbase - input.cgDistance) / input.wheelbase; results["staticFrontLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["staticFrontLoad"] = 0; }
  try { const v = input.totalWeight * input.cgDistance / input.wheelbase; results["staticRearLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["staticRearLoad"] = 0; }
  try { const v = (asFormulaNumber(results["staticFrontLoad"])) * input.dynamicFactor; results["dynamicFrontLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dynamicFrontLoad"] = 0; }
  try { const v = (asFormulaNumber(results["staticRearLoad"])) * input.dynamicFactor; results["dynamicRearLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dynamicRearLoad"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAxle_weight_distribution_calculator(input: Axle_weight_distribution_calculatorInput): Axle_weight_distribution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dynamicRearLoad"]);
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


export interface Axle_weight_distribution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
