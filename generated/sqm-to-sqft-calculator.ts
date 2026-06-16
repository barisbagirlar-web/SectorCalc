// Auto-generated from sqm-to-sqft-calculator-schema.json
import * as z from 'zod';

export interface Sqm_to_sqft_calculatorInput {
  areaSqm: number;
  conversionFactor: number;
  roundingPrecision: number;
  areaUnitPrice: number;
  wasteFactor: number;
  measurementTolerance: number;
}

export const Sqm_to_sqft_calculatorInputSchema = z.object({
  areaSqm: z.number().default(1),
  conversionFactor: z.number().default(10.7639104),
  roundingPrecision: z.number().default(2),
  areaUnitPrice: z.number().default(0),
  wasteFactor: z.number().default(0),
  measurementTolerance: z.number().default(0),
});

function evaluateAllFormulas(input: Sqm_to_sqft_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.areaSqm * input.conversionFactor; results["areaSqft"] = Number.isFinite(v) ? v : 0; } catch { results["areaSqft"] = 0; }
  try { const v = Math.round(input.areaSqm * input.conversionFactor * Math.pow(10, input.roundingPrecision)) / Math.pow(10, input.roundingPrecision); results["roundedAreaSqft"] = Number.isFinite(v) ? v : 0; } catch { results["roundedAreaSqft"] = 0; }
  try { const v = (results["roundedAreaSqft"] ?? 0) * (1 + input.wasteFactor / 100); results["areaWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["areaWithWaste"] = 0; }
  try { const v = (results["areaWithWaste"] ?? 0) * input.areaUnitPrice; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["roundedAreaSqft"] ?? 0) * (1 - input.measurementTolerance / 100); results["toleranceMin"] = Number.isFinite(v) ? v : 0; } catch { results["toleranceMin"] = 0; }
  try { const v = (results["roundedAreaSqft"] ?? 0) * (1 + input.measurementTolerance / 100); results["toleranceMax"] = Number.isFinite(v) ? v : 0; } catch { results["toleranceMax"] = 0; }
  return results;
}


export function calculateSqm_to_sqft_calculator(input: Sqm_to_sqft_calculatorInput): Sqm_to_sqft_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roundedAreaSqft"] ?? 0;
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


export interface Sqm_to_sqft_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
