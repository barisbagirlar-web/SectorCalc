// Auto-generated from hat-size-calculator-schema.json
import * as z from 'zod';

export interface Hat_size_calculatorInput {
  headCircumference: number;
  unitSystem: number;
  hairThickness: number;
  fitPreference: number;
  dataConfidence?: number;
}

export const Hat_size_calculatorInputSchema = z.object({
  headCircumference: z.number().default(58),
  unitSystem: z.number().default(0),
  hairThickness: z.number().default(0.5),
  fitPreference: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hat_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.headCircumference * (input.unitSystem === 1 ? 2.54 : 1)) + input.hairThickness + (input.fitPreference === 0 ? -0.5 : input.fitPreference === 2 ? 0.5 : 0)) / 2.54 / Math.PI; results["usSize"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["usSize"] = 0; }
  try { const v = (input.headCircumference * (input.unitSystem === 1 ? 2.54 : 1)) + input.hairThickness + (input.fitPreference === 0 ? -0.5 : input.fitPreference === 2 ? 0.5 : 0); results["euSize"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["euSize"] = 0; }
  try { const v = ((input.headCircumference * (input.unitSystem === 1 ? 2.54 : 1)) + input.hairThickness + (input.fitPreference === 0 ? -0.5 : input.fitPreference === 2 ? 0.5 : 0)) / 2.54 / Math.PI - 0.125; results["ukSize"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ukSize"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHat_size_calculator(input: Hat_size_calculatorInput): Hat_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["usSize"]));
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


export interface Hat_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
