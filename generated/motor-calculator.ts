// Auto-generated from motor-calculator-schema.json
import * as z from 'zod';

export interface Motor_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  efficiency: number;
  speed: number;
  numberOfPhases: number;
}

export const Motor_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  current: z.number().default(10),
  powerFactor: z.number().default(0.85),
  efficiency: z.number().default(90),
  speed: z.number().default(1450),
  numberOfPhases: z.number().default(3),
});

function evaluateAllFormulas(input: Motor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfPhases === 3 ? Math.sqrt(3) * input.voltage * input.current * input.powerFactor : input.voltage * input.current * input.powerFactor; results["electricalPower"] = Number.isFinite(v) ? v : 0; } catch { results["electricalPower"] = 0; }
  try { const v = (results["electricalPower"] ?? 0) * (input.efficiency / 100); results["mechanicalPower"] = Number.isFinite(v) ? v : 0; } catch { results["mechanicalPower"] = 0; }
  try { const v = ((results["mechanicalPower"] ?? 0) * 1000) / (2 * Math.PI * (input.speed / 60)); results["torque"] = Number.isFinite(v) ? v : 0; } catch { results["torque"] = 0; }
  return results;
}


export function calculateMotor_calculator(input: Motor_calculatorInput): Motor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mechanicalPower"] ?? 0;
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


export interface Motor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
