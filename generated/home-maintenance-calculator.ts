// Auto-generated from home-maintenance-calculator-schema.json
import * as z from 'zod';

export interface Home_maintenance_calculatorInput {
  area: number;
  age: number;
  baseCostPerSqFt: number;
  ageMultiplier: number;
  inflation: number;
  yearsToProject: number;
  dataConfidence?: number;
}

export const Home_maintenance_calculatorInputSchema = z.object({
  area: z.number().default(1500),
  age: z.number().default(10),
  baseCostPerSqFt: z.number().default(1.5),
  ageMultiplier: z.number().default(0.02),
  inflation: z.number().default(0.03),
  yearsToProject: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Home_maintenance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.baseCostPerSqFt * (1 + input.age * input.ageMultiplier); results["currentAnnualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentAnnualCost"] = Number.NaN; }
  try { const v = input.baseCostPerSqFt * (1 + input.age * input.ageMultiplier); results["perSqFtCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perSqFtCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["currentAnnualCost"])) * ((1+input.inflation)**input.yearsToProject - 1) / input.inflation; results["projectedTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["projectedTotal"] = Number.NaN; }
  return results;
}


export function calculateHome_maintenance_calculator(input: Home_maintenance_calculatorInput): Home_maintenance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["currentAnnualCost"]);
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


export interface Home_maintenance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
