// Auto-generated from compression-spring-calculator-schema.json
import * as z from 'zod';

export interface Compression_spring_calculatorInput {
  d: number;
  D: number;
  n: number;
  G: number;
  F: number;
}

export const Compression_spring_calculatorInputSchema = z.object({
  d: z.number().default(2),
  D: z.number().default(20),
  n: z.number().default(10),
  G: z.number().default(80000),
  F: z.number().default(100),
});

function evaluateAllFormulas(input: Compression_spring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.D / input.d; results["C"] = Number.isFinite(v) ? v : 0; } catch { results["C"] = 0; }
  try { const v = (4 * (results["C"] ?? 0) - 1) / (4 * (results["C"] ?? 0) - 4) + 0.615 / (results["C"] ?? 0); results["K"] = Number.isFinite(v) ? v : 0; } catch { results["K"] = 0; }
  try { const v = (input.G * Math.pow(input.d, 4)) / (8 * Math.pow(input.D, 3) * input.n); results["k"] = Number.isFinite(v) ? v : 0; } catch { results["k"] = 0; }
  try { const v = (8 * input.F * input.D * (results["K"] ?? 0)) / (Math.PI * Math.pow(input.d, 3)); results["tau"] = Number.isFinite(v) ? v : 0; } catch { results["tau"] = 0; }
  try { const v = input.n * input.d; results["solid_height"] = Number.isFinite(v) ? v : 0; } catch { results["solid_height"] = 0; }
  try { const v = input.F / (results["k"] ?? 0); results["deflection_at_load"] = Number.isFinite(v) ? v : 0; } catch { results["deflection_at_load"] = 0; }
  return results;
}


export function calculateCompression_spring_calculator(input: Compression_spring_calculatorInput): Compression_spring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["k"] ?? 0;
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


export interface Compression_spring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
