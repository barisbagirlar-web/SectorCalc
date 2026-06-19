// Auto-generated from kwh-calculator-schema.json
import * as z from 'zod';

export interface Kwh_calculatorInput {
  powerRating: number;
  numberOfDevices: number;
  usageHoursPerDay: number;
  daysPerMonth: number;
  electricityRate: number;
  dataConfidence?: number;
}

export const Kwh_calculatorInputSchema = z.object({
  powerRating: z.number().default(1000),
  numberOfDevices: z.number().default(1),
  usageHoursPerDay: z.number().default(8),
  daysPerMonth: z.number().default(30),
  electricityRate: z.number().default(0.15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kwh_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.powerRating * input.numberOfDevices * input.usageHoursPerDay) / 1000; results["dailyEnergyKWh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyEnergyKWh"] = 0; }
  try { const v = (asFormulaNumber(results["dailyEnergyKWh"])) * input.daysPerMonth; results["monthlyEnergyKWh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyEnergyKWh"] = 0; }
  try { const v = (asFormulaNumber(results["dailyEnergyKWh"])) * 365; results["yearlyEnergyKWh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yearlyEnergyKWh"] = 0; }
  try { const v = (asFormulaNumber(results["monthlyEnergyKWh"])) * input.electricityRate; results["monthlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = (asFormulaNumber(results["yearlyEnergyKWh"])) * input.electricityRate; results["yearlyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yearlyCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKwh_calculator(input: Kwh_calculatorInput): Kwh_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["monthlyEnergyKWh"]);
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


export interface Kwh_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
