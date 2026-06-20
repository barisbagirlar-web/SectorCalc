// Auto-generated from glove-size-calculator-schema.json
import * as z from 'zod';

export interface Glove_size_calculatorInput {
  handCircumferenceCm: number;
  handLengthCm: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Glove_size_calculatorInputSchema = z.object({
  handCircumferenceCm: z.number().default(20),
  handLengthCm: z.number().default(18.5),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Glove_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.handCircumferenceCm / 2.54; results["circumferenceInch"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["circumferenceInch"] = Number.NaN; }
  try { const v = input.handLengthCm / 2.54; results["lengthInch"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lengthInch"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["circumferenceInch"])) + (toNumericFormulaValue(results["lengthInch"]))) / 2; results["averageInch"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageInch"] = Number.NaN; }
  return results;
}


export function calculateGlove_size_calculator(input: Glove_size_calculatorInput): Glove_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["circumferenceInch"]);
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


export interface Glove_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
