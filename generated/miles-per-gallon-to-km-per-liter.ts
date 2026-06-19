// Auto-generated from miles-per-gallon-to-km-per-liter-schema.json
import * as z from 'zod';

export interface Miles_per_gallon_to_km_per_literInput {
  mpg: number;
  fuelType: number;
  temperatureCorrection: number;
  altitudeCorrection: number;
  dataConfidence?: number;
}

export const Miles_per_gallon_to_km_per_literInputSchema = z.object({
  mpg: z.number().default(25),
  fuelType: z.number().default(1),
  temperatureCorrection: z.number().default(1),
  altitudeCorrection: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Miles_per_gallon_to_km_per_literInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mpg * 0.425143707 * input.fuelType * input.temperatureCorrection * input.altitudeCorrection; results["kmPerLiter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["kmPerLiter"] = 0; }
  try { const v = 235.214583 / (input.mpg * input.fuelType * input.temperatureCorrection * input.altitudeCorrection); results["litersPer100km"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["litersPer100km"] = 0; }
  try { const v = 100 / input.mpg; results["gallonsPer100Miles"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gallonsPer100Miles"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMiles_per_gallon_to_km_per_liter(input: Miles_per_gallon_to_km_per_literInput): Miles_per_gallon_to_km_per_literOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["kmPerLiter"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Miles_per_gallon_to_km_per_literOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
