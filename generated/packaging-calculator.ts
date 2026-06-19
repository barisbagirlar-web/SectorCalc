// Auto-generated from packaging-calculator-schema.json
import * as z from 'zod';

export interface Packaging_calculatorInput {
  productLength: number;
  productWidth: number;
  productHeight: number;
  materialCostPerSqm: number;
  numberOfItems: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Packaging_calculatorInputSchema = z.object({
  productLength: z.number().default(10),
  productWidth: z.number().default(10),
  productHeight: z.number().default(10),
  materialCostPerSqm: z.number().default(0.5),
  numberOfItems: z.number().default(100),
  wasteFactor: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Packaging_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.productLength * input.productWidth + input.productLength * input.productHeight + input.productWidth * input.productHeight); results["surfaceAreaPerItem"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["surfaceAreaPerItem"] = 0; }
  try { const v = (asFormulaNumber(results["surfaceAreaPerItem"])) * (1 + input.wasteFactor / 100); results["areaWithWastePerItem"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["areaWithWastePerItem"] = 0; }
  try { const v = (asFormulaNumber(results["areaWithWastePerItem"])) * input.numberOfItems; results["totalAreaCm2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAreaCm2"] = 0; }
  try { const v = (asFormulaNumber(results["totalAreaCm2"])) / 10000; results["totalAreaM2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAreaM2"] = 0; }
  try { const v = (asFormulaNumber(results["totalAreaM2"])) * input.materialCostPerSqm; results["totalMaterialCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMaterialCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePackaging_calculator(input: Packaging_calculatorInput): Packaging_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalMaterialCost"]));
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


export interface Packaging_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
