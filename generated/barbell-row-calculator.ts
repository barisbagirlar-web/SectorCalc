// Auto-generated from barbell-row-calculator-schema.json
import * as z from 'zod';

export interface Barbell_row_calculatorInput {
  barbellDiameter: number;
  barbellLength: number;
  loadWeight: number;
  yieldStrength: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Barbell_row_calculatorInputSchema = z.object({
  barbellDiameter: z.number().default(28),
  barbellLength: z.number().default(2200),
  loadWeight: z.number().default(100),
  yieldStrength: z.number().default(250),
  safetyFactor: z.number().default(3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Barbell_row_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.loadWeight * 9.81 * input.barbellLength) / 4; results["bendingMoment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingMoment"] = Number.NaN; }
  try { const v = input.yieldStrength / input.safetyFactor; results["allowableStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowableStress"] = Number.NaN; }
  return results;
}


export function calculateBarbell_row_calculator(input: Barbell_row_calculatorInput): Barbell_row_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["allowableStress"]);
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


export interface Barbell_row_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
