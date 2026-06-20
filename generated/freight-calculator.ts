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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Freight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance / input.fuelEfficiency * input.fuelCostPerLiter; results["fuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelCost"] = Number.NaN; }
  try { const v = input.weight * input.ratePerKg; results["weightCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fuelCost"])) + (toNumericFormulaValue(results["weightCost"])) + input.otherCharges; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateFreight_calculator(input: Freight_calculatorInput): Freight_calculatorOutput {
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


export interface Freight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
