// Auto-generated from pipe-size-calculator-schema.json
import * as z from 'zod';

export interface Pipe_size_calculatorInput {
  flowRate: number;
  velocity: number;
  pressure: number;
  allowableStress: number;
  jointEfficiency: number;
  corrosionAllowance: number;
}

export const Pipe_size_calculatorInputSchema = z.object({
  flowRate: z.number().default(100),
  velocity: z.number().default(2),
  pressure: z.number().default(10),
  allowableStress: z.number().default(137.9),
  jointEfficiency: z.number().default(1),
  corrosionAllowance: z.number().default(1.5),
});

function evaluateAllFormulas(input: Pipe_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(4 * (input.flowRate / 3600) / (input.velocity * Math.PI)) * 1000; results["d_mm"] = Number.isFinite(v) ? v : 0; } catch { results["d_mm"] = 0; }
  try { const v = (input.pressure * 0.1 * (results["d_mm"] ?? 0)) / (2 * input.allowableStress * input.jointEfficiency) + input.corrosionAllowance; results["t_mm"] = Number.isFinite(v) ? v : 0; } catch { results["t_mm"] = 0; }
  try { const v = (results["d_mm"] ?? 0) + 2 * (results["t_mm"] ?? 0); results["od_mm"] = Number.isFinite(v) ? v : 0; } catch { results["od_mm"] = 0; }
  try { const v = Math.PI * Math.pow((results["d_mm"] ?? 0), 2) / 4; results["area_mm2"] = Number.isFinite(v) ? v : 0; } catch { results["area_mm2"] = 0; }
  return results;
}


export function calculatePipe_size_calculator(input: Pipe_size_calculatorInput): Pipe_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["d_mm"] ?? 0;
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


export interface Pipe_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
