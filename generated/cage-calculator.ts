// Auto-generated from cage-calculator-schema.json
import * as z from 'zod';

export interface Cage_calculatorInput {
  rawMaterialUnitCost: number;
  laborUnitCost: number;
  overheadUnitCost: number;
  sellingPricePerUnit: number;
  unitsProduced: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Cage_calculatorInputSchema = z.object({
  rawMaterialUnitCost: z.number().default(0),
  laborUnitCost: z.number().default(0),
  overheadUnitCost: z.number().default(0),
  sellingPricePerUnit: z.number().default(0),
  unitsProduced: z.number().default(1000),
  taxRate: z.number().default(25),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rawMaterialUnitCost + input.laborUnitCost + input.overheadUnitCost; results["totalCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCostPerUnit"] = 0; }
  try { const v = (asFormulaNumber(results["totalCostPerUnit"])) * input.unitsProduced; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.sellingPricePerUnit * input.unitsProduced; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - (asFormulaNumber(results["totalCost"])); results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (asFormulaNumber(results["grossProfit"])) * (1 - input.taxRate / 100); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCage_calculator(input: Cage_calculatorInput): Cage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netProfit"]);
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


export interface Cage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
