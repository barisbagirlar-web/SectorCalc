// Auto-generated from gcs-calculator-schema.json
import * as z from 'zod';

export interface Gcs_calculatorInput {
  materialCost: number;
  laborCost: number;
  overheadRate: number;
  marginRate: number;
  quantity: number;
}

export const Gcs_calculatorInputSchema = z.object({
  materialCost: z.number().default(100),
  laborCost: z.number().default(50),
  overheadRate: z.number().default(20),
  marginRate: z.number().default(15),
  quantity: z.number().default(100),
});

function evaluateAllFormulas(input: Gcs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialCost + input.laborCost + (input.materialCost + input.laborCost) * (input.overheadRate / 100); results["totalCostPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostPerUnit"] = 0; }
  try { const v = (results["totalCostPerUnit"] ?? 0) * input.quantity; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCostPerUnit"] ?? 0) * (1 + input.marginRate / 100); results["sellingPricePerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPricePerUnit"] = 0; }
  try { const v = (results["sellingPricePerUnit"] ?? 0) * input.quantity; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) - (results["totalCost"] ?? 0); results["totalProfit"] = Number.isFinite(v) ? v : 0; } catch { results["totalProfit"] = 0; }
  return results;
}


export function calculateGcs_calculator(input: Gcs_calculatorInput): Gcs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalProfit"] ?? 0;
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


export interface Gcs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
