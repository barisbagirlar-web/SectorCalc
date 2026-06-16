// Auto-generated from arctangent-calculator-schema.json
import * as z from 'zod';

export interface Arctangent_calculatorInput {
  x: number;
  y: number;
  outputUnit: number;
  precision: number;
  scale: number;
  offset: number;
}

export const Arctangent_calculatorInputSchema = z.object({
  x: z.number().default(0),
  y: z.number().default(0),
  outputUnit: z.number().default(0),
  precision: z.number().default(2),
  scale: z.number().default(1),
  offset: z.number().default(0),
});

function evaluateAllFormulas(input: Arctangent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = parseFloat(((input.outputUnit === 1 ? ((input.y !== 0 ? Math.atan2(input.y * input.scale, input.x * input.scale) : Math.atan(input.x * input.scale)) * 180 / Math.PI) : (input.y !== 0 ? Math.atan2(input.y * input.scale, input.x * input.scale) : Math.atan(input.x * input.scale))) + input.offset).toFixed(input.precision)); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.y !== 0 ? Math.atan2(input.y * input.scale, input.x * input.scale) : Math.atan(input.x * input.scale); results["rawRad"] = Number.isFinite(v) ? v : 0; } catch { results["rawRad"] = 0; }
  try { const v = (input.outputUnit === 1 ? (input.y !== 0 ? Math.atan2(input.y * input.scale, input.x * input.scale) : Math.atan(input.x * input.scale)) * 180 / Math.PI : (input.y !== 0 ? Math.atan2(input.y * input.scale, input.x * input.scale) : Math.atan(input.x * input.scale))) + input.offset; results["finalBeforeRound"] = Number.isFinite(v) ? v : 0; } catch { results["finalBeforeRound"] = 0; }
  return results;
}


export function calculateArctangent_calculator(input: Arctangent_calculatorInput): Arctangent_calculatorOutput {
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


export interface Arctangent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
