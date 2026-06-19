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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Electricity_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerConsumption * input.operatingHoursPerDay * input.operatingDaysPerMonth * input.electricityRate; results["energyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["energyCost"] = 0; }
  try { const v = input.peakDemand * input.demandChargeRate; results["demandCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["demandCost"] = 0; }
  try { const v = (input.powerConsumption * input.operatingHoursPerDay * input.operatingDaysPerMonth * input.electricityRate) + (input.peakDemand * input.demandChargeRate); results["totalMonthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMonthlyCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateElectricity_cost_calculator(input: Electricity_cost_calculatorInput): Electricity_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalMonthlyCost"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
