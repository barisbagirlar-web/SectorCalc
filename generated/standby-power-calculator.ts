// Auto-generated from standby-power-calculator-schema.json
import * as z from 'zod';

export interface Standby_power_calculatorInput {
  deviceCount: number;
  standbyPower: number;
  hoursPerDay: number;
  daysPerMonth: number;
  electricityCost: number;
  co2Factor: number;
}

export const Standby_power_calculatorInputSchema = z.object({
  deviceCount: z.number().default(1),
  standbyPower: z.number().default(5),
  hoursPerDay: z.number().default(20),
  daysPerMonth: z.number().default(30),
  electricityCost: z.number().default(0.15),
  co2Factor: z.number().default(0.5),
});

function evaluateAllFormulas(input: Standby_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.deviceCount * input.standbyPower * input.hoursPerDay * input.daysPerMonth) / 1000; results["monthlyEnergyKwh"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyEnergyKwh"] = 0; }
  try { const v = ((input.deviceCount * input.standbyPower * input.hoursPerDay * input.daysPerMonth) / 1000) * input.electricityCost; results["monthlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = ((input.deviceCount * input.standbyPower * input.hoursPerDay * input.daysPerMonth) / 1000) * input.co2Factor; results["monthlyCO2"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCO2"] = 0; }
  return results;
}


export function calculateStandby_power_calculator(input: Standby_power_calculatorInput): Standby_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyEnergyKwh"] ?? 0;
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


export interface Standby_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
