// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ybocs_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.productionVolume * (1 - input.defectRate / 100); results["goodUnits"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["goodUnits"] = 0; }
  try { const v = input.rawMaterialCostPerUnit * input.productionVolume; results["totalMaterialCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMaterialCost"] = 0; }
  try { const v = input.energyCostPerUnit * (asFormulaNumber(results["goodUnits"])); results["totalEnergyCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalEnergyCost"] = 0; }
  try { const v = input.laborCostPerUnit * (asFormulaNumber(results["goodUnits"])); results["totalLaborCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = input.overheadCostPerUnit * (asFormulaNumber(results["goodUnits"])); results["totalOverheadCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalOverheadCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalMaterialCost"])) + (asFormulaNumber(results["totalEnergyCost"])) + (asFormulaNumber(results["totalLaborCost"])) + (asFormulaNumber(results["totalOverheadCost"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / (asFormulaNumber(results["goodUnits"])); results["totalCostPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCostPerUnit"] = 0; }
  try { const v = (asFormulaNumber(results["totalMaterialCost"])) / (input.productionVolume * (input.yieldPercent / 100)) + (input.energyCostPerUnit + input.laborCostPerUnit + input.overheadCostPerUnit); results["yieldAdjustedCostPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yieldAdjustedCostPerUnit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateYbocs_calculator(input: Ybocs_calculatorInput): Ybocs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostPerUnit"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
