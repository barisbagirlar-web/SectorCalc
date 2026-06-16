// Auto-generated from electricity-cost-calculator-schema.json
import * as z from 'zod';

export interface Electricity_cost_calculatorInput {
  powerConsumption: number;
  operatingHoursPerDay: number;
  operatingDaysPerMonth: number;
  electricityRate: number;
  peakDemand: number;
  demandChargeRate: number;
}

export const Electricity_cost_calculatorInputSchema = z.object({
  powerConsumption: z.number().default(10),
  operatingHoursPerDay: z.number().default(8),
  operatingDaysPerMonth: z.number().default(22),
  electricityRate: z.number().default(0.12),
  peakDemand: z.number().default(0),
  demandChargeRate: z.number().default(0),
});

function evaluateAllFormulas(input: Electricity_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerConsumption * input.operatingHoursPerDay * input.operatingDaysPerMonth * input.electricityRate; results["energyCost"] = Number.isFinite(v) ? v : 0; } catch { results["energyCost"] = 0; }
  try { const v = input.peakDemand * input.demandChargeRate; results["demandCost"] = Number.isFinite(v) ? v : 0; } catch { results["demandCost"] = 0; }
  try { const v = (input.powerConsumption * input.operatingHoursPerDay * input.operatingDaysPerMonth * input.electricityRate) + (input.peakDemand * input.demandChargeRate); results["totalMonthlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalMonthlyCost"] = 0; }
  return results;
}


export function calculateElectricity_cost_calculator(input: Electricity_cost_calculatorInput): Electricity_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMonthlyCost"] ?? 0;
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


export interface Electricity_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
