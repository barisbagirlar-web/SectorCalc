// Auto-generated from dijkstra-calculator-schema.json
import * as z from 'zod';

export interface Dijkstra_calculatorInput {
  d_AB: number;
  d_AC: number;
  d_AD: number;
  d_BC: number;
  d_BD: number;
  d_CD: number;
}

export const Dijkstra_calculatorInputSchema = z.object({
  d_AB: z.number().default(10),
  d_AC: z.number().default(15),
  d_AD: z.number().default(20),
  d_BC: z.number().default(5),
  d_BD: z.number().default(10),
  d_CD: z.number().default(20),
});

function evaluateAllFormulas(input: Dijkstra_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.d_AD; results["path_direct"] = Number.isFinite(v) ? v : 0; } catch { results["path_direct"] = 0; }
  try { const v = input.d_AB + input.d_BD; results["path_ABD"] = Number.isFinite(v) ? v : 0; } catch { results["path_ABD"] = 0; }
  try { const v = input.d_AC + input.d_CD; results["path_ACD"] = Number.isFinite(v) ? v : 0; } catch { results["path_ACD"] = 0; }
  try { const v = input.d_AB + input.d_BC + input.d_CD; results["path_ABCD"] = Number.isFinite(v) ? v : 0; } catch { results["path_ABCD"] = 0; }
  try { const v = input.d_AC + input.d_BC + input.d_BD; results["path_ACBD"] = Number.isFinite(v) ? v : 0; } catch { results["path_ACBD"] = 0; }
  try { const v = Math.min((results["path_direct"] ?? 0), (results["path_ABD"] ?? 0), (results["path_ACD"] ?? 0), (results["path_ABCD"] ?? 0), (results["path_ACBD"] ?? 0)); results["shortest"] = Number.isFinite(v) ? v : 0; } catch { results["shortest"] = 0; }
  return results;
}


export function calculateDijkstra_calculator(input: Dijkstra_calculatorInput): Dijkstra_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["shortest"] ?? 0;
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


export interface Dijkstra_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
