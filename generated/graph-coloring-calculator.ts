// Auto-generated from graph-coloring-calculator-schema.json
import * as z from 'zod';

export interface Graph_coloring_calculatorInput {
  measurement: number;
  target: number;
  lowerSpec: number;
  upperSpec: number;
  warningFraction: number;
}

export const Graph_coloring_calculatorInputSchema = z.object({
  measurement: z.number().default(10),
  target: z.number().default(10),
  lowerSpec: z.number().default(8),
  upperSpec: z.number().default(12),
  warningFraction: z.number().default(0.5),
});

function evaluateAllFormulas(input: Graph_coloring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.upperSpec - input.lowerSpec) / 2; results["specHalfRange"] = Number.isFinite(v) ? v : 0; } catch { results["specHalfRange"] = 0; }
  try { const v = (results["specHalfRange"] ?? 0) * input.warningFraction; results["warningHalfWidth"] = Number.isFinite(v) ? v : 0; } catch { results["warningHalfWidth"] = 0; }
  try { const v = (input.measurement >= input.lowerSpec && input.measurement <= input.upperSpec) ? 1 : 0; results["isWithinSpec"] = Number.isFinite(v) ? v : 0; } catch { results["isWithinSpec"] = 0; }
  try { const v = (input.measurement >= input.target - (results["warningHalfWidth"] ?? 0) && input.measurement <= input.target + (results["warningHalfWidth"] ?? 0)) ? 1 : 0; results["isGood"] = Number.isFinite(v) ? v : 0; } catch { results["isGood"] = 0; }
  try { const v = (results["isWithinSpec"] ?? 0) ? ((results["isGood"] ?? 0) ? 2 : 1) : 0; results["colorCode"] = Number.isFinite(v) ? v : 0; } catch { results["colorCode"] = 0; }
  try { const v = input.measurement - input.target; results["deviation"] = Number.isFinite(v) ? v : 0; } catch { results["deviation"] = 0; }
  try { const v = ((input.measurement - input.target) / (results["specHalfRange"] ?? 0)) * 100; results["percentDeviation"] = Number.isFinite(v) ? v : 0; } catch { results["percentDeviation"] = 0; }
  return results;
}


export function calculateGraph_coloring_calculator(input: Graph_coloring_calculatorInput): Graph_coloring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["colorCode"] ?? 0;
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


export interface Graph_coloring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
