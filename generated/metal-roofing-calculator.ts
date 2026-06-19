// Auto-generated from metal-roofing-calculator-schema.json
import * as z from 'zod';

export interface Metal_roofing_calculatorInput {
  roofArea: number;
  materialCostPerUnit: number;
  laborCostPerUnit: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Metal_roofing_calculatorInputSchema = z.object({
  roofArea: z.number().default(100),
  materialCostPerUnit: z.number().default(15),
  laborCostPerUnit: z.number().default(10),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Metal_roofing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofArea * input.materialCostPerUnit * (1 + input.wasteFactor / 100); results["materialCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.roofArea * input.laborCostPerUnit; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = input.roofArea * input.materialCostPerUnit * input.wasteFactor / 100; results["wasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteCost"] = 0; }
  try { const v = (asFormulaNumber(results["materialCost"])) + (asFormulaNumber(results["laborCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMetal_roofing_calculator(input: Metal_roofing_calculatorInput): Metal_roofing_calculatorOutput {
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


export interface Metal_roofing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
