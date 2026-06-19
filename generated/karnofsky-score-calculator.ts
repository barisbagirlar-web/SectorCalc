// Auto-generated from karnofsky-score-calculator-schema.json
import * as z from 'zod';

export interface Karnofsky_score_calculatorInput {
  functionalCapacity: number;
  selfCare: number;
  diseaseSymptoms: number;
  nutritionalStatus: number;
  mentalStatus: number;
  dataConfidence?: number;
}

export const Karnofsky_score_calculatorInputSchema = z.object({
  functionalCapacity: z.number().default(5),
  selfCare: z.number().default(5),
  diseaseSymptoms: z.number().default(5),
  nutritionalStatus: z.number().default(5),
  mentalStatus: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Karnofsky_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.functionalCapacity + input.selfCare + input.diseaseSymptoms + input.nutritionalStatus + input.mentalStatus; results["rawScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawScore"] = 0; }
  try { const v = (input.functionalCapacity + input.selfCare + input.diseaseSymptoms + input.nutritionalStatus + input.mentalStatus) * 2; results["adjustedScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKarnofsky_score_calculator(input: Karnofsky_score_calculatorInput): Karnofsky_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["adjustedScore"]));
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


export interface Karnofsky_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
