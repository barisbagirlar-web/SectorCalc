// Auto-generated from mile-calculator-schema.json
import * as z from 'zod';

export interface Mile_calculatorInput {
  distanceMiles: number;
  fuelEfficiency: number;
  fuelPrice: number;
  maintenanceCost: number;
  otherFixedCosts: number;
  annualMiles: number;
  dataConfidence?: number;
}

export const Mile_calculatorInputSchema = z.object({
  distanceMiles: z.number().default(100),
  fuelEfficiency: z.number().default(25),
  fuelPrice: z.number().default(3.5),
  maintenanceCost: z.number().default(0.05),
  otherFixedCosts: z.number().default(1200),
  annualMiles: z.number().default(12000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fuelPrice / input.fuelEfficiency; results["fuelCostPerMile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelCostPerMile"] = 0; }
  try { const v = input.maintenanceCost; results["maintenanceCostPerMile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maintenanceCostPerMile"] = 0; }
  try { const v = input.otherFixedCosts / input.annualMiles; results["fixedCostPerMile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fixedCostPerMile"] = 0; }
  try { const v = input.fuelPrice / input.fuelEfficiency + input.maintenanceCost + input.otherFixedCosts / input.annualMiles; results["totalCostPerMile"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCostPerMile"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMile_calculator(input: Mile_calculatorInput): Mile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostPerMile"]);
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


export interface Mile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
