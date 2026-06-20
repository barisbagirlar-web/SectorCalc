// Auto-generated from beer-calculator-schema.json
import * as z from 'zod';

export interface Beer_calculatorInput {
  maltQuantity: number;
  maltCostPerKg: number;
  hopsQuantity: number;
  hopsCostPer100g: number;
  yeastCost: number;
  energyCost: number;
  batchVolume: number;
  overheadCost: number;
  dataConfidence?: number;
}

export const Beer_calculatorInputSchema = z.object({
  maltQuantity: z.number().default(5),
  maltCostPerKg: z.number().default(15),
  hopsQuantity: z.number().default(100),
  hopsCostPer100g: z.number().default(50),
  yeastCost: z.number().default(25),
  energyCost: z.number().default(2.5),
  batchVolume: z.number().default(1000),
  overheadCost: z.number().default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maltQuantity * input.maltCostPerKg + input.hopsQuantity * (input.hopsCostPer100g / 100) + input.yeastCost; results["materialCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialCost"] = Number.NaN; }
  try { const v = input.batchVolume * 0.3; results["energyUsage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyUsage"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energyUsage"])) * input.energyCost; results["energyTotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyTotalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialCost"])) + (toNumericFormulaValue(results["energyTotalCost"])) + input.overheadCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.batchVolume; results["costPerLiter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerLiter"] = Number.NaN; }
  return results;
}


export function calculateBeer_calculator(input: Beer_calculatorInput): Beer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["materialCost"]);
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


export interface Beer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
