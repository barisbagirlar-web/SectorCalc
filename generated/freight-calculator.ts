// Auto-generated from freight-calculator-schema.json
import * as z from 'zod';

export interface Freight_calculatorInput {
  distance: number;
  weight: number;
  fuelCostPerLiter: number;
  fuelEfficiency: number;
  ratePerKg: number;
  otherCharges: number;
  dataConfidence?: number;
}

export const Freight_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  weight: z.number().default(1000),
  fuelCostPerLiter: z.number().default(1.5),
  fuelEfficiency: z.number().default(5),
  ratePerKg: z.number().default(0.1),
  otherCharges: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Freight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.fuelEfficiency * input.fuelCostPerLiter; results["fuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fuelCost"] = 0; }
  try { const v = input.weight * input.ratePerKg; results["weightCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightCost"] = 0; }
  try { const v = (asFormulaNumber(results["fuelCost"])) + (asFormulaNumber(results["weightCost"])) + input.otherCharges; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFreight_calculator(input: Freight_calculatorInput): Freight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
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


export interface Freight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
