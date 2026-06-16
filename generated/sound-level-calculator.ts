// Auto-generated from sound-level-calculator-schema.json
import * as z from 'zod';

export interface Sound_level_calculatorInput {
  spl1: number;
  spl2: number;
  spl3: number;
  spl4: number;
  spl5: number;
}

export const Sound_level_calculatorInputSchema = z.object({
  spl1: z.number().default(80),
  spl2: z.number().default(0),
  spl3: z.number().default(0),
  spl4: z.number().default(0),
  spl5: z.number().default(0),
});

function evaluateAllFormulas(input: Sound_level_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * Math.log10( Math.pow(10, input.spl1/10) + Math.pow(10, input.spl2/10) + Math.pow(10, input.spl3/10) + Math.pow(10, input.spl4/10) + Math.pow(10, input.spl5/10) ); results["totalSoundPressureLevel"] = Number.isFinite(v) ? v : 0; } catch { results["totalSoundPressureLevel"] = 0; }
  try { const v = "SPL 1: " + input.spl1 + " dB"; results["spl1Result"] = Number.isFinite(v) ? v : 0; } catch { results["spl1Result"] = 0; }
  try { const v = "SPL 2: " + input.spl2 + " dB"; results["spl2Result"] = Number.isFinite(v) ? v : 0; } catch { results["spl2Result"] = 0; }
  try { const v = "SPL 3: " + input.spl3 + " dB"; results["spl3Result"] = Number.isFinite(v) ? v : 0; } catch { results["spl3Result"] = 0; }
  try { const v = "SPL 4: " + input.spl4 + " dB"; results["spl4Result"] = Number.isFinite(v) ? v : 0; } catch { results["spl4Result"] = 0; }
  try { const v = "SPL 5: " + input.spl5 + " dB"; results["spl5Result"] = Number.isFinite(v) ? v : 0; } catch { results["spl5Result"] = 0; }
  return results;
}


export function calculateSound_level_calculator(input: Sound_level_calculatorInput): Sound_level_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSoundPressureLevel"] ?? 0;
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


export interface Sound_level_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
