// Auto-generated from clinical-frailty-scale-calculator-schema.json
import * as z from 'zod';

export interface Clinical_frailty_scale_calculatorInput {
  age: number;
  comorbidities: number;
  adl: number;
}

export const Clinical_frailty_scale_calculatorInputSchema = z.object({
  age: z.number().default(75),
  comorbidities: z.number().default(2),
  adl: z.number().default(5),
});

function evaluateAllFormulas(input: Clinical_frailty_scale_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(9, Math.max(1, Math.round(1 + Math.max(0, input.age - 65)/10 * 0.5 + input.comorbidities * 0.3 + Math.max(0, 7 - input.adl) * 0.4))); results["cfs"] = Number.isFinite(v) ? v : 0; } catch { results["cfs"] = 0; }
  try { const v = 1 + Math.max(0, input.age - 65)/10 * 0.5 + input.comorbidities * 0.3 + Math.max(0, 7 - input.adl) * 0.4; results["rawScore"] = Number.isFinite(v) ? v : 0; } catch { results["rawScore"] = 0; }
  try { const v = Math.max(0, input.age - 65)/10 * 0.5; results["ageEffect"] = Number.isFinite(v) ? v : 0; } catch { results["ageEffect"] = 0; }
  try { const v = input.comorbidities * 0.3; results["comorbidityEffect"] = Number.isFinite(v) ? v : 0; } catch { results["comorbidityEffect"] = 0; }
  try { const v = Math.max(0, 7 - input.adl) * 0.4; results["adlEffect"] = Number.isFinite(v) ? v : 0; } catch { results["adlEffect"] = 0; }
  return results;
}


export function calculateClinical_frailty_scale_calculator(input: Clinical_frailty_scale_calculatorInput): Clinical_frailty_scale_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cfs"] ?? 0;
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


export interface Clinical_frailty_scale_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
