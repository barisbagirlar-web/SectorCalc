// Auto-generated from voltage-divider-calculator-schema.json
import * as z from 'zod';

export interface Voltage_divider_calculatorInput {
  vin: number;
  r1: number;
  r2: number;
  tolerance: number;
}

export const Voltage_divider_calculatorInputSchema = z.object({
  vin: z.number().default(5),
  r1: z.number().default(1000),
  r2: z.number().default(1000),
  tolerance: z.number().default(5),
});

function evaluateAllFormulas(input: Voltage_divider_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vin * input.r2 / (input.r1 + input.r2); results["vout"] = Number.isFinite(v) ? v : 0; } catch { results["vout"] = 0; }
  try { const v = input.vin * (input.r2 * (1 - input.tolerance / 100)) / (input.r1 * (1 + input.tolerance / 100) + input.r2 * (1 - input.tolerance / 100)); results["voutMin"] = Number.isFinite(v) ? v : 0; } catch { results["voutMin"] = 0; }
  try { const v = input.vin * (input.r2 * (1 + input.tolerance / 100)) / (input.r1 * (1 - input.tolerance / 100) + input.r2 * (1 + input.tolerance / 100)); results["voutMax"] = Number.isFinite(v) ? v : 0; } catch { results["voutMax"] = 0; }
  return results;
}


export function calculateVoltage_divider_calculator(input: Voltage_divider_calculatorInput): Voltage_divider_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vout"] ?? 0;
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


export interface Voltage_divider_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
