// Auto-generated from makeup-calculator-schema.json
import * as z from 'zod';

export interface Makeup_calculatorInput {
  batchSize: number;
  unitWeight: number;
  materialCostPerGram: number;
  containerCostPerUnit: number;
  laborCostPerUnit: number;
  overheadPercentage: number;
  desiredMarginPercentage: number;
}

export const Makeup_calculatorInputSchema = z.object({
  batchSize: z.number().default(1000),
  unitWeight: z.number().default(30),
  materialCostPerGram: z.number().default(0.05),
  containerCostPerUnit: z.number().default(0.5),
  laborCostPerUnit: z.number().default(0.2),
  overheadPercentage: z.number().default(20),
  desiredMarginPercentage: z.number().default(50),
});

function evaluateAllFormulas(input: Makeup_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.batchSize / input.unitWeight; results["totalUnits"] = Number.isFinite(v) ? v : 0; } catch { results["totalUnits"] = 0; }
  try { const v = input.batchSize * input.materialCostPerGram; results["totalMaterialCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialCost"] = 0; }
  try { const v = (results["totalUnits"] ?? 0) * input.containerCostPerUnit; results["totalContainerCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalContainerCost"] = 0; }
  try { const v = (results["totalUnits"] ?? 0) * input.laborCostPerUnit; results["totalLaborCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = (results["totalMaterialCost"] ?? 0) + (results["totalContainerCost"] ?? 0) + (results["totalLaborCost"] ?? 0); results["totalDirectCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalDirectCost"] = 0; }
  try { const v = (results["totalDirectCost"] ?? 0) * (input.overheadPercentage / 100); results["overheadCost"] = Number.isFinite(v) ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (results["totalDirectCost"] ?? 0) + (results["overheadCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / (results["totalUnits"] ?? 0); results["costPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["costPerUnit"] = 0; }
  try { const v = (results["costPerUnit"] ?? 0) * (1 + input.desiredMarginPercentage / 100); results["sellingPricePerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPricePerUnit"] = 0; }
  return results;
}


export function calculateMakeup_calculator(input: Makeup_calculatorInput): Makeup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sellingPricePerUnit"] ?? 0;
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


export interface Makeup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
