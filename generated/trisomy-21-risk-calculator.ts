// Auto-generated from trisomy-21-risk-calculator-schema.json
import * as z from 'zod';

export interface Trisomy_21_risk_calculatorInput {
  maternalAge: number;
  gestationalAge: number;
  nuchalTranslucency: number;
  pappA: number;
  freeBetaHCG: number;
  previousTrisomy: number;
  dataConfidence?: number;
}

export const Trisomy_21_risk_calculatorInputSchema = z.object({
  maternalAge: z.number().default(30),
  gestationalAge: z.number().default(12),
  nuchalTranslucency: z.number().default(1.5),
  pappA: z.number().default(1),
  freeBetaHCG: z.number().default(1),
  previousTrisomy: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Trisomy_21_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maternalAge * input.gestationalAge * input.nuchalTranslucency * input.pappA; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.maternalAge * input.gestationalAge * input.nuchalTranslucency * input.pappA * (input.freeBetaHCG * input.previousTrisomy); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.freeBetaHCG * input.previousTrisomy; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateTrisomy_21_risk_calculator(input: Trisomy_21_risk_calculatorInput): Trisomy_21_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Trisomy_21_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
