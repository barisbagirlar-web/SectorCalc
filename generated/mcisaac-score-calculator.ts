// Auto-generated from mcisaac-score-calculator-schema.json
import * as z from 'zod';

export interface Mcisaac_score_calculatorInput {
  age: number;
  exudate: number;
  tenderLymph: number;
  feverTemp: number;
  cough: number;
  dataConfidence?: number;
}

export const Mcisaac_score_calculatorInputSchema = z.object({
  age: z.number().default(30),
  exudate: z.number().default(0),
  tenderLymph: z.number().default(0),
  feverTemp: z.number().default(37),
  cough: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mcisaac_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (toNumericFormulaValue(results["agePoints"])) + (toNumericFormulaValue(results["exudatePoints"])) + (toNumericFormulaValue(results["tenderLymphPoints"])) + (toNumericFormulaValue(results["feverPoints"])) + (toNumericFormulaValue(results["coughPoints"])); results["score"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["score"] = Number.NaN; }
  try { const v = (input.age >= 3 && input.age <= 14) ? 1 : 0; results["agePoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["agePoints"] = Number.NaN; }
  try { const v = input.exudate; results["exudatePoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exudatePoints"] = Number.NaN; }
  try { const v = input.tenderLymph; results["tenderLymphPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tenderLymphPoints"] = Number.NaN; }
  try { const v = input.feverTemp > 38 ? 1 : 0; results["feverPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feverPoints"] = Number.NaN; }
  try { const v = input.cough ? 0 : 1; results["coughPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["coughPoints"] = Number.NaN; }
  return results;
}


export function calculateMcisaac_score_calculator(input: Mcisaac_score_calculatorInput): Mcisaac_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["score"]);
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


export interface Mcisaac_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
