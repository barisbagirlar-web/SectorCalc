// Auto-generated from kok-yaprak-grafik-calculator-schema.json
import * as z from 'zod';

export interface Kok_yaprak_grafik_calculatorInput {
  v1: number;
  v2: number;
  v3: number;
  v4: number;
  v5: number;
  v6: number;
  v7: number;
  v8: number;
}

export const Kok_yaprak_grafik_calculatorInputSchema = z.object({
  v1: z.number().default(55),
  v2: z.number().default(62),
  v3: z.number().default(68),
  v4: z.number().default(73),
  v5: z.number().default(78),
  v6: z.number().default(81),
  v7: z.number().default(89),
  v8: z.number().default(95),
});

function evaluateAllFormulas(input: Kok_yaprak_grafik_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = result.trim(); results["kokYaprakGrafik"] = Number.isFinite(v) ? v : 0; } catch { results["kokYaprakGrafik"] = 0; }
  try { const v = 8; results["adet"] = Number.isFinite(v) ? v : 0; } catch { results["adet"] = 0; }
  try { const v = Math.min(input.v1, input.v2, input.v3, input.v4, input.v5, input.v6, input.v7, input.v8); results["minimum"] = Number.isFinite(v) ? v : 0; } catch { results["minimum"] = 0; }
  try { const v = Math.max(input.v1, input.v2, input.v3, input.v4, input.v5, input.v6, input.v7, input.v8); results["maksimum"] = Number.isFinite(v) ? v : 0; } catch { results["maksimum"] = 0; }
  try { const v = sorted.length % 2 !== 0 ? sorted : (sorted+sorted)/2; results["medyan"] = Number.isFinite(v) ? v : 0; } catch { results["medyan"] = 0; }
  return results;
}


export function calculateKok_yaprak_grafik_calculator(input: Kok_yaprak_grafik_calculatorInput): Kok_yaprak_grafik_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["kokYaprakGrafik"] ?? 0;
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


export interface Kok_yaprak_grafik_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
