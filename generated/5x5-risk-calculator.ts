// Auto-generated from 5x5-risk-calculator-schema.json
import * as z from 'zod';

export interface _5x5_risk_calculatorInput {
  probability: number;
  impact: number;
  probabilityWeight: number;
  impactWeight: number;
}

export const _5x5_risk_calculatorInputSchema = z.object({
  probability: z.number().default(5),
  impact: z.number().default(5),
  probabilityWeight: z.number().default(1),
  impactWeight: z.number().default(1),
});

function evaluateAllFormulas(input: _5x5_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.probability * input.probabilityWeight; results["weightedProb"] = Number.isFinite(v) ? v : 0; } catch { results["weightedProb"] = 0; }
  try { const v = input.impact * input.impactWeight; results["weightedImpact"] = Number.isFinite(v) ? v : 0; } catch { results["weightedImpact"] = 0; }
  try { const v = (results["weightedProb"] ?? 0) * (results["weightedImpact"] ?? 0); results["riskScore"] = Number.isFinite(v) ? v : 0; } catch { results["riskScore"] = 0; }
  try { const v = (results["riskScore"] ?? 0) / 25 * 100; results["riskPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["riskPercentage"] = 0; }
  return results;
}


export function calculate_5x5_risk_calculator(input: _5x5_risk_calculatorInput): _5x5_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["riskScore"] ?? 0;
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


export interface _5x5_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
