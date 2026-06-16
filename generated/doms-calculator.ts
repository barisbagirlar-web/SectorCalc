// Auto-generated from doms-calculator-schema.json
import * as z from 'zod';

export interface Doms_calculatorInput {
  plannedProductionTime: number;
  actualRunTime: number;
  idealCycleTime: number;
  totalCount: number;
  goodCount: number;
}

export const Doms_calculatorInputSchema = z.object({
  plannedProductionTime: z.number().default(8),
  actualRunTime: z.number().default(7.5),
  idealCycleTime: z.number().default(0.5),
  totalCount: z.number().default(800),
  goodCount: z.number().default(760),
});

function evaluateAllFormulas(input: Doms_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.actualRunTime / input.plannedProductionTime; results["availability"] = Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = (input.idealCycleTime * input.totalCount) / (input.actualRunTime * 60); results["performance"] = Number.isFinite(v) ? v : 0; } catch { results["performance"] = 0; }
  try { const v = input.goodCount / input.totalCount; results["quality"] = Number.isFinite(v) ? v : 0; } catch { results["quality"] = 0; }
  try { const v = (results["availability"] ?? 0) * (results["performance"] ?? 0) * (results["quality"] ?? 0); results["oee"] = Number.isFinite(v) ? v : 0; } catch { results["oee"] = 0; }
  return results;
}


export function calculateDoms_calculator(input: Doms_calculatorInput): Doms_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["oee"] ?? 0;
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


export interface Doms_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
