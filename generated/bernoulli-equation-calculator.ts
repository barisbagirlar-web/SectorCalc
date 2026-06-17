// Auto-generated from bernoulli-equation-calculator-schema.json
import * as z from 'zod';

export interface Bernoulli_equation_calculatorInput {
  density: number;
  g: number;
  P1: number;
  v1: number;
  z1: number;
  P2: number;
  z2: number;
  head_loss: number;
}

export const Bernoulli_equation_calculatorInputSchema = z.object({
  density: z.number().default(1000),
  g: z.number().default(9.81),
  P1: z.number().default(101325),
  v1: z.number().default(1),
  z1: z.number().default(0),
  P2: z.number().default(101325),
  z2: z.number().default(0),
  head_loss: z.number().default(0),
});

function evaluateAllFormulas(input: Bernoulli_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(2 * ((input.P1 - input.P2) / input.density + input.g * (input.z1 - input.z2) + input.v1 * input.v1 / 2 - input.g * input.head_loss)); results["v2"] = Number.isFinite(v) ? v : 0; } catch { results["v2"] = 0; }
  results["_P____P________g_____value__m"] = 0;
  results["z____z_____value__m"] = 0;
  results["v____2g_____value__m"] = 0;
  results["_h____P__P_____g_____z__z_____v____2g___"] = 0;
  results["v______2g__h_____value__m_s"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateBernoulli_equation_calculator(input: Bernoulli_equation_calculatorInput): Bernoulli_equation_calculatorOutput {
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


export interface Bernoulli_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
