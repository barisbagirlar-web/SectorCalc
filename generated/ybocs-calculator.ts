// Auto-generated from ybocs-calculator-schema.json
import * as z from 'zod';

export interface Ybocs_calculatorInput {
  rawMaterialCostPerUnit: number;
  yieldPercent: number;
  energyCostPerUnit: number;
  laborCostPerUnit: number;
  overheadCostPerUnit: number;
  productionVolume: number;
  defectRate: number;
}

export const Ybocs_calculatorInputSchema = z.object({
  rawMaterialCostPerUnit: z.number().default(10),
  yieldPercent: z.number().default(95),
  energyCostPerUnit: z.number().default(2),
  laborCostPerUnit: z.number().default(5),
  overheadCostPerUnit: z.number().default(3),
  productionVolume: z.number().default(1000),
  defectRate: z.number().default(5),
});

function evaluateAllFormulas(input: Ybocs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productionVolume * (1 - input.defectRate / 100); results["goodUnits"] = Number.isFinite(v) ? v : 0; } catch { results["goodUnits"] = 0; }
  try { const v = input.rawMaterialCostPerUnit * input.productionVolume; results["totalMaterialCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaterialCost"] = 0; }
  try { const v = input.energyCostPerUnit * (results["goodUnits"] ?? 0); results["totalEnergyCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalEnergyCost"] = 0; }
  try { const v = input.laborCostPerUnit * (results["goodUnits"] ?? 0); results["totalLaborCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = input.overheadCostPerUnit * (results["goodUnits"] ?? 0); results["totalOverheadCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalOverheadCost"] = 0; }
  try { const v = (results["totalMaterialCost"] ?? 0) + (results["totalEnergyCost"] ?? 0) + (results["totalLaborCost"] ?? 0) + (results["totalOverheadCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / (results["goodUnits"] ?? 0); results["totalCostPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostPerUnit"] = 0; }
  try { const v = (results["totalMaterialCost"] ?? 0) / (input.productionVolume * (input.yieldPercent / 100)) + (input.energyCostPerUnit + input.laborCostPerUnit + input.overheadCostPerUnit); results["yieldAdjustedCostPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["yieldAdjustedCostPerUnit"] = 0; }
  return results;
}


export function calculateYbocs_calculator(input: Ybocs_calculatorInput): Ybocs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCostPerUnit"] ?? 0;
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


export interface Ybocs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
