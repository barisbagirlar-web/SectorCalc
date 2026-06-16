// Auto-generated from pendulum-calculator-schema.json
import * as z from 'zod';

export interface Pendulum_calculatorInput {
  length: number;
  gravity: number;
  initialAngle: number;
  numberOfOscillations: number;
}

export const Pendulum_calculatorInputSchema = z.object({
  length: z.number().default(1),
  gravity: z.number().default(9.81),
  initialAngle: z.number().default(5),
  numberOfOscillations: z.number().default(1),
});

function evaluateAllFormulas(input: Pendulum_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * Math.PI * Math.sqrt(input.length / input.gravity); results["period"] = Number.isFinite(v) ? v : 0; } catch { results["period"] = 0; }
  try { const v = 1 / (2 * Math.PI * Math.sqrt(input.length / input.gravity)); results["frequency"] = Number.isFinite(v) ? v : 0; } catch { results["frequency"] = 0; }
  try { const v = Math.sqrt(input.gravity / input.length); results["angularFrequency"] = Number.isFinite(v) ? v : 0; } catch { results["angularFrequency"] = 0; }
  try { const v = Math.sqrt(2 * input.gravity * input.length * (1 - Math.cos(input.initialAngle * Math.PI / 180))); results["maxSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["maxSpeed"] = 0; }
  try { const v = (2 * Math.PI * Math.sqrt(input.length / input.gravity)) * input.numberOfOscillations; results["totalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  try { const v = input.length * (1 - Math.cos(input.initialAngle * Math.PI / 180)); results["maxHeight"] = Number.isFinite(v) ? v : 0; } catch { results["maxHeight"] = 0; }
  return results;
}


export function calculatePendulum_calculator(input: Pendulum_calculatorInput): Pendulum_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["period"] ?? 0;
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


export interface Pendulum_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
