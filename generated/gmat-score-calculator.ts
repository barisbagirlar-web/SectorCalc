// Auto-generated from gmat-score-calculator-schema.json
import * as z from 'zod';

export interface Gmat_score_calculatorInput {
  quantScaled: number;
  verbalScaled: number;
  integratedReasoning: number;
  analyticalWriting: number;
  dataConfidence?: number;
}

export const Gmat_score_calculatorInputSchema = z.object({
  quantScaled: z.number().default(40),
  verbalScaled: z.number().default(40),
  integratedReasoning: z.number().default(5),
  analyticalWriting: z.number().default(4.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gmat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantScaled; results["quantitativeScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["quantitativeScore"] = 0; }
  try { const v = input.verbalScaled; results["verbalScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["verbalScore"] = 0; }
  try { const v = 200 + (input.quantScaled + input.verbalScaled) * 5; results["totalScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  try { const v = input.integratedReasoning; results["irScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["irScore"] = 0; }
  try { const v = input.analyticalWriting; results["awaScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["awaScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGmat_score_calculator(input: Gmat_score_calculatorInput): Gmat_score_calculatorOutput {
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


export interface Gmat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
