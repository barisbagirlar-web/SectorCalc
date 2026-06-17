// Auto-generated from kp-calculator-schema.json
import * as z from 'zod';

export interface Kp_calculatorInput {
  processGain: number;
  timeConstant: number;
  deadTime: number;
  safetyFactor: number;
  controllerType: number;
}

export const Kp_calculatorInputSchema = z.object({
  processGain: z.number().default(1),
  timeConstant: z.number().default(10),
  deadTime: z.number().default(1),
  safetyFactor: z.number().default(1),
  controllerType: z.number().default(2),
});

function evaluateAllFormulas(input: Kp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (results["Kp_raw"] ?? 0) * input.safetyFactor; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = (input.controllerType === 1 ? (input.timeConstant / (input.processGain * input.deadTime)) : (input.controllerType === 2 ? (0.9 * input.timeConstant / (input.processGain * input.deadTime)) : (1.2 * input.timeConstant / (input.processGain * input.deadTime)))); results["Kp_raw"] = Number.isFinite(v) ? v : 0; } catch { results["Kp_raw"] = 0; }
  try { const v = (input.controllerType === 1 ? 0 : (input.controllerType === 2 ? (0.3 * input.timeConstant / (input.processGain * Math.pow(input.deadTime, 2))) : (0.6 * input.timeConstant / (input.processGain * Math.pow(input.deadTime, 2))))); results["Ki"] = Number.isFinite(v) ? v : 0; } catch { results["Ki"] = 0; }
  try { const v = (input.controllerType === 3 ? (0.6 * input.timeConstant / input.processGain) : 0); results["Kd"] = Number.isFinite(v) ? v : 0; } catch { results["Kd"] = 0; }
  return results;
}


export function calculateKp_calculator(input: Kp_calculatorInput): Kp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Kp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
