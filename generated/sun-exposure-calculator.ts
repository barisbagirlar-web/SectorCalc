// Auto-generated from sun-exposure-calculator-schema.json
import * as z from 'zod';

export interface Sun_exposure_calculatorInput {
  uvIndex: number;
  skinType: number;
  spf: number;
  cloudCover: number;
  altitude: number;
}

export const Sun_exposure_calculatorInputSchema = z.object({
  uvIndex: z.number().default(5),
  skinType: z.number().default(3),
  spf: z.number().default(15),
  cloudCover: z.number().default(0),
  altitude: z.number().default(0),
});

function evaluateAllFormulas(input: Sun_exposure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.uvIndex * (1 + input.altitude / 1000 * 0.05) * (1 - input.cloudCover / 100); results["effectiveUVI"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveUVI"] = 0; }
  try { const v = (results["effectiveUVI"] ?? 0) * 0.025; results["erythemalDoseRate"] = Number.isFinite(v) ? v : 0; } catch { results["erythemalDoseRate"] = 0; }
  try { const v = [200,250,300,450,600,1000]; results["med"] = Number.isFinite(v) ? v : 0; } catch { results["med"] = 0; }
  try { const v = ((results["med"] ?? 0) / ((results["erythemalDoseRate"] ?? 0) * 3600)) * 60; results["medTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["medTimeMinutes"] = 0; }
  try { const v = (results["medTimeMinutes"] ?? 0) * input.spf; results["safeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["safeMinutes"] = 0; }
  return results;
}


export function calculateSun_exposure_calculator(input: Sun_exposure_calculatorInput): Sun_exposure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["safeMinutes"] ?? 0;
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


export interface Sun_exposure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
