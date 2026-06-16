// Auto-generated from propagation-constant-calculator-schema.json
import * as z from 'zod';

export interface Propagation_constant_calculatorInput {
  r: number;
  l: number;
  g: number;
  c: number;
  f: number;
}

export const Propagation_constant_calculatorInputSchema = z.object({
  r: z.number().default(0.1),
  l: z.number().default(2e-7),
  g: z.number().default(0),
  c: z.number().default(3e-11),
  f: z.number().default(1000000000),
});

function evaluateAllFormulas(input: Propagation_constant_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(magZY) * Math.cos(theta/2); results["alpha"] = Number.isFinite(v) ? v : 0; } catch { results["alpha"] = 0; }
  try { const v = Math.sqrt(magZY) * Math.sin(theta/2); results["beta"] = Number.isFinite(v) ? v : 0; } catch { results["beta"] = 0; }
  try { const v = Math.sqrt(Math.sqrt(A*A + B*B)); results["magnitude"] = Number.isFinite(v) ? v : 0; } catch { results["magnitude"] = 0; }
  try { const v = (results["alpha"] ?? 0) * 8.685889638065035; results["alpha_dB"] = Number.isFinite(v) ? v : 0; } catch { results["alpha_dB"] = 0; }
  return results;
}


export function calculatePropagation_constant_calculator(input: Propagation_constant_calculatorInput): Propagation_constant_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["alpha"] ?? 0;
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


export interface Propagation_constant_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
