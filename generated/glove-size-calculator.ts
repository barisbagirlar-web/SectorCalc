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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Glove_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.handCircumferenceCm / 2.54; results["circumferenceInch"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["circumferenceInch"] = 0; }
  try { const v = input.handLengthCm / 2.54; results["lengthInch"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lengthInch"] = 0; }
  try { const v = ((asFormulaNumber(results["circumferenceInch"])) + (asFormulaNumber(results["lengthInch"]))) / 2; results["averageInch"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageInch"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGlove_size_calculator(input: Glove_size_calculatorInput): Glove_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["circumferenceInch"]));
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


export interface Glove_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
