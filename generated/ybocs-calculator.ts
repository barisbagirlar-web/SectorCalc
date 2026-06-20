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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ybocs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productionVolume * (1 - input.defectRate / 100); results["goodUnits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["goodUnits"] = Number.NaN; }
  try { const v = input.rawMaterialCostPerUnit * input.productionVolume; results["totalMaterialCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMaterialCost"] = Number.NaN; }
  try { const v = input.energyCostPerUnit * (toNumericFormulaValue(results["goodUnits"])); results["totalEnergyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEnergyCost"] = Number.NaN; }
  try { const v = input.laborCostPerUnit * (toNumericFormulaValue(results["goodUnits"])); results["totalLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLaborCost"] = Number.NaN; }
  try { const v = input.overheadCostPerUnit * (toNumericFormulaValue(results["goodUnits"])); results["totalOverheadCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOverheadCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMaterialCost"])) + (toNumericFormulaValue(results["totalEnergyCost"])) + (toNumericFormulaValue(results["totalLaborCost"])) + (toNumericFormulaValue(results["totalOverheadCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / (toNumericFormulaValue(results["goodUnits"])); results["totalCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostPerUnit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMaterialCost"])) / (input.productionVolume * (input.yieldPercent / 100)) + (input.energyCostPerUnit + input.laborCostPerUnit + input.overheadCostPerUnit); results["yieldAdjustedCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldAdjustedCostPerUnit"] = Number.NaN; }
  return results;
}


export function calculateYbocs_calculator(input: Ybocs_calculatorInput): Ybocs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostPerUnit"]);
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


export interface Ybocs_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
