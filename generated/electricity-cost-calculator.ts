// Auto-generated from electricity-cost-calculator-schema.json
import * as z from 'zod';

export interface Electricity_cost_calculatorInput {
  powerConsumption: number;
  operatingHoursPerDay: number;
  operatingDaysPerMonth: number;
  electricityRate: number;
  peakDemand: number;
  demandChargeRate: number;
  dataConfidence?: number;
}

export const Electricity_cost_calculatorInputSchema = z.object({
  powerConsumption: z.number().default(10),
  operatingHoursPerDay: z.number().default(8),
  operatingDaysPerMonth: z.number().default(22),
  electricityRate: z.number().default(0.12),
  peakDemand: z.number().default(0),
  demandChargeRate: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Electricity_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerConsumption * input.operatingHoursPerDay * input.operatingDaysPerMonth * input.electricityRate; results["energyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyCost"] = Number.NaN; }
  try { const v = input.peakDemand * input.demandChargeRate; results["demandCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["demandCost"] = Number.NaN; }
  try { const v = (input.powerConsumption * input.operatingHoursPerDay * input.operatingDaysPerMonth * input.electricityRate) + (input.peakDemand * input.demandChargeRate); results["totalMonthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMonthlyCost"] = Number.NaN; }
  return results;
}


export function calculateElectricity_cost_calculator(input: Electricity_cost_calculatorInput): Electricity_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMonthlyCost"]);
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


export interface Electricity_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
