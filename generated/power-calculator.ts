// Auto-generated from power-calculator-schema.json
import * as z from 'zod';

export interface Power_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
}

export const Power_calculatorInputSchema = z.object({
  voltage: z.number().default(230),
  current: z.number().default(10),
  powerFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltage * input.current * input.powerFactor; results["realPower"] = Number.isFinite(v) ? v : 0; } catch { results["realPower"] = 0; }
  try { const v = input.voltage * input.current; results["apparentPower"] = Number.isFinite(v) ? v : 0; } catch { results["apparentPower"] = 0; }
  try { const v = input.voltage * input.current * Math.sin(Math.acos(input.powerFactor)); results["reactivePower"] = Number.isFinite(v) ? v : 0; } catch { results["reactivePower"] = 0; }
  return results;
}


export function calculatePower_calculator(input: Power_calculatorInput): Power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["realPower"] ?? 0;
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


export interface Power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
