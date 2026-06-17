// @ts-nocheck
// Auto-generated from distance-modulus-calculator-schema.json
import * as z from 'zod';

export interface Distance_modulus_calculatorInput {
  apparentMagnitude: number;
  apparentMagnitudeError: number;
  absoluteMagnitude: number;
  absoluteMagnitudeError: number;
  extinction: number;
  extinctionError: number;
}

export const Distance_modulus_calculatorInputSchema = z.object({
  apparentMagnitude: z.number().default(0),
  apparentMagnitudeError: z.number().default(0.01),
  absoluteMagnitude: z.number().default(0),
  absoluteMagnitudeError: z.number().default(0.1),
  extinction: z.number().default(0),
  extinctionError: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Distance_modulus_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.apparentMagnitude - input.absoluteMagnitude - input.extinction; results["distanceModulus"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["distanceModulus"] = 0; }
  try { const v = input.apparentMagnitude - input.absoluteMagnitude - input.extinction; results["distanceModulus_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["distanceModulus_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDistance_modulus_calculator(input: Distance_modulus_calculatorInput): Distance_modulus_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["distanceModulus"]);
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


export interface Distance_modulus_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
