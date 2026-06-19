// Auto-generated from trip-cost-calculator-schema.json
import * as z from 'zod';

export interface Trip_cost_calculatorInput {
  distance: number;
  fuelEfficiency: number;
  fuelPrice: number;
  tolls: number;
  otherCosts: number;
  dataConfidence?: number;
}

export const Trip_cost_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  fuelEfficiency: z.number().default(8),
  fuelPrice: z.number().default(1.5),
  tolls: z.number().default(10),
  otherCosts: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Trip_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.distance / 100) * input.fuelEfficiency * input.fuelPrice; results["fuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelCost"] = 0; }
  try { const v = input.tolls; results["tollsCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tollsCost"] = 0; }
  try { const v = input.otherCosts; results["otherCostsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["otherCostsAmount"] = 0; }
  try { const v = (asFormulaNumber(results["fuelCost"])) + (asFormulaNumber(results["tollsCost"])) + (asFormulaNumber(results["otherCostsAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTrip_cost_calculator(input: Trip_cost_calculatorInput): Trip_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Trip_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
