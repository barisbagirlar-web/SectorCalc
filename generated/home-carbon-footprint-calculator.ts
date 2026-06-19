// Auto-generated from home-carbon-footprint-calculator-schema.json
import * as z from 'zod';

export interface Home_carbon_footprint_calculatorInput {
  electricityAnnual: number;
  gasAnnual: number;
  carMilesAnnual: number;
  airTravelAnnual: number;
  dataConfidence?: number;
}

export const Home_carbon_footprint_calculatorInputSchema = z.object({
  electricityAnnual: z.number().default(3500),
  gasAnnual: z.number().default(400),
  carMilesAnnual: z.number().default(12000),
  airTravelAnnual: z.number().default(5000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Home_carbon_footprint_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.electricityAnnual * 0.92; results["electricityEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["electricityEmissions"] = 0; }
  try { const v = input.gasAnnual * 5.3; results["gasEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gasEmissions"] = 0; }
  try { const v = input.carMilesAnnual * 0.355; results["carEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["carEmissions"] = 0; }
  try { const v = input.airTravelAnnual * 0.115; results["airEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["airEmissions"] = 0; }
  try { const v = (asFormulaNumber(results["electricityEmissions"])) + (asFormulaNumber(results["gasEmissions"])) + (asFormulaNumber(results["carEmissions"])) + (asFormulaNumber(results["airEmissions"])); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHome_carbon_footprint_calculator(input: Home_carbon_footprint_calculatorInput): Home_carbon_footprint_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
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


export interface Home_carbon_footprint_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
