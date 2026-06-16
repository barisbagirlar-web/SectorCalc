// Auto-generated from hat-size-calculator-schema.json
import * as z from 'zod';

export interface Hat_size_calculatorInput {
  headCircumference: number;
  unitSystem: number;
  hairThickness: number;
  fitPreference: number;
}

export const Hat_size_calculatorInputSchema = z.object({
  headCircumference: z.number().default(58),
  unitSystem: z.number().default(0),
  hairThickness: z.number().default(0.5),
  fitPreference: z.number().default(1),
});

function evaluateAllFormulas(input: Hat_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.headCircumference * (input.unitSystem === 1 ? 2.54 : 1)) + input.hairThickness + (input.fitPreference === 0 ? -0.5 : input.fitPreference === 2 ? 0.5 : 0)) / 2.54 / Math.PI; results["usSize"] = Number.isFinite(v) ? v : 0; } catch { results["usSize"] = 0; }
  try { const v = (input.headCircumference * (input.unitSystem === 1 ? 2.54 : 1)) + input.hairThickness + (input.fitPreference === 0 ? -0.5 : input.fitPreference === 2 ? 0.5 : 0); results["euSize"] = Number.isFinite(v) ? v : 0; } catch { results["euSize"] = 0; }
  try { const v = ((input.headCircumference * (input.unitSystem === 1 ? 2.54 : 1)) + input.hairThickness + (input.fitPreference === 0 ? -0.5 : input.fitPreference === 2 ? 0.5 : 0)) / 2.54 / Math.PI - 0.125; results["ukSize"] = Number.isFinite(v) ? v : 0; } catch { results["ukSize"] = 0; }
  return results;
}


export function calculateHat_size_calculator(input: Hat_size_calculatorInput): Hat_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["usSize"] ?? 0;
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


export interface Hat_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
