// Auto-generated from pump-power-calculator-schema.json
import * as z from 'zod';

export interface Pump_power_calculatorInput {
  flowRate: number;
  head: number;
  density: number;
  pumpEfficiency: number;
  motorEfficiency: number;
  safetyFactor: number;
}

export const Pump_power_calculatorInputSchema = z.object({
  flowRate: z.number().default(0.01),
  head: z.number().default(10),
  density: z.number().default(1000),
  pumpEfficiency: z.number().default(0.7),
  motorEfficiency: z.number().default(0.95),
  safetyFactor: z.number().default(1.1),
});

function evaluateAllFormulas(input: Pump_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.density * 9.81 * input.flowRate * input.head; results["hydraulicPower"] = Number.isFinite(v) ? v : 0; } catch { results["hydraulicPower"] = 0; }
  try { const v = input.density * 9.81 * input.flowRate * input.head / input.pumpEfficiency; results["shaftPower"] = Number.isFinite(v) ? v : 0; } catch { results["shaftPower"] = 0; }
  try { const v = (input.density * 9.81 * input.flowRate * input.head) / (input.pumpEfficiency * input.motorEfficiency); results["motorInputPower"] = Number.isFinite(v) ? v : 0; } catch { results["motorInputPower"] = 0; }
  try { const v = (input.density * 9.81 * input.flowRate * input.head * input.safetyFactor) / (input.pumpEfficiency * input.motorEfficiency); results["totalRequiredPower"] = Number.isFinite(v) ? v : 0; } catch { results["totalRequiredPower"] = 0; }
  return results;
}


export function calculatePump_power_calculator(input: Pump_power_calculatorInput): Pump_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRequiredPower"] ?? 0;
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


export interface Pump_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
