// Auto-generated from pipe-weight-calculator-schema.json
import * as z from 'zod';

export interface Pipe_weight_calculatorInput {
  outerDiameter: number;
  wallThickness: number;
  length: number;
  density: number;
  quantity: number;
}

export const Pipe_weight_calculatorInputSchema = z.object({
  outerDiameter: z.number().default(219.1),
  wallThickness: z.number().default(8.18),
  length: z.number().default(6),
  density: z.number().default(7850),
  quantity: z.number().default(1),
});

function evaluateAllFormulas(input: Pipe_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * input.wallThickness * (input.outerDiameter - input.wallThickness); results["crossSectionalArea"] = Number.isFinite(v) ? v : 0; } catch { results["crossSectionalArea"] = 0; }
  try { const v = Math.PI * input.wallThickness * (input.outerDiameter - input.wallThickness) * input.density / 1e6; results["linearMass"] = Number.isFinite(v) ? v : 0; } catch { results["linearMass"] = 0; }
  try { const v = Math.PI * input.wallThickness * (input.outerDiameter - input.wallThickness) * input.density * input.length * input.quantity / 1e6; results["weight"] = Number.isFinite(v) ? v : 0; } catch { results["weight"] = 0; }
  return results;
}


export function calculatePipe_weight_calculator(input: Pipe_weight_calculatorInput): Pipe_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weight"] ?? 0;
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


export interface Pipe_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
