// Auto-generated from perc-calculator-schema.json
import * as z from 'zod';

export interface Perc_calculatorInput {
  goodParts: number;
  totalParts: number;
  idealCycleTime: number;
  plannedProductionTime: number;
  downtime: number;
}

export const Perc_calculatorInputSchema = z.object({
  goodParts: z.number().default(1000),
  totalParts: z.number().default(1100),
  idealCycleTime: z.number().default(60),
  plannedProductionTime: z.number().default(28800),
  downtime: z.number().default(3600),
});

function evaluateAllFormulas(input: Perc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.plannedProductionTime - input.downtime) / input.plannedProductionTime; results["availability"] = Number.isFinite(v) ? v : 0; } catch { results["availability"] = 0; }
  try { const v = (input.idealCycleTime * input.totalParts) / input.plannedProductionTime; results["performance"] = Number.isFinite(v) ? v : 0; } catch { results["performance"] = 0; }
  try { const v = input.goodParts / input.totalParts; results["quality"] = Number.isFinite(v) ? v : 0; } catch { results["quality"] = 0; }
  try { const v = ((input.plannedProductionTime - input.downtime) / input.plannedProductionTime) * ((input.idealCycleTime * input.totalParts) / input.plannedProductionTime) * (input.goodParts / input.totalParts); results["overallOEE"] = Number.isFinite(v) ? v : 0; } catch { results["overallOEE"] = 0; }
  return results;
}


export function calculatePerc_calculator(input: Perc_calculatorInput): Perc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overallOEE"] ?? 0;
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


export interface Perc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
