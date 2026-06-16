// Auto-generated from mcat-score-calculator-schema.json
import * as z from 'zod';

export interface Mcat_score_calculatorInput {
  raw_cpbs: number;
  raw_cars: number;
  raw_bbls: number;
  raw_psbb: number;
}

export const Mcat_score_calculatorInputSchema = z.object({
  raw_cpbs: z.number().default(30),
  raw_cars: z.number().default(27),
  raw_bbls: z.number().default(30),
  raw_psbb: z.number().default(30),
});

function evaluateAllFormulas(input: Mcat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(132, Math.max(118, Math.round(118 + (input.raw_cpbs / 59) * 14))); results["scaledCPBS"] = Number.isFinite(v) ? v : 0; } catch { results["scaledCPBS"] = 0; }
  try { const v = Math.min(132, Math.max(118, Math.round(118 + (input.raw_cars / 53) * 14))); results["scaledCARS"] = Number.isFinite(v) ? v : 0; } catch { results["scaledCARS"] = 0; }
  try { const v = Math.min(132, Math.max(118, Math.round(118 + (input.raw_bbls / 59) * 14))); results["scaledBBLS"] = Number.isFinite(v) ? v : 0; } catch { results["scaledBBLS"] = 0; }
  try { const v = Math.min(132, Math.max(118, Math.round(118 + (input.raw_psbb / 59) * 14))); results["scaledPSBB"] = Number.isFinite(v) ? v : 0; } catch { results["scaledPSBB"] = 0; }
  try { const v = (results["scaledCPBS"] ?? 0) + (results["scaledCARS"] ?? 0) + (results["scaledBBLS"] ?? 0) + (results["scaledPSBB"] ?? 0); results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  return results;
}


export function calculateMcat_score_calculator(input: Mcat_score_calculatorInput): Mcat_score_calculatorOutput {
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


export interface Mcat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
