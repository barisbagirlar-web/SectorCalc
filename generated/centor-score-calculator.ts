// Auto-generated from centor-score-calculator-schema.json
import * as z from 'zod';

export interface Centor_score_calculatorInput {
  fever: number;
  exudates: number;
  lymphadenopathy: number;
  cough_absence: number;
  dataConfidence?: number;
}

export const Centor_score_calculatorInputSchema = z.object({
  fever: z.number().default(0),
  exudates: z.number().default(0),
  lymphadenopathy: z.number().default(0),
  cough_absence: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Centor_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fever * input.exudates * input.lymphadenopathy * input.cough_absence; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.fever * input.exudates * input.lymphadenopathy * input.cough_absence; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCentor_score_calculator(input: Centor_score_calculatorInput): Centor_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Centor_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
