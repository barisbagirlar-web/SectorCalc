// Auto-generated from cut-calculator-schema.json
import * as z from 'zod';

export interface Cut_calculatorInput {
  stockLength: number;
  partLength: number;
  kerf: number;
  endTrim: number;
  requiredQuantity: number;
}

export const Cut_calculatorInputSchema = z.object({
  stockLength: z.number().default(2000),
  partLength: z.number().default(100),
  kerf: z.number().default(2),
  endTrim: z.number().default(0),
  requiredQuantity: z.number().default(0),
});

function evaluateAllFormulas(input: Cut_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stockLength - 2 * input.endTrim; results["usableLength"] = Number.isFinite(v) ? v : 0; } catch { results["usableLength"] = 0; }
  try { const v = Math.floor(((results["usableLength"] ?? 0) + input.kerf) / (input.partLength + input.kerf)); results["piecesPerStock"] = Number.isFinite(v) ? v : 0; } catch { results["piecesPerStock"] = 0; }
  try { const v = (results["usableLength"] ?? 0) - ((results["piecesPerStock"] ?? 0) * input.partLength + ((results["piecesPerStock"] ?? 0) - 1) * input.kerf); results["wasteLength"] = Number.isFinite(v) ? v : 0; } catch { results["wasteLength"] = 0; }
  try { const v = ((results["wasteLength"] ?? 0) / (results["usableLength"] ?? 0)) * 100; results["wastePercentage"] = Number.isFinite(v) ? v : 0; } catch { results["wastePercentage"] = 0; }
  try { const v = input.requiredQuantity > 0 ? Math.ceil(input.requiredQuantity / (results["piecesPerStock"] ?? 0)) : 0; results["stocksNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["stocksNeeded"] = 0; }
  try { const v = input.requiredQuantity > 0 ? (results["stocksNeeded"] ?? 0) * input.stockLength : 0; results["totalMaterialNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialNeeded"] = 0; }
  return results;
}


export function calculateCut_calculator(input: Cut_calculatorInput): Cut_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["piecesPerStock"] ?? 0;
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


export interface Cut_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
