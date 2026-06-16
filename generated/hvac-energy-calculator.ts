// Auto-generated from hvac-energy-calculator-schema.json
import * as z from 'zod';

export interface Hvac_energy_calculatorInput {
  area: number;
  tempDiff: number;
  heatLossCoefficient: number;
  acCop: number;
  hoursPerDay: number;
  electricityRate: number;
}

export const Hvac_energy_calculatorInputSchema = z.object({
  area: z.number().default(200),
  tempDiff: z.number().default(15),
  heatLossCoefficient: z.number().default(1.5),
  acCop: z.number().default(3.5),
  hoursPerDay: z.number().default(12),
  electricityRate: z.number().default(0.1),
});

function evaluateAllFormulas(input: Hvac_energy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.tempDiff * input.heatLossCoefficient / 1000; results["coolingLoad_kW"] = Number.isFinite(v) ? v : 0; } catch { results["coolingLoad_kW"] = 0; }
  try { const v = (results["coolingLoad_kW"] ?? 0) / input.acCop * input.hoursPerDay; results["dailyEnergy_kWh"] = Number.isFinite(v) ? v : 0; } catch { results["dailyEnergy_kWh"] = 0; }
  try { const v = (results["dailyEnergy_kWh"] ?? 0) * input.electricityRate; results["dailyCost"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (results["dailyCost"] ?? 0) * 30; results["monthlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = (results["dailyEnergy_kWh"] ?? 0) * input.electricityRate * 365; results["yearlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["yearlyCost"] = 0; }
  return results;
}


export function calculateHvac_energy_calculator(input: Hvac_energy_calculatorInput): Hvac_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["yearlyCost"] ?? 0;
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


export interface Hvac_energy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
