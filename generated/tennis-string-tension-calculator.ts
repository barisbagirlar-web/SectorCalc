// Auto-generated from tennis-string-tension-calculator-schema.json
import * as z from 'zod';

export interface Tennis_string_tension_calculatorInput {
  tension: number;
  stringGauge: number;
  vibratingStringLength: number;
  stringMaterialDensity: number;
}

export const Tennis_string_tension_calculatorInputSchema = z.object({
  tension: z.number().default(55),
  stringGauge: z.number().default(1.25),
  vibratingStringLength: z.number().default(0.3),
  stringMaterialDensity: z.number().default(1100),
});

function evaluateAllFormulas(input: Tennis_string_tension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stringMaterialDensity * Math.PI * Math.pow(input.stringGauge / 2000, 2); results["linearDensity"] = Number.isFinite(v) ? v : 0; } catch { results["linearDensity"] = 0; }
  try { const v = input.tension * 4.44822; results["tensionNewtons"] = Number.isFinite(v) ? v : 0; } catch { results["tensionNewtons"] = 0; }
  try { const v = (1 / (2 * input.vibratingStringLength)) * Math.sqrt((results["tensionNewtons"] ?? 0) / (results["linearDensity"] ?? 0)); results["frequency"] = Number.isFinite(v) ? v : 0; } catch { results["frequency"] = 0; }
  return results;
}


export function calculateTennis_string_tension_calculator(input: Tennis_string_tension_calculatorInput): Tennis_string_tension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["frequency"] ?? 0;
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


export interface Tennis_string_tension_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
