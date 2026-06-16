// Auto-generated from concrete-cost-calculator-schema.json
import * as z from 'zod';

export interface Concrete_cost_calculatorInput {
  length: number;
  width: number;
  thickness: number;
  costPerCubicMeter: number;
  wastePercentage: number;
  deliveryCost: number;
}

export const Concrete_cost_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  thickness: z.number().default(0.15),
  costPerCubicMeter: z.number().default(120),
  wastePercentage: z.number().default(5),
  deliveryCost: z.number().default(200),
});

function evaluateAllFormulas(input: Concrete_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width * input.thickness; results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = (results["volume"] ?? 0) * (1 + input.wastePercentage / 100); results["effectiveVolume"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveVolume"] = 0; }
  try { const v = (results["effectiveVolume"] ?? 0) * input.costPerCubicMeter; results["materialCost"] = Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = (results["materialCost"] ?? 0) + input.deliveryCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateConcrete_cost_calculator(input: Concrete_cost_calculatorInput): Concrete_cost_calculatorOutput {
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


export interface Concrete_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
