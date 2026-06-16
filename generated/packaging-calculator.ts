// Auto-generated from packaging-calculator-schema.json
import * as z from 'zod';

export interface Packaging_calculatorInput {
  productLength: number;
  productWidth: number;
  productHeight: number;
  materialCostPerSqm: number;
  numberOfItems: number;
  wasteFactor: number;
}

export const Packaging_calculatorInputSchema = z.object({
  productLength: z.number().default(10),
  productWidth: z.number().default(10),
  productHeight: z.number().default(10),
  materialCostPerSqm: z.number().default(0.5),
  numberOfItems: z.number().default(100),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Packaging_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.productLength * input.productWidth + input.productLength * input.productHeight + input.productWidth * input.productHeight); results["surfaceAreaPerItem"] = Number.isFinite(v) ? v : 0; } catch { results["surfaceAreaPerItem"] = 0; }
  try { const v = (results["surfaceAreaPerItem"] ?? 0) * (1 + input.wasteFactor / 100); results["areaWithWastePerItem"] = Number.isFinite(v) ? v : 0; } catch { results["areaWithWastePerItem"] = 0; }
  try { const v = (results["areaWithWastePerItem"] ?? 0) * input.numberOfItems; results["totalAreaCm2"] = Number.isFinite(v) ? v : 0; } catch { results["totalAreaCm2"] = 0; }
  try { const v = (results["totalAreaCm2"] ?? 0) / 10000; results["totalAreaM2"] = Number.isFinite(v) ? v : 0; } catch { results["totalAreaM2"] = 0; }
  try { const v = (results["totalAreaM2"] ?? 0) * input.materialCostPerSqm; results["totalMaterialCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialCost"] = 0; }
  return results;
}


export function calculatePackaging_calculator(input: Packaging_calculatorInput): Packaging_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMaterialCost"] ?? 0;
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


export interface Packaging_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
