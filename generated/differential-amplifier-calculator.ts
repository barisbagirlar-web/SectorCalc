// Auto-generated from differential-amplifier-calculator-schema.json
import * as z from 'zod';

export interface Differential_amplifier_calculatorInput {
  V1: number;
  V2: number;
  R1: number;
  R2: number;
  R3: number;
  R4: number;
}

export const Differential_amplifier_calculatorInputSchema = z.object({
  V1: z.number().default(1),
  V2: z.number().default(2),
  R1: z.number().default(10000),
  R2: z.number().default(10000),
  R3: z.number().default(10000),
  R4: z.number().default(10000),
});

function evaluateAllFormulas(input: Differential_amplifier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.V2 * (input.R4 / (input.R3 + input.R4)) * (1 + input.R2 / input.R1) - input.V1 * (input.R2 / input.R1); results["Vout"] = Number.isFinite(v) ? v : 0; } catch { results["Vout"] = 0; }
  try { const v = input.R2 / input.R1; results["gain_inv"] = Number.isFinite(v) ? v : 0; } catch { results["gain_inv"] = 0; }
  try { const v = (input.R4 / (input.R3 + input.R4)) * (1 + input.R2 / input.R1); results["gain_noninv"] = Number.isFinite(v) ? v : 0; } catch { results["gain_noninv"] = 0; }
  return results;
}


export function calculateDifferential_amplifier_calculator(input: Differential_amplifier_calculatorInput): Differential_amplifier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Vout"] ?? 0;
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


export interface Differential_amplifier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
