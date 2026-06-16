// Auto-generated from candy-temperature-calculator-schema.json
import * as z from 'zod';

export interface Candy_temperature_calculatorInput {
  stageIndex: number;
  altitudeFt: number;
  customTempF: number;
  thermometerOffsetF: number;
}

export const Candy_temperature_calculatorInputSchema = z.object({
  stageIndex: z.number().default(6),
  altitudeFt: z.number().default(0),
  customTempF: z.number().default(300),
  thermometerOffsetF: z.number().default(0),
});

function evaluateAllFormulas(input: Candy_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.stageIndex == 0) ? input.customTempF : [230, 238, 245, 255, 280, 305, 335] || 230; results["baseTempF"] = Number.isFinite(v) ? v : 0; } catch { results["baseTempF"] = 0; }
  try { const v = -(input.altitudeFt / 500); results["altitudeAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["altitudeAdjustment"] = 0; }
  try { const v = (results["baseTempF"] ?? 0) + (results["altitudeAdjustment"] ?? 0) + input.thermometerOffsetF; results["adjustedF"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedF"] = 0; }
  try { const v = ((results["adjustedF"] ?? 0) - 32) * 5 / 9; results["adjustedC"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedC"] = 0; }
  return results;
}


export function calculateCandy_temperature_calculator(input: Candy_temperature_calculatorInput): Candy_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total"] ?? 0;
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


export interface Candy_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
