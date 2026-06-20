// Auto-generated from harmonic-distortion-calculator-schema.json
import * as z from 'zod';

export interface Harmonic_distortion_calculatorInput {
  vFund: number;
  v2: number;
  v3: number;
  v4: number;
  v5: number;
  v6: number;
  v7: number;
  dataConfidence?: number;
}

export const Harmonic_distortion_calculatorInputSchema = z.object({
  vFund: z.number().default(230),
  v2: z.number().default(5),
  v3: z.number().default(3),
  v4: z.number().default(1),
  v5: z.number().default(0.5),
  v6: z.number().default(0.2),
  v7: z.number().default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Harmonic_distortion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vFund * input.v2 * input.v3 * input.v4; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.vFund * input.v2 * input.v3 * input.v4 * (input.v5 * input.v6 * input.v7); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.v5 * input.v6 * input.v7; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateHarmonic_distortion_calculator(input: Harmonic_distortion_calculatorInput): Harmonic_distortion_calculatorOutput {
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


export interface Harmonic_distortion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
