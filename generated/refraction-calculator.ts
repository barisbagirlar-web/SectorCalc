// Auto-generated from refraction-calculator-schema.json
import * as z from 'zod';

export interface Refraction_calculatorInput {
  incidentAngle: number;
  refractiveIndex1: number;
  refractiveIndex2: number;
  thickness: number;
  dataConfidence?: number;
}

export const Refraction_calculatorInputSchema = z.object({
  incidentAngle: z.number().default(30),
  refractiveIndex1: z.number().default(1),
  refractiveIndex2: z.number().default(1.5),
  thickness: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Refraction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.incidentAngle * input.refractiveIndex1 * input.refractiveIndex2 * input.thickness; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.incidentAngle * input.refractiveIndex1 * input.refractiveIndex2 * input.thickness; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRefraction_calculator(input: Refraction_calculatorInput): Refraction_calculatorOutput {
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


export interface Refraction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
