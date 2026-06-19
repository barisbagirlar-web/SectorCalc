// Auto-generated from apgar-score-calculator-schema.json
import * as z from 'zod';

export interface Apgar_score_calculatorInput {
  appearance: number;
  pulse: number;
  grimace: number;
  activity: number;
  respiration: number;
  dataConfidence?: number;
}

export const Apgar_score_calculatorInputSchema = z.object({
  appearance: z.number().default(0),
  pulse: z.number().default(0),
  grimace: z.number().default(0),
  activity: z.number().default(0),
  respiration: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Apgar_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.appearance * input.pulse * input.grimace * input.activity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.appearance * input.pulse * input.grimace * input.activity * (input.respiration); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.respiration; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateApgar_score_calculator(input: Apgar_score_calculatorInput): Apgar_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Apgar_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
