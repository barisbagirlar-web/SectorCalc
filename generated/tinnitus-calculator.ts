// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tinnitus_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.noiseLevel_dBA - (input.hearingProtection_dB > 0 ? (input.hearingProtection_dB - 7) / 2 : 0); results["adjustedNoiseLevel"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedNoiseLevel"] = 0; }
  try { const v = input.noiseLevel_dBA - (input.hearingProtection_dB > 0 ? (input.hearingProtection_dB - 7) / 2 : 0); results["adjustedNoiseLevel_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedNoiseLevel_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTinnitus_calculator(input: Tinnitus_calculatorInput): Tinnitus_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedNoiseLevel_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
