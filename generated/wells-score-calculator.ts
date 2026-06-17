// @ts-nocheck
// Auto-generated from wells-score-calculator-schema.json
import * as z from 'zod';

export interface Wells_score_calculatorInput {
  activeCancer: number;
  paralysis: number;
  surgeryOrBedridden: number;
  tendernessAlongVeins: number;
  entireLegSwollen: number;
  calfSwellingOver3cm: number;
  pittingEdema: number;
  alternativeDiagnosis: number;
}

export const Wells_score_calculatorInputSchema = z.object({
  activeCancer: z.number().default(0),
  paralysis: z.number().default(0),
  surgeryOrBedridden: z.number().default(0),
  tendernessAlongVeins: z.number().default(0),
  entireLegSwollen: z.number().default(0),
  calfSwellingOver3cm: z.number().default(0),
  pittingEdema: z.number().default(0),
  alternativeDiagnosis: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wells_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.activeCancer + input.paralysis + input.surgeryOrBedridden + input.tendernessAlongVeins + input.entireLegSwollen + input.calfSwellingOver3cm + input.pittingEdema + input.alternativeDiagnosis; results["totalScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalScore"] = 0; }
  results["riskCategory"] = 0;
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWells_score_calculator(input: Wells_score_calculatorInput): Wells_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalScore"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Wells_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
