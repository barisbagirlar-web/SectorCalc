// Auto-generated from tinnitus-calculator-schema.json
import * as z from 'zod';

export interface Tinnitus_calculatorInput {
  noiseLevel_dBA: number;
  exposureDuration_h: number;
  age_years: number;
  exposureYears: number;
  hearingProtection_dB: number;
  dataConfidence?: number;
}

export const Tinnitus_calculatorInputSchema = z.object({
  noiseLevel_dBA: z.number().default(85),
  exposureDuration_h: z.number().default(8),
  age_years: z.number().default(40),
  exposureYears: z.number().default(10),
  hearingProtection_dB: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tinnitus_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.noiseLevel_dBA - (input.hearingProtection_dB > 0 ? (input.hearingProtection_dB - 7) / 2 : 0); results["adjustedNoiseLevel"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedNoiseLevel"] = 0; }
  try { const v = 480 / (2 ^ (((asFormulaNumber(results["adjustedNoiseLevel"])) - 85) / 3)); results["permissibleTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["permissibleTime"] = 0; }
  try { const v = (input.exposureDuration_h * 60) / (asFormulaNumber(results["permissibleTime"])) * 100; results["dailyDosePercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyDosePercent"] = 0; }
  try { const v = (((asFormulaNumber(results["adjustedNoiseLevel"])) - 80) * input.exposureYears * (input.age_years / 40)) / 100; results["tinnitusRiskScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tinnitusRiskScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTinnitus_calculator(input: Tinnitus_calculatorInput): Tinnitus_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["tinnitusRiskScore"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
