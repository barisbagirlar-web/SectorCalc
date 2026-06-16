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

function evaluateAllFormulas(input: Harmonic_distortion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(input.v2**2 + input.v3**2 + input.v4**2 + input.v5**2 + input.v6**2 + input.v7**2); results["harmonicRmsSum"] = Number.isFinite(v) ? v : 0; } catch { results["harmonicRmsSum"] = 0; }
  try { const v = ((results["harmonicRmsSum"] ?? 0) / input.vFund) * 100; results["thdPercent"] = Number.isFinite(v) ? v : 0; } catch { results["thdPercent"] = 0; }
  return results;
}


export function calculateHarmonic_distortion_calculator(input: Harmonic_distortion_calculatorInput): Harmonic_distortion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["thdPercent"] ?? 0;
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


export interface Harmonic_distortion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
