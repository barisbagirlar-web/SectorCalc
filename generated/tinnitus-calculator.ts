// Auto-generated from tinnitus-calculator-schema.json
import * as z from 'zod';

export interface Tinnitus_calculatorInput {
  noiseLevel_dBA: number;
  exposureDuration_h: number;
  age_years: number;
  exposureYears: number;
  hearingProtection_dB: number;
}

export const Tinnitus_calculatorInputSchema = z.object({
  noiseLevel_dBA: z.number().default(85),
  exposureDuration_h: z.number().default(8),
  age_years: z.number().default(40),
  exposureYears: z.number().default(10),
  hearingProtection_dB: z.number().default(0),
});

function evaluateAllFormulas(input: Tinnitus_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.noiseLevel_dBA - (input.hearingProtection_dB > 0 ? (input.hearingProtection_dB - 7) / 2 : 0); results["adjustedNoiseLevel"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedNoiseLevel"] = 0; }
  try { const v = 8 / Math.pow(2, ((results["adjustedNoiseLevel"] ?? 0) - 85) / 3); results["permissibleTime"] = Number.isFinite(v) ? v : 0; } catch { results["permissibleTime"] = 0; }
  try { const v = (input.exposureDuration_h / (results["permissibleTime"] ?? 0)) * 100; results["dailyDosePercent"] = Number.isFinite(v) ? v : 0; } catch { results["dailyDosePercent"] = 0; }
  try { const v = (results["dailyDosePercent"] ?? 0) * (input.age_years / 40) * (input.exposureYears / 10); results["tinnitusRiskScore"] = Number.isFinite(v) ? v : 0; } catch { results["tinnitusRiskScore"] = 0; }
  return results;
}


export function calculateTinnitus_calculator(input: Tinnitus_calculatorInput): Tinnitus_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tinnitusRiskScore"] ?? 0;
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


export interface Tinnitus_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
