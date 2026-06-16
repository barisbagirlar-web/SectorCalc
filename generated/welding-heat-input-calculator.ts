// Auto-generated from welding-heat-input-calculator-schema.json
import * as z from 'zod';

export interface Welding_heat_input_calculatorInput {
  voltage: number;
  current: number;
  travelSpeed: number;
  efficiency: number;
}

export const Welding_heat_input_calculatorInputSchema = z.object({
  voltage: z.number().default(25),
  current: z.number().default(200),
  travelSpeed: z.number().default(300),
  efficiency: z.number().default(0.8),
});

function evaluateAllFormulas(input: Welding_heat_input_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.voltage * input.current * 60 * input.efficiency) / (input.travelSpeed * 1000); results["heatInput"] = Number.isFinite(v) ? v : 0; } catch { results["heatInput"] = 0; }
  try { const v = (input.voltage * input.current * input.efficiency * 60) / 1000; results["effectiveHeatRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveHeatRate"] = 0; }
  try { const v = input.voltage * input.current; results["powerInput"] = Number.isFinite(v) ? v : 0; } catch { results["powerInput"] = 0; }
  return results;
}


export function calculateWelding_heat_input_calculator(input: Welding_heat_input_calculatorInput): Welding_heat_input_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["heatInput"] ?? 0;
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


export interface Welding_heat_input_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
