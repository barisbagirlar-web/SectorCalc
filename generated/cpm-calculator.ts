// Auto-generated from cpm-calculator-schema.json
import * as z from 'zod';

export interface Cpm_calculatorInput {
  distance: number;
  fuelConsumption: number;
  fuelPrice: number;
  maintenanceCostPerKm: number;
  driverWagePerHour: number;
  averageSpeed: number;
  tollCost: number;
  otherCosts: number;
}

export const Cpm_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  fuelConsumption: z.number().default(10),
  fuelPrice: z.number().default(1.5),
  maintenanceCostPerKm: z.number().default(0.05),
  driverWagePerHour: z.number().default(25),
  averageSpeed: z.number().default(60),
  tollCost: z.number().default(0),
  otherCosts: z.number().default(0),
});

function evaluateAllFormulas(input: Cpm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fuelConsumption / 100) * input.fuelPrice; results["fuelCostPerKm"] = Number.isFinite(v) ? v : 0; } catch { results["fuelCostPerKm"] = 0; }
  try { const v = input.driverWagePerHour / input.averageSpeed; results["driverCostPerKm"] = Number.isFinite(v) ? v : 0; } catch { results["driverCostPerKm"] = 0; }
  try { const v = (results["fuelCostPerKm"] ?? 0) + input.maintenanceCostPerKm + (results["driverCostPerKm"] ?? 0); results["totalCostPerKm"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostPerKm"] = 0; }
  try { const v = (results["totalCostPerKm"] ?? 0) * input.distance + input.tollCost + input.otherCosts; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateCpm_calculator(input: Cpm_calculatorInput): Cpm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCostPerKm"] ?? 0;
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


export interface Cpm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
