// Auto-generated from roof-truss-calculator-schema.json
import * as z from 'zod';

export interface Roof_truss_calculatorInput {
  span: number;
  rise: number;
  overhang: number;
  length: number;
  spacing: number;
}

export const Roof_truss_calculatorInputSchema = z.object({
  span: z.number().default(10),
  rise: z.number().default(3),
  overhang: z.number().default(0.6),
  length: z.number().default(12),
  spacing: z.number().default(0.6),
});

function evaluateAllFormulas(input: Roof_truss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.span / 2 + input.overhang; results["halfRun"] = Number.isFinite(v) ? v : 0; } catch { results["halfRun"] = 0; }
  try { const v = Math.sqrt(Math.pow((results["halfRun"] ?? 0), 2) + Math.pow(input.rise, 2)); results["rafterLength"] = Number.isFinite(v) ? v : 0; } catch { results["rafterLength"] = 0; }
  try { const v = Math.atan(input.rise / (input.span / 2)) * (180 / Math.PI); results["angleDeg"] = Number.isFinite(v) ? v : 0; } catch { results["angleDeg"] = 0; }
  try { const v = Math.ceil(input.length / input.spacing) + 1; results["trussCount"] = Number.isFinite(v) ? v : 0; } catch { results["trussCount"] = 0; }
  try { const v = (results["rafterLength"] ?? 0) * 2 * (results["trussCount"] ?? 0); results["totalRafterLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalRafterLength"] = 0; }
  return results;
}


export function calculateRoof_truss_calculator(input: Roof_truss_calculatorInput): Roof_truss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rafterLength"] ?? 0;
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


export interface Roof_truss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
