// Auto-generated from cycling-gear-ratio-calculator-schema.json
import * as z from 'zod';

export interface Cycling_gear_ratio_calculatorInput {
  chainringTeeth: number;
  cassetteTeeth: number;
  wheelDiameter: number;
  cadence: number;
}

export const Cycling_gear_ratio_calculatorInputSchema = z.object({
  chainringTeeth: z.number().default(50),
  cassetteTeeth: z.number().default(12),
  wheelDiameter: z.number().default(700),
  cadence: z.number().default(90),
});

function evaluateAllFormulas(input: Cycling_gear_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.chainringTeeth / input.cassetteTeeth; results["gearRatio"] = Number.isFinite(v) ? v : 0; } catch { results["gearRatio"] = 0; }
  try { const v = (input.chainringTeeth / input.cassetteTeeth) * (input.wheelDiameter / 25.4); results["gearInches"] = Number.isFinite(v) ? v : 0; } catch { results["gearInches"] = 0; }
  try { const v = (Math.PI * input.wheelDiameter / 1000) * (input.chainringTeeth / input.cassetteTeeth); results["development"] = Number.isFinite(v) ? v : 0; } catch { results["development"] = 0; }
  try { const v = (Math.PI * input.wheelDiameter * input.chainringTeeth * input.cadence * 60) / (input.cassetteTeeth * 1000000); results["speedKmh"] = Number.isFinite(v) ? v : 0; } catch { results["speedKmh"] = 0; }
  try { const v = (input.chainringTeeth / input.cassetteTeeth) * (input.wheelDiameter / 25.4) * Math.PI * input.cadence * 60 / 63360; results["speedMph"] = Number.isFinite(v) ? v : 0; } catch { results["speedMph"] = 0; }
  return results;
}


export function calculateCycling_gear_ratio_calculator(input: Cycling_gear_ratio_calculatorInput): Cycling_gear_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Speed"] ?? 0;
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


export interface Cycling_gear_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
