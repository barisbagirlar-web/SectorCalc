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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maltQuantity * input.maltCostPerKg + input.hopsQuantity * (input.hopsCostPer100g / 100) + input.yeastCost; results["materialCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.batchVolume * 0.3; results["energyUsage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["energyUsage"] = 0; }
  try { const v = (asFormulaNumber(results["energyUsage"])) * input.energyCost; results["energyTotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["energyTotalCost"] = 0; }
  try { const v = (asFormulaNumber(results["materialCost"])) + (asFormulaNumber(results["energyTotalCost"])) + input.overheadCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.batchVolume; results["costPerLiter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costPerLiter"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBeer_calculator(input: Beer_calculatorInput): Beer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["materialCost"]));
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


export interface Beer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
