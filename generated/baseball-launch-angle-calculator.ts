// Auto-generated from baseball-launch-angle-calculator-schema.json
import * as z from 'zod';

export interface Baseball_launch_angle_calculatorInput {
  initialVelocity: number;
  launchAngle: number;
  initialHeight: number;
  gravity: number;
}

export const Baseball_launch_angle_calculatorInputSchema = z.object({
  initialVelocity: z.number().default(42),
  launchAngle: z.number().default(30),
  initialHeight: z.number().default(1),
  gravity: z.number().default(9.81),
});

function evaluateAllFormulas(input: Baseball_launch_angle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialVelocity * Math.cos(input.launchAngle * Math.PI / 180) * ((input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180) + Math.sqrt(Math.pow(input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180), 2) + 2 * input.gravity * input.initialHeight)) / input.gravity); results["range"] = Number.isFinite(v) ? v : 0; } catch { results["range"] = 0; }
  try { const v = (input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180) + Math.sqrt(Math.pow(input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180), 2) + 2 * input.gravity * input.initialHeight)) / input.gravity; results["hangTime"] = Number.isFinite(v) ? v : 0; } catch { results["hangTime"] = 0; }
  try { const v = input.initialHeight + Math.pow(input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180), 2) / (2 * input.gravity); results["maxHeight"] = Number.isFinite(v) ? v : 0; } catch { results["maxHeight"] = 0; }
  try { const v = Math.sqrt(Math.pow(input.initialVelocity * Math.cos(input.launchAngle * Math.PI / 180), 2) + Math.pow(Math.sqrt(Math.pow(input.initialVelocity * Math.sin(input.launchAngle * Math.PI / 180), 2) + 2 * input.gravity * input.initialHeight), 2)); results["finalVelocity"] = Number.isFinite(v) ? v : 0; } catch { results["finalVelocity"] = 0; }
  return results;
}


export function calculateBaseball_launch_angle_calculator(input: Baseball_launch_angle_calculatorInput): Baseball_launch_angle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["range"] ?? 0;
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


export interface Baseball_launch_angle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
