// Auto-generated from dijkstra-calculator-schema.json
import * as z from 'zod';

export interface Dijkstra_calculatorInput {
  d_AB: number;
  d_AC: number;
  d_AD: number;
  d_BC: number;
  d_BD: number;
  d_CD: number;
  dataConfidence?: number;
}

export const Dijkstra_calculatorInputSchema = z.object({
  d_AB: z.number().default(10),
  d_AC: z.number().default(15),
  d_AD: z.number().default(20),
  d_BC: z.number().default(5),
  d_BD: z.number().default(10),
  d_CD: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dijkstra_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.d_AD; results["path_direct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["path_direct"] = Number.NaN; }
  try { const v = input.d_AB + input.d_BD; results["path_ABD"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["path_ABD"] = Number.NaN; }
  try { const v = input.d_AC + input.d_CD; results["path_ACD"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["path_ACD"] = Number.NaN; }
  try { const v = input.d_AB + input.d_BC + input.d_CD; results["path_ABCD"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["path_ABCD"] = Number.NaN; }
  try { const v = input.d_AC + input.d_BC + input.d_BD; results["path_ACBD"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["path_ACBD"] = Number.NaN; }
  return results;
}


export function calculateDijkstra_calculator(input: Dijkstra_calculatorInput): Dijkstra_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["path_ACBD"]);
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


export interface Dijkstra_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
