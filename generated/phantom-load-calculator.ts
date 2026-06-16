// Auto-generated from phantom-load-calculator-schema.json
import * as z from 'zod';

export interface Phantom_load_calculatorInput {
  standbyWatt: number;
  numberOfDevices: number;
  standbyHoursPerDay: number;
  electricityCost: number;
  carbonFactor: number;
  operatingDaysPerYear: number;
}

export const Phantom_load_calculatorInputSchema = z.object({
  standbyWatt: z.number().default(5),
  numberOfDevices: z.number().default(1),
  standbyHoursPerDay: z.number().default(24),
  electricityCost: z.number().default(1.5),
  carbonFactor: z.number().default(0.5),
  operatingDaysPerYear: z.number().default(365),
});

function evaluateAllFormulas(input: Phantom_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.standbyWatt * input.numberOfDevices * input.standbyHoursPerDay) / 1000; results["dailyEnergyKwh"] = Number.isFinite(v) ? v : 0; } catch { results["dailyEnergyKwh"] = 0; }
  try { const v = (results["dailyEnergyKwh"] ?? 0) * input.operatingDaysPerYear; results["annualEnergyKwh"] = Number.isFinite(v) ? v : 0; } catch { results["annualEnergyKwh"] = 0; }
  try { const v = (results["annualEnergyKwh"] ?? 0) * input.electricityCost; results["annualCost"] = Number.isFinite(v) ? v : 0; } catch { results["annualCost"] = 0; }
  try { const v = (results["annualEnergyKwh"] ?? 0) * input.carbonFactor; results["annualCarbonKg"] = Number.isFinite(v) ? v : 0; } catch { results["annualCarbonKg"] = 0; }
  return results;
}


export function calculatePhantom_load_calculator(input: Phantom_load_calculatorInput): Phantom_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["annualCost"] ?? 0;
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


export interface Phantom_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
