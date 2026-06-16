// Auto-generated from motor-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Motor_efficiency_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  phases: number;
  torque: number;
  speed: number;
}

export const Motor_efficiency_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  current: z.number().default(10),
  powerFactor: z.number().default(0.85),
  phases: z.number().default(3),
  torque: z.number().default(50),
  speed: z.number().default(1450),
});

function evaluateAllFormulas(input: Motor_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltage * input.current * input.powerFactor * (input.phases === 3 ? Math.sqrt(3) : 1) / 1000; results["inputPower"] = Number.isFinite(v) ? v : 0; } catch { results["inputPower"] = 0; }
  try { const v = input.torque * input.speed * Math.PI * 2 / 60000; results["outputPower"] = Number.isFinite(v) ? v : 0; } catch { results["outputPower"] = 0; }
  try { const v = (results["outputPower"] ?? 0) / (results["inputPower"] ?? 0) * 100; results["efficiency"] = Number.isFinite(v) ? v : 0; } catch { results["efficiency"] = 0; }
  try { const v = (results["inputPower"] ?? 0) - (results["outputPower"] ?? 0); results["losses"] = Number.isFinite(v) ? v : 0; } catch { results["losses"] = 0; }
  return results;
}


export function calculateMotor_efficiency_calculator(input: Motor_efficiency_calculatorInput): Motor_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["efficiency"] ?? 0;
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


export interface Motor_efficiency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
