// Auto-generated from first-trimester-screening-calculator-schema.json
import * as z from 'zod';

export interface First_trimester_screening_calculatorInput {
  maternalAge: number;
  nuchalTranslucency: number;
  crownRumpLength: number;
  pappA: number;
  freeBetaHCG: number;
}

export const First_trimester_screening_calculatorInputSchema = z.object({
  maternalAge: z.number().default(30),
  nuchalTranslucency: z.number().default(1.5),
  crownRumpLength: z.number().default(65),
  pappA: z.number().default(1),
  freeBetaHCG: z.number().default(1),
});

function evaluateAllFormulas(input: First_trimester_screening_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(10, -0.3599 + 0.0127 * input.crownRumpLength - 0.000058 * input.crownRumpLength * input.crownRumpLength); results["expectedNT"] = Number.isFinite(v) ? v : 0; } catch { results["expectedNT"] = 0; }
  try { const v = input.nuchalTranslucency / (results["expectedNT"] ?? 0); results["ntMoM"] = Number.isFinite(v) ? v : 0; } catch { results["ntMoM"] = 0; }
  try { const v = -5.0 + 0.15 * input.maternalAge + 3.0 * (results["ntMoM"] ?? 0) - 2.0 * input.pappA + 1.5 * input.freeBetaHCG; results["logit"] = Number.isFinite(v) ? v : 0; } catch { results["logit"] = 0; }
  try { const v = 1 / (1 + Math.exp(-(results["logit"] ?? 0))); results["riskProbability"] = Number.isFinite(v) ? v : 0; } catch { results["riskProbability"] = 0; }
  try { const v = (results["riskProbability"] ?? 0) * 100; results["riskPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["riskPercentage"] = 0; }
  return results;
}


export function calculateFirst_trimester_screening_calculator(input: First_trimester_screening_calculatorInput): First_trimester_screening_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["riskPercentage"] ?? 0;
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


export interface First_trimester_screening_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
