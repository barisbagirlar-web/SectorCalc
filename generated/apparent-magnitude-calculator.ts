// Auto-generated from apparent-magnitude-calculator-schema.json
import * as z from 'zod';

export interface Apparent_magnitude_calculatorInput {
  objectFlux: number;
  referenceFlux: number;
  magnitudeZeroPoint: number;
  extinction: number;
  dataConfidence?: number;
}

export const Apparent_magnitude_calculatorInputSchema = z.object({
  objectFlux: z.number().default(1e-10),
  referenceFlux: z.number().default(1e-8),
  magnitudeZeroPoint: z.number().default(0),
  extinction: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Apparent_magnitude_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.objectFlux / input.referenceFlux; results["fluxRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fluxRatio"] = 0; }
  try { const v = input.objectFlux / input.referenceFlux; results["fluxRatio_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fluxRatio_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateApparent_magnitude_calculator(input: Apparent_magnitude_calculatorInput): Apparent_magnitude_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["fluxRatio_aux"]));
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


export interface Apparent_magnitude_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
