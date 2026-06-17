// Auto-generated from down-syndrome-risk-calculator-schema.json
import * as z from 'zod';

export interface Down_syndrome_risk_calculatorInput {
  maternalAge: number;
  nt: number;
  pappa: number;
  hcg: number;
}

export const Down_syndrome_risk_calculatorInputSchema = z.object({
  maternalAge: z.number().default(30),
  nt: z.number().default(1.5),
  pappa: z.number().default(1),
  hcg: z.number().default(1),
});

function evaluateAllFormulas(input: Down_syndrome_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / (1 + Math.exp(-(-16.2395 + 0.286 * input.maternalAge))); results["ageRisk"] = Number.isFinite(v) ? v : 0; } catch { results["ageRisk"] = 0; }
  try { const v = Math.exp(0.2 * input.nt); results["lrNT"] = Number.isFinite(v) ? v : 0; } catch { results["lrNT"] = 0; }
  try { const v = Math.exp(-0.7 * (input.pappa - 1)); results["lrPAPPA"] = Number.isFinite(v) ? v : 0; } catch { results["lrPAPPA"] = 0; }
  try { const v = Math.exp(0.5 * (input.hcg - 1)); results["lrHCG"] = Number.isFinite(v) ? v : 0; } catch { results["lrHCG"] = 0; }
  try { const v = (results["ageRisk"] ?? 0) * (results["lrNT"] ?? 0) * (results["lrPAPPA"] ?? 0) * (results["lrHCG"] ?? 0); results["combinedRisk"] = Number.isFinite(v) ? v : 0; } catch { results["combinedRisk"] = 0; }
  try { const v = 1 / (results["combinedRisk"] ?? 0); results["riskOneIn"] = Number.isFinite(v) ? v : 0; } catch { results["riskOneIn"] = 0; }
  results["1_in___Math_round_1_ageRisk__"] = 0;
  results["1_in___Math_round_1__ageRisk___lrNT___"] = 0;
  results["1_in___Math_round_1_combinedRisk__"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateDown_syndrome_risk_calculator(input: Down_syndrome_risk_calculatorInput): Down_syndrome_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Down_syndrome_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
