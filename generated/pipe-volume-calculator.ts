// Auto-generated from pipe-volume-calculator-schema.json
import * as z from 'zod';

export interface Pipe_volume_calculatorInput {
  outerDiameter: number;
  wallThickness: number;
  length: number;
  quantity: number;
}

export const Pipe_volume_calculatorInputSchema = z.object({
  outerDiameter: z.number().default(100),
  wallThickness: z.number().default(5),
  length: z.number().default(1),
  quantity: z.number().default(1),
});

function evaluateAllFormulas(input: Pipe_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outerDiameter - 2 * input.wallThickness; results["innerDiameter"] = Number.isFinite(v) ? v : 0; } catch { results["innerDiameter"] = 0; }
  try { const v = Math.PI * ((results["innerDiameter"] ?? 0) / 2000) ** 2 * input.length; results["singleVolume"] = Number.isFinite(v) ? v : 0; } catch { results["singleVolume"] = 0; }
  try { const v = (results["singleVolume"] ?? 0) * input.quantity; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (results["totalVolume"] ?? 0) * 1000; results["totalVolumeLiters"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolumeLiters"] = 0; }
  return results;
}


export function calculatePipe_volume_calculator(input: Pipe_volume_calculatorInput): Pipe_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalVolume"] ?? 0;
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


export interface Pipe_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
