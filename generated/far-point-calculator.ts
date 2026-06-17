// Auto-generated from far-point-calculator-schema.json
import * as z from 'zod';

export interface Far_point_calculatorInput {
  observerHeight: number;
  targetHeight: number;
  earthRadius: number;
  refractionCoefficient: number;
}

export const Far_point_calculatorInputSchema = z.object({
  observerHeight: z.number().default(1.7),
  targetHeight: z.number().default(0),
  earthRadius: z.number().default(6371),
  refractionCoefficient: z.number().default(0.13),
});

function evaluateAllFormulas(input: Far_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.earthRadius / (1 - input.refractionCoefficient); results["effectiveRadius"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRadius"] = 0; }
  try { const v = Math.sqrt(2 * (results["effectiveRadius"] ?? 0) * (input.observerHeight / 1000)); results["horizonDistance"] = Number.isFinite(v) ? v : 0; } catch { results["horizonDistance"] = 0; }
  try { const v = Math.sqrt(2 * (results["effectiveRadius"] ?? 0) * (input.targetHeight / 1000)); results["targetHorizonDistance"] = Number.isFinite(v) ? v : 0; } catch { results["targetHorizonDistance"] = 0; }
  try { const v = (results["horizonDistance"] ?? 0) + (results["targetHorizonDistance"] ?? 0); results["lineOfSightDistance"] = Number.isFinite(v) ? v : 0; } catch { results["lineOfSightDistance"] = 0; }
  return results;
}


export function calculateFar_point_calculator(input: Far_point_calculatorInput): Far_point_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectiveRadius"] ?? 0;
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


export interface Far_point_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
