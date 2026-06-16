// Auto-generated from hydroponics-calculator-schema.json
import * as z from 'zod';

export interface Hydroponics_calculatorInput {
  fertilizerMass: number;
  nutrientPercentage: number;
  waterVolumeForStock: number;
  targetPpm: number;
  reservoirWaterVolume: number;
}

export const Hydroponics_calculatorInputSchema = z.object({
  fertilizerMass: z.number().default(100),
  nutrientPercentage: z.number().default(10),
  waterVolumeForStock: z.number().default(1),
  targetPpm: z.number().default(150),
  reservoirWaterVolume: z.number().default(100),
});

function evaluateAllFormulas(input: Hydroponics_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fertilizerMass * 10 * input.nutrientPercentage) / input.waterVolumeForStock; results["stockPpm"] = Number.isFinite(v) ? v : 0; } catch { results["stockPpm"] = 0; }
  try { const v = (input.targetPpm * input.reservoirWaterVolume) / (results["stockPpm"] ?? 0); results["stockVolumeL"] = Number.isFinite(v) ? v : 0; } catch { results["stockVolumeL"] = 0; }
  try { const v = (results["stockVolumeL"] ?? 0) * 1000; results["stockVolumeML"] = Number.isFinite(v) ? v : 0; } catch { results["stockVolumeML"] = 0; }
  return results;
}


export function calculateHydroponics_calculator(input: Hydroponics_calculatorInput): Hydroponics_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["stockVolumeML"] ?? 0;
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


export interface Hydroponics_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
