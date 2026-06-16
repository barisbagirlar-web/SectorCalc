// Auto-generated from power-calculator-electrical-calculator-schema.json
import * as z from 'zod';

export interface Power_calculator_electrical_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  phaseCount: number;
  efficiency: number;
  isAC: number;
}

export const Power_calculator_electrical_calculatorInputSchema = z.object({
  voltage: z.number().default(230),
  current: z.number().default(10),
  powerFactor: z.number().default(1),
  phaseCount: z.number().default(1),
  efficiency: z.number().default(1),
  isAC: z.number().default(1),
});

function evaluateAllFormulas(input: Power_calculator_electrical_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.isAC === 0 ? input.voltage * input.current * input.efficiency : input.voltage * input.current * input.powerFactor * (input.phaseCount === 3 ? Math.sqrt(3) : 1) * input.efficiency; results["realPower_W"] = Number.isFinite(v) ? v : 0; } catch { results["realPower_W"] = 0; }
  try { const v = input.isAC === 0 ? input.voltage * input.current : input.voltage * input.current * (input.phaseCount === 3 ? Math.sqrt(3) : 1); results["apparentPower_VA"] = Number.isFinite(v) ? v : 0; } catch { results["apparentPower_VA"] = 0; }
  try { const v = input.isAC === 0 ? 0 : input.voltage * input.current * (input.phaseCount === 3 ? Math.sqrt(3) : 1) * Math.sqrt(1 - input.powerFactor * input.powerFactor); results["reactivePower_VAR"] = Number.isFinite(v) ? v : 0; } catch { results["reactivePower_VAR"] = 0; }
  return results;
}


export function calculatePower_calculator_electrical_calculator(input: Power_calculator_electrical_calculatorInput): Power_calculator_electrical_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["realPower_W"] ?? 0;
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


export interface Power_calculator_electrical_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
