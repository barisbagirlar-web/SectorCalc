// Auto-generated from gcs-calculator-schema.json
import * as z from 'zod';

export interface Gcs_calculatorInput {
  materialCost: number;
  laborCost: number;
  overheadRate: number;
  marginRate: number;
  quantity: number;
  dataConfidence?: number;
}

export const Gcs_calculatorInputSchema = z.object({
  materialCost: z.number().default(100),
  laborCost: z.number().default(50),
  overheadRate: z.number().default(20),
  marginRate: z.number().default(15),
  quantity: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gcs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialCost + input.laborCost + (input.materialCost + input.laborCost) * (input.overheadRate / 100); results["totalCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostPerUnit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCostPerUnit"])) * input.quantity; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCostPerUnit"])) * (1 + input.marginRate / 100); results["sellingPricePerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellingPricePerUnit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["sellingPricePerUnit"])) * input.quantity; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRevenue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRevenue"])) - (toNumericFormulaValue(results["totalCost"])); results["totalProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalProfit"] = Number.NaN; }
  return results;
}


export function calculateGcs_calculator(input: Gcs_calculatorInput): Gcs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalProfit"]);
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


export interface Gcs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
