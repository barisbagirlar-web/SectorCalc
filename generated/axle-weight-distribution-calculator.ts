// Auto-generated from axle-weight-distribution-calculator-schema.json
import * as z from 'zod';

export interface Axle_weight_distribution_calculatorInput {
  totalWeight: number;
  wheelbase: number;
  cgDistance: number;
  dynamicFactor: number;
}

export const Axle_weight_distribution_calculatorInputSchema = z.object({
  totalWeight: z.number().default(10000),
  wheelbase: z.number().default(4.5),
  cgDistance: z.number().default(2),
  dynamicFactor: z.number().default(1.2),
});

function evaluateAllFormulas(input: Axle_weight_distribution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWeight * (input.wheelbase - input.cgDistance) / input.wheelbase; results["staticFrontLoad"] = Number.isFinite(v) ? v : 0; } catch { results["staticFrontLoad"] = 0; }
  try { const v = input.totalWeight * input.cgDistance / input.wheelbase; results["staticRearLoad"] = Number.isFinite(v) ? v : 0; } catch { results["staticRearLoad"] = 0; }
  try { const v = (results["staticFrontLoad"] ?? 0) * input.dynamicFactor; results["dynamicFrontLoad"] = Number.isFinite(v) ? v : 0; } catch { results["dynamicFrontLoad"] = 0; }
  try { const v = (results["staticRearLoad"] ?? 0) * input.dynamicFactor; results["dynamicRearLoad"] = Number.isFinite(v) ? v : 0; } catch { results["dynamicRearLoad"] = 0; }
  try { const v = Math.max((results["dynamicFrontLoad"] ?? 0), (results["dynamicRearLoad"] ?? 0)); results["maxAxleLoad"] = Number.isFinite(v) ? v : 0; } catch { results["maxAxleLoad"] = 0; }
  return results;
}


export function calculateAxle_weight_distribution_calculator(input: Axle_weight_distribution_calculatorInput): Axle_weight_distribution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxAxleLoad"] ?? 0;
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


export interface Axle_weight_distribution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
