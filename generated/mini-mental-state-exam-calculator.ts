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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mini_mental_state_exam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.orientation + input.registration + input.attention + input.recall + input.language; results["totalScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  try { const v = input.orientation; results["orientation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["orientation"] = 0; }
  try { const v = input.registration; results["registration"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["registration"] = 0; }
  try { const v = input.attention; results["attention"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["attention"] = 0; }
  try { const v = input.recall; results["recall"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recall"] = 0; }
  try { const v = input.language; results["language"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["language"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMini_mental_state_exam_calculator(input: Mini_mental_state_exam_calculatorInput): Mini_mental_state_exam_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalScore"]));
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


export interface Mini_mental_state_exam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
