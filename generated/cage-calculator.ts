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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rawMaterialUnitCost + input.laborUnitCost + input.overheadUnitCost; results["totalCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostPerUnit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCostPerUnit"])) * input.unitsProduced; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.sellingPricePerUnit * input.unitsProduced; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRevenue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRevenue"])) - (toNumericFormulaValue(results["totalCost"])); results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossProfit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossProfit"])) * (1 - input.taxRate / 100); results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netProfit"] = Number.NaN; }
  return results;
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
