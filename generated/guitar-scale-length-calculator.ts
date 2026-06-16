// Auto-generated from guitar-scale-length-calculator-schema.json
import * as z from 'zod';

export interface Guitar_scale_length_calculatorInput {
  scaleLength: number;
  numberOfFrets: number;
  fretNumber: number;
  stringGauge: number;
  tuningFrequency: number;
}

export const Guitar_scale_length_calculatorInputSchema = z.object({
  scaleLength: z.number().default(648),
  numberOfFrets: z.number().default(22),
  fretNumber: z.number().default(12),
  stringGauge: z.number().default(0.01),
  tuningFrequency: z.number().default(329.63),
});

function evaluateAllFormulas(input: Guitar_scale_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scaleLength * (1 - Math.pow(2, -input.fretNumber / 12)); results["fretDistance"] = Number.isFinite(v) ? v : 0; } catch { results["fretDistance"] = 0; }
  try { const v = input.scaleLength / 25.4; results["scaleLengthInches"] = Number.isFinite(v) ? v : 0; } catch { results["scaleLengthInches"] = 0; }
  try { const v = 0.283 * Math.PI * Math.pow(input.stringGauge / 2, 2); results["stringUnitWeight"] = Number.isFinite(v) ? v : 0; } catch { results["stringUnitWeight"] = 0; }
  try { const v = ((results["stringUnitWeight"] ?? 0) * Math.pow(2 * (results["scaleLengthInches"] ?? 0) * input.tuningFrequency, 2)) / 386.4; results["tensionLbs"] = Number.isFinite(v) ? v : 0; } catch { results["tensionLbs"] = 0; }
  try { const v = (results["tensionLbs"] ?? 0) * 0.453592; results["tensionKg"] = Number.isFinite(v) ? v : 0; } catch { results["tensionKg"] = 0; }
  return results;
}


export function calculateGuitar_scale_length_calculator(input: Guitar_scale_length_calculatorInput): Guitar_scale_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Distance"] ?? 0;
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


export interface Guitar_scale_length_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
