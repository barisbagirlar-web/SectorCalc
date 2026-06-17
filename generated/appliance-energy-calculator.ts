// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Appliance_energy_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.powerRating * input.usageHoursPerDay + input.standbyPower * (24 - input.usageHoursPerDay)) * input.applianceCount / 1000; results["dailyEnergyKWh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyEnergyKWh"] = 0; }
  try { const v = (asFormulaNumber(results["dailyEnergyKWh"])) * input.daysPerMonth; results["monthlyEnergyKWh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyEnergyKWh"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyEnergyKWh"])) * input.electricityCost; results["monthlyCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyCost"])) * 12; results["annualCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAppliance_energy_calculator(input: Appliance_energy_calculatorInput): Appliance_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
