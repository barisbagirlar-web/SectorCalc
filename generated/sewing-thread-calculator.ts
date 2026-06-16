// Auto-generated from sewing-thread-calculator-schema.json
import * as z from 'zod';

export interface Sewing_thread_calculatorInput {
  seamLength: number;
  stitchesPerCm: number;
  threadConsumptionPerStitch: number;
  numberOfGarments: number;
  wastePercentage: number;
}

export const Sewing_thread_calculatorInputSchema = z.object({
  seamLength: z.number().default(1),
  stitchesPerCm: z.number().default(4),
  threadConsumptionPerStitch: z.number().default(0.75),
  numberOfGarments: z.number().default(1),
  wastePercentage: z.number().default(5),
});

function evaluateAllFormulas(input: Sewing_thread_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.seamLength * input.stitchesPerCm * input.threadConsumptionPerStitch; results["totalThreadPerGarment"] = Number.isFinite(v) ? v : 0; } catch { results["totalThreadPerGarment"] = 0; }
  try { const v = (results["totalThreadPerGarment"] ?? 0) * input.numberOfGarments; results["totalWithoutWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalWithoutWaste"] = 0; }
  try { const v = (results["totalWithoutWaste"] ?? 0) * input.wastePercentage / 100; results["wasteAddition"] = Number.isFinite(v) ? v : 0; } catch { results["wasteAddition"] = 0; }
  try { const v = (results["totalWithoutWaste"] ?? 0) + (results["wasteAddition"] ?? 0); results["totalThreadWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalThreadWithWaste"] = 0; }
  return results;
}


export function calculateSewing_thread_calculator(input: Sewing_thread_calculatorInput): Sewing_thread_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalThreadWithWaste"] ?? 0;
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


export interface Sewing_thread_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
