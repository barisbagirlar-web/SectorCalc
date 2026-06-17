// @ts-nocheck
// Auto-generated from home-maintenance-calculator-schema.json
import * as z from 'zod';

export interface Home_maintenance_calculatorInput {
  area: number;
  age: number;
  baseCostPerSqFt: number;
  ageMultiplier: number;
  inflation: number;
  yearsToProject: number;
}

export const Home_maintenance_calculatorInputSchema = z.object({
  area: z.number().default(1500),
  age: z.number().default(10),
  baseCostPerSqFt: z.number().default(1.5),
  ageMultiplier: z.number().default(0.02),
  inflation: z.number().default(0.03),
  yearsToProject: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Home_maintenance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.area * input.baseCostPerSqFt * (1 + input.age * input.ageMultiplier); results["currentAnnualCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["currentAnnualCost"] = 0; }
  try { const v = input.baseCostPerSqFt * (1 + input.age * input.ageMultiplier); results["perSqFtCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["perSqFtCost"] = 0; }
  try { const v = (asFormulaNumber(results["currentAnnualCost"])) * ((1+input.inflation)**input.yearsToProject - 1) / input.inflation; results["projectedTotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["projectedTotal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHome_maintenance_calculator(input: Home_maintenance_calculatorInput): Home_maintenance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["currentAnnualCost"]);
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


export interface Home_maintenance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
