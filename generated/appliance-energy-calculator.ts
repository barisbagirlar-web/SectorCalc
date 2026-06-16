// Auto-generated from appliance-energy-calculator-schema.json
import * as z from 'zod';

export interface Appliance_energy_calculatorInput {
  powerRating: number;
  usageHoursPerDay: number;
  daysPerMonth: number;
  electricityCost: number;
  applianceCount: number;
  standbyPower: number;
}

export const Appliance_energy_calculatorInputSchema = z.object({
  powerRating: z.number().default(1000),
  usageHoursPerDay: z.number().default(5),
  daysPerMonth: z.number().default(30),
  electricityCost: z.number().default(0.12),
  applianceCount: z.number().default(1),
  standbyPower: z.number().default(0),
});

function evaluateAllFormulas(input: Appliance_energy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.powerRating * input.usageHoursPerDay + input.standbyPower * (24 - input.usageHoursPerDay)) * input.applianceCount / 1000; results["dailyEnergyKWh"] = Number.isFinite(v) ? v : 0; } catch { results["dailyEnergyKWh"] = 0; }
  try { const v = (results["dailyEnergyKWh"] ?? 0) * input.daysPerMonth; results["monthlyEnergyKWh"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyEnergyKWh"] = 0; }
  try { const v = (results["monthlyEnergyKWh"] ?? 0) * input.electricityCost; results["monthlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = (results["monthlyCost"] ?? 0) * 12; results["annualCost"] = Number.isFinite(v) ? v : 0; } catch { results["annualCost"] = 0; }
  return results;
}


export function calculateAppliance_energy_calculator(input: Appliance_energy_calculatorInput): Appliance_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyCost"] ?? 0;
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


export interface Appliance_energy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
