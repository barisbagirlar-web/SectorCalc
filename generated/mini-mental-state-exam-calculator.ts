// Auto-generated from mini-mental-state-exam-calculator-schema.json
import * as z from 'zod';

export interface Mini_mental_state_exam_calculatorInput {
  orientation: number;
  registration: number;
  attention: number;
  recall: number;
  language: number;
  dataConfidence?: number;
}

export const Mini_mental_state_exam_calculatorInputSchema = z.object({
  orientation: z.number().default(0),
  registration: z.number().default(0),
  attention: z.number().default(0),
  recall: z.number().default(0),
  language: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mini_mental_state_exam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.orientation + input.registration + input.attention + input.recall + input.language; results["totalScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalScore"] = Number.NaN; }
  try { const v = input.orientation; results["orientation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["orientation"] = Number.NaN; }
  try { const v = input.registration; results["registration"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["registration"] = Number.NaN; }
  try { const v = input.attention; results["attention"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["attention"] = Number.NaN; }
  try { const v = input.recall; results["recall"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recall"] = Number.NaN; }
  try { const v = input.language; results["language"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["language"] = Number.NaN; }
  return results;
}


export function calculateMini_mental_state_exam_calculator(input: Mini_mental_state_exam_calculatorInput): Mini_mental_state_exam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalScore"]);
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


export interface Mini_mental_state_exam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
