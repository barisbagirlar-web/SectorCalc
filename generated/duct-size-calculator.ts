// Auto-generated from duct-size-calculator-schema.json
import * as z from 'zod';

export interface Duct_size_calculatorInput {
  flowRate: number;
  velocity: number;
  aspectRatio: number;
  safetyFactor: number;
}

export const Duct_size_calculatorInputSchema = z.object({
  flowRate: z.number().default(1),
  velocity: z.number().default(5),
  aspectRatio: z.number().default(1),
  safetyFactor: z.number().default(1.1),
});

function evaluateAllFormulas(input: Duct_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.flowRate * input.safetyFactor) / input.velocity; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = 2 * Math.sqrt((results["area"] ?? 0) / Math.PI); results["roundDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["roundDiameter"] = 0; }
  try { const v = Math.sqrt((results["area"] ?? 0) / input.aspectRatio); results["rectHeight"] = Number.isFinite(v) ? v : 0; } catch { results["rectHeight"] = 0; }
  try { const v = input.aspectRatio * (results["rectHeight"] ?? 0); results["rectWidth"] = Number.isFinite(v) ? v : 0; } catch { results["rectWidth"] = 0; }
  return results;
}


export function calculateDuct_size_calculator(input: Duct_size_calculatorInput): Duct_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundDiameter"] ?? 0;
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


export interface Duct_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
