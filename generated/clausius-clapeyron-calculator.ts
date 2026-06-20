// Auto-generated from clausius-clapeyron-calculator-schema.json
import * as z from 'zod';

export interface Clausius_clapeyron_calculatorInput {
  T1_C: number;
  P1_kPa: number;
  T2_C: number;
  P2_kPa: number;
  R_JmolK: number;
  M_gmol: number;
  dataConfidence?: number;
}

export const Clausius_clapeyron_calculatorInputSchema = z.object({
  T1_C: z.number().default(100),
  P1_kPa: z.number().default(101.325),
  T2_C: z.number().default(120),
  P2_kPa: z.number().default(198.5),
  R_JmolK: z.number().default(8.314),
  M_gmol: z.number().default(18.015),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Clausius_clapeyron_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.T1_C * input.P1_kPa * input.T2_C * input.P2_kPa; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.T1_C * input.P1_kPa * input.T2_C * input.P2_kPa * (input.R_JmolK * input.M_gmol); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.R_JmolK * input.M_gmol; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateClausius_clapeyron_calculator(input: Clausius_clapeyron_calculatorInput): Clausius_clapeyron_calculatorOutput {
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


export interface Clausius_clapeyron_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
