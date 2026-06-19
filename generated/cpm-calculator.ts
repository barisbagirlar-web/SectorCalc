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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cpm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fuelConsumption / 100) * input.fuelPrice; results["fuelCostPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelCostPerKm"] = 0; }
  try { const v = input.driverWagePerHour / input.averageSpeed; results["driverCostPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["driverCostPerKm"] = 0; }
  try { const v = (asFormulaNumber(results["fuelCostPerKm"])) + input.maintenanceCostPerKm + (asFormulaNumber(results["driverCostPerKm"])); results["totalCostPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCostPerKm"] = 0; }
  try { const v = (asFormulaNumber(results["totalCostPerKm"])) * input.distance + input.tollCost + input.otherCosts; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCpm_calculator(input: Cpm_calculatorInput): Cpm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostPerKm"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
