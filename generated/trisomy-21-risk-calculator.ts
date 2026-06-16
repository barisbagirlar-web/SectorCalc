// Auto-generated from trisomy-21-risk-calculator-schema.json
import * as z from 'zod';

export interface Trisomy_21_risk_calculatorInput {
  maternalAge: number;
  gestationalAge: number;
  nuchalTranslucency: number;
  pappA: number;
  freeBetaHCG: number;
  previousTrisomy: number;
}

export const Trisomy_21_risk_calculatorInputSchema = z.object({
  maternalAge: z.number().default(30),
  gestationalAge: z.number().default(12),
  nuchalTranslucency: z.number().default(1.5),
  pappA: z.number().default(1),
  freeBetaHCG: z.number().default(1),
  previousTrisomy: z.number().default(0),
});

function evaluateAllFormulas(input: Trisomy_21_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.05 * Math.exp(0.25 * (input.maternalAge - 20)); results["baseRiskPercent"] = Number.isFinite(v) ? v : 0; } catch { results["baseRiskPercent"] = 0; }
  try { const v = (results["baseRiskPercent"] ?? 0) * (input.nuchalTranslucency / 1.0) * (1 / input.pappA) * input.freeBetaHCG * (1 + 2 * input.previousTrisomy); results["adjustedRiskPercent"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedRiskPercent"] = 0; }
  try { const v = Math.round(100 / (results["adjustedRiskPercent"] ?? 0)); results["oneInN"] = Number.isFinite(v) ? v : 0; } catch { results["oneInN"] = 0; }
  try { const v = (results["baseRiskPercent"] ?? 0).toFixed(2); results["ageRiskStr"] = Number.isFinite(v) ? v : 0; } catch { results["ageRiskStr"] = 0; }
  try { const v = (results["adjustedRiskPercent"] ?? 0).toFixed(2); results["adjRiskStr"] = Number.isFinite(v) ? v : 0; } catch { results["adjRiskStr"] = 0; }
  return results;
}


export function calculateTrisomy_21_risk_calculator(input: Trisomy_21_risk_calculatorInput): Trisomy_21_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["oneInN"] ?? 0;
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


export interface Trisomy_21_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
