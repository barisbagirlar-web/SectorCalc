// Auto-generated from mcat-score-calculator-schema.json
import * as z from 'zod';

export interface Mcat_score_calculatorInput {
  raw_cpbs: number;
  raw_cars: number;
  raw_bbls: number;
  raw_psbb: number;
  dataConfidence?: number;
}

export const Mcat_score_calculatorInputSchema = z.object({
  raw_cpbs: z.number().default(30),
  raw_cars: z.number().default(27),
  raw_bbls: z.number().default(30),
  raw_psbb: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mcat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.raw_cpbs * input.raw_cars * input.raw_bbls * input.raw_psbb; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.raw_cpbs * input.raw_cars * input.raw_bbls * input.raw_psbb; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMcat_score_calculator(input: Mcat_score_calculatorInput): Mcat_score_calculatorOutput {
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


export interface Mcat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
