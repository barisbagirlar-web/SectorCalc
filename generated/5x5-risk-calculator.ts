// Auto-generated from 5x5-risk-calculator-schema.json
import * as z from 'zod';

export interface _5x5_risk_calculatorInput {
  probability: number;
  impact: number;
  probabilityWeight: number;
  impactWeight: number;
  dataConfidence?: number;
}

export const _5x5_risk_calculatorInputSchema = z.object({
  probability: z.number().default(5),
  impact: z.number().default(5),
  probabilityWeight: z.number().default(1),
  impactWeight: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _5x5_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.probability * input.probabilityWeight; results["weightedProb"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightedProb"] = Number.NaN; }
  try { const v = input.impact * input.impactWeight; results["weightedImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightedImpact"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weightedProb"])) * (toNumericFormulaValue(results["weightedImpact"])); results["riskScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskScore"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["riskScore"])) / 25 * 100; results["riskPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskPercentage"] = Number.NaN; }
  return results;
}


export function calculate_5x5_risk_calculator(input: _5x5_risk_calculatorInput): _5x5_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["riskScore"]);
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


export interface _5x5_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
