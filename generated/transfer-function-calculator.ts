// Auto-generated from transfer-function-calculator-schema.json
import * as z from 'zod';

export interface Transfer_function_calculatorInput {
  gain: number;
  zeta: number;
  omega_n: number;
  step_amplitude: number;
  tau: number;
}

export const Transfer_function_calculatorInputSchema = z.object({
  gain: z.number().default(1),
  zeta: z.number().default(0.5),
  omega_n: z.number().default(1),
  step_amplitude: z.number().default(1),
  tau: z.number().default(0),
});

function evaluateAllFormulas(input: Transfer_function_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 100 * Math.exp(-(input.zeta * Math.PI) / Math.sqrt(1 - Math.pow(input.zeta, 2))); results["percentOvershoot"] = Number.isFinite(v) ? v : 0; } catch { results["percentOvershoot"] = 0; }
  try { const v = Math.PI / (input.omega_n * Math.sqrt(1 - Math.pow(input.zeta, 2))) + input.tau; results["peakTime"] = Number.isFinite(v) ? v : 0; } catch { results["peakTime"] = 0; }
  try { const v = 4 / (input.zeta * input.omega_n) + input.tau; results["settlingTime"] = Number.isFinite(v) ? v : 0; } catch { results["settlingTime"] = 0; }
  try { const v = (Math.PI - Math.acos(input.zeta)) / (input.omega_n * Math.sqrt(1 - Math.pow(input.zeta, 2))) + input.tau; results["riseTime"] = Number.isFinite(v) ? v : 0; } catch { results["riseTime"] = 0; }
  try { const v = input.gain * input.step_amplitude; results["steadyStateOutput"] = Number.isFinite(v) ? v : 0; } catch { results["steadyStateOutput"] = 0; }
  return results;
}


export function calculateTransfer_function_calculator(input: Transfer_function_calculatorInput): Transfer_function_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["percentOvershoot"] ?? 0;
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


export interface Transfer_function_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
