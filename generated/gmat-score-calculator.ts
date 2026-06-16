// Auto-generated from gmat-score-calculator-schema.json
import * as z from 'zod';

export interface Gmat_score_calculatorInput {
  quantScaled: number;
  verbalScaled: number;
  integratedReasoning: number;
  analyticalWriting: number;
}

export const Gmat_score_calculatorInputSchema = z.object({
  quantScaled: z.number().default(40),
  verbalScaled: z.number().default(40),
  integratedReasoning: z.number().default(5),
  analyticalWriting: z.number().default(4.5),
});

function evaluateAllFormulas(input: Gmat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quantScaled; results["quantitativeScore"] = Number.isFinite(v) ? v : 0; } catch { results["quantitativeScore"] = 0; }
  try { const v = input.verbalScaled; results["verbalScore"] = Number.isFinite(v) ? v : 0; } catch { results["verbalScore"] = 0; }
  try { const v = 200 + (input.quantScaled + input.verbalScaled) * 5; results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  try { const v = input.integratedReasoning; results["irScore"] = Number.isFinite(v) ? v : 0; } catch { results["irScore"] = 0; }
  try { const v = input.analyticalWriting; results["awaScore"] = Number.isFinite(v) ? v : 0; } catch { results["awaScore"] = 0; }
  return results;
}


export function calculateGmat_score_calculator(input: Gmat_score_calculatorInput): Gmat_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalScore"] ?? 0;
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


export interface Gmat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
