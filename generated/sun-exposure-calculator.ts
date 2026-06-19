// Auto-generated from sun-exposure-calculator-schema.json
import * as z from 'zod';

export interface Sun_exposure_calculatorInput {
  uvIndex: number;
  skinType: number;
  spf: number;
  cloudCover: number;
  altitude: number;
  dataConfidence?: number;
}

export const Sun_exposure_calculatorInputSchema = z.object({
  uvIndex: z.number().default(5),
  skinType: z.number().default(3),
  spf: z.number().default(15),
  cloudCover: z.number().default(0),
  altitude: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sun_exposure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.uvIndex * (1 + input.altitude / 1000 * 0.05) * (1 - input.cloudCover / 100); results["effectiveUVI"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveUVI"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveUVI"])) * 0.025; results["erythemalDoseRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["erythemalDoseRate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSun_exposure_calculator(input: Sun_exposure_calculatorInput): Sun_exposure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["erythemalDoseRate"]));
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


export interface Sun_exposure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
