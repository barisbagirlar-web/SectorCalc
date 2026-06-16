// Auto-generated from electricity-usage-calculator-schema.json
import * as z from 'zod';

export interface Electricity_usage_calculatorInput {
  power: number;
  hoursPerDay: number;
  daysPerMonth: number;
  numberOfDevices: number;
  costPerKwh: number;
}

export const Electricity_usage_calculatorInputSchema = z.object({
  power: z.number().default(1),
  hoursPerDay: z.number().default(8),
  daysPerMonth: z.number().default(30),
  numberOfDevices: z.number().default(1),
  costPerKwh: z.number().default(0.15),
});

function evaluateAllFormulas(input: Electricity_usage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.power * input.hoursPerDay * input.daysPerMonth * input.numberOfDevices; results["totalEnergyKwh"] = Number.isFinite(v) ? v : 0; } catch { results["totalEnergyKwh"] = 0; }
  try { const v = (results["totalEnergyKwh"] ?? 0) * input.costPerKwh; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateElectricity_usage_calculator(input: Electricity_usage_calculatorInput): Electricity_usage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Electricity_usage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
