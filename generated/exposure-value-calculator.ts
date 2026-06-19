// Auto-generated from exposure-value-calculator-schema.json
import * as z from 'zod';

export interface Exposure_value_calculatorInput {
  aperture: number;
  shutterSpeed: number;
  iso: number;
  measuredEV: number;
  dataConfidence?: number;
}

export const Exposure_value_calculatorInputSchema = z.object({
  aperture: z.number().default(8),
  shutterSpeed: z.number().default(0.008),
  iso: z.number().default(100),
  measuredEV: z.number().default(12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Exposure_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.aperture * input.shutterSpeed * input.iso * input.measuredEV; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.aperture * input.shutterSpeed * input.iso * input.measuredEV; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateExposure_value_calculator(input: Exposure_value_calculatorInput): Exposure_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Exposure_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
