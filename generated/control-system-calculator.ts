// Auto-generated from control-system-calculator-schema.json
import * as z from 'zod';

export interface Control_system_calculatorInput {
  setpoint: number;
  processVariable: number;
  proportionalGain: number;
  integralTime: number;
  derivativeTime: number;
  sampleTime: number;
  previousError: number;
  integralSum: number;
}

export const Control_system_calculatorInputSchema = z.object({
  setpoint: z.number().default(100),
  processVariable: z.number().default(95),
  proportionalGain: z.number().default(2),
  integralTime: z.number().default(5),
  derivativeTime: z.number().default(0.5),
  sampleTime: z.number().default(0.1),
  previousError: z.number().default(0),
  integralSum: z.number().default(0),
});

function evaluateAllFormulas(input: Control_system_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.setpoint - input.processVariable; results["error"] = Number.isFinite(v) ? v : 0; } catch { results["error"] = 0; }
  try { const v = input.proportionalGain * (results["error"] ?? 0); results["proportionalOutput"] = Number.isFinite(v) ? v : 0; } catch { results["proportionalOutput"] = 0; }
  try { const v = input.proportionalGain * (input.sampleTime / input.integralTime) * ((results["error"] ?? 0) + input.previousError) / 2 + input.integralSum; results["integralOutput"] = Number.isFinite(v) ? v : 0; } catch { results["integralOutput"] = 0; }
  try { const v = input.proportionalGain * (input.derivativeTime / input.sampleTime) * ((results["error"] ?? 0) - input.previousError); results["derivativeOutput"] = Number.isFinite(v) ? v : 0; } catch { results["derivativeOutput"] = 0; }
  try { const v = (results["proportionalOutput"] ?? 0) + (results["integralOutput"] ?? 0) + (results["derivativeOutput"] ?? 0); results["controllerOutput"] = Number.isFinite(v) ? v : 0; } catch { results["controllerOutput"] = 0; }
  return results;
}


export function calculateControl_system_calculator(input: Control_system_calculatorInput): Control_system_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["controllerOutput"] ?? 0;
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


export interface Control_system_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
