// Auto-generated from watt-hours-to-btu-calculator-schema.json
import * as z from 'zod';

export interface Watt_hours_to_btu_calculatorInput {
  power: number;
  time: number;
  efficiency: number;
  btuType: number;
  electricityCost: number;
  decimalPlaces: number;
}

export const Watt_hours_to_btu_calculatorInputSchema = z.object({
  power: z.number().default(1000),
  time: z.number().default(1),
  efficiency: z.number().default(100),
  btuType: z.number().default(1),
  electricityCost: z.number().default(0.152),
  decimalPlaces: z.number().default(2),
});

function evaluateAllFormulas(input: Watt_hours_to_btu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.power * input.time * input.efficiency / 100; results["wattHours"] = Number.isFinite(v) ? v : 0; } catch { results["wattHours"] = 0; }
  try { const v = (results["wattHours"] ?? 0) * (input.btuType == 1 ? 3.412141633 : input.btuType == 2 ? 3.4142 : 3.608249); results["btu"] = Number.isFinite(v) ? v : 0; } catch { results["btu"] = 0; }
  try { const v = Math.round((results["btu"] ?? 0) * (10 ** input.decimalPlaces)) / (10 ** input.decimalPlaces); results["btuRounded"] = Number.isFinite(v) ? v : 0; } catch { results["btuRounded"] = 0; }
  try { const v = (results["wattHours"] ?? 0) / 1000 * input.electricityCost; results["cost"] = Number.isFinite(v) ? v : 0; } catch { results["cost"] = 0; }
  try { const v = Math.round((results["cost"] ?? 0) * (10 ** input.decimalPlaces)) / (10 ** input.decimalPlaces); results["costRounded"] = Number.isFinite(v) ? v : 0; } catch { results["costRounded"] = 0; }
  return results;
}


export function calculateWatt_hours_to_btu_calculator(input: Watt_hours_to_btu_calculatorInput): Watt_hours_to_btu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["btuRounded"] ?? 0;
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


export interface Watt_hours_to_btu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
