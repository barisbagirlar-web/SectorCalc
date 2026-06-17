// @ts-nocheck
// Auto-generated from barbell-row-calculator-schema.json
import * as z from 'zod';

export interface Barbell_row_calculatorInput {
  barbellDiameter: number;
  barbellLength: number;
  loadWeight: number;
  yieldStrength: number;
  safetyFactor: number;
}

export const Barbell_row_calculatorInputSchema = z.object({
  barbellDiameter: z.number().default(28),
  barbellLength: z.number().default(2200),
  loadWeight: z.number().default(100),
  yieldStrength: z.number().default(250),
  safetyFactor: z.number().default(3),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Barbell_row_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.loadWeight * 9.81 * input.barbellLength) / 4; results["bendingMoment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bendingMoment"] = 0; }
  try { const v = input.yieldStrength / input.safetyFactor; results["allowableStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["allowableStress"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBarbell_row_calculator(input: Barbell_row_calculatorInput): Barbell_row_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["allowableStress"]);
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


export interface Barbell_row_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
