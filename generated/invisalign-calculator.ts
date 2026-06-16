// Auto-generated from invisalign-calculator-schema.json
import * as z from 'zod';

export interface Invisalign_calculatorInput {
  numberOfAligners: number;
  materialCostPerAligner: number;
  laborCostPerAligner: number;
  overheadRate: number;
  sellingPricePerAligner: number;
}

export const Invisalign_calculatorInputSchema = z.object({
  numberOfAligners: z.number().default(20),
  materialCostPerAligner: z.number().default(50),
  laborCostPerAligner: z.number().default(30),
  overheadRate: z.number().default(15),
  sellingPricePerAligner: z.number().default(150),
});

function evaluateAllFormulas(input: Invisalign_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.materialCostPerAligner + input.laborCostPerAligner) * input.numberOfAligners; results["totalDirectCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalDirectCost"] = 0; }
  try { const v = (results["totalDirectCost"] ?? 0) * (input.overheadRate / 100); results["totalOverhead"] = Number.isFinite(v) ? v : 0; } catch { results["totalOverhead"] = 0; }
  try { const v = (results["totalDirectCost"] ?? 0) + (results["totalOverhead"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.sellingPricePerAligner * input.numberOfAligners; results["totalRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (results["totalRevenue"] ?? 0) - (results["totalCost"] ?? 0); results["profit"] = Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = ((results["profit"] ?? 0) / (results["totalRevenue"] ?? 0)) * 100; results["marginPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["marginPercentage"] = 0; }
  return results;
}


export function calculateInvisalign_calculator(input: Invisalign_calculatorInput): Invisalign_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Net"] ?? 0;
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


export interface Invisalign_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
