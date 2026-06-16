// Auto-generated from cage-calculator-schema.json
import * as z from 'zod';

export interface Cage_calculatorInput {
  rawMaterialUnitCost: number;
  laborUnitCost: number;
  overheadUnitCost: number;
  sellingPricePerUnit: number;
  unitsProduced: number;
  taxRate: number;
}

export const Cage_calculatorInputSchema = z.object({
  rawMaterialUnitCost: z.number().default(0),
  laborUnitCost: z.number().default(0),
  overheadUnitCost: z.number().default(0),
  sellingPricePerUnit: z.number().default(0),
  unitsProduced: z.number().default(1000),
  taxRate: z.number().default(25),
});

function evaluateAllFormulas(input: Cage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rawMaterialUnitCost + input.laborUnitCost + input.overheadUnitCost; results["totalCostPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostPerUnit"] = 0; }
  try { const v = (results["totalCostPerUnit"] ?? 0) * input.unitsProduced; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.sellingPricePerUnit * input.unitsProduced; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) - (results["totalCost"] ?? 0); results["grossProfit"] = Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = (results["grossProfit"] ?? 0) * (1 - input.taxRate / 100); results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  return results;
}


export function calculateCage_calculator(input: Cage_calculatorInput): Cage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netProfit"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
