// Auto-generated from tennis-string-tension-calculator-schema.json
import * as z from 'zod';

export interface Tennis_string_tension_calculatorInput {
  tension: number;
  stringGauge: number;
  vibratingStringLength: number;
  stringMaterialDensity: number;
  dataConfidence?: number;
}

export const Tennis_string_tension_calculatorInputSchema = z.object({
  tension: z.number().default(55),
  stringGauge: z.number().default(1.25),
  vibratingStringLength: z.number().default(0.3),
  stringMaterialDensity: z.number().default(1100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tennis_string_tension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tension * 4.44822; results["tensionNewtons"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tensionNewtons"] = 0; }
  try { const v = input.tension * 4.44822; results["tensionNewtons_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tensionNewtons_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTennis_string_tension_calculator(input: Tennis_string_tension_calculatorInput): Tennis_string_tension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tensionNewtons_aux"]);
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


export interface Tennis_string_tension_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
