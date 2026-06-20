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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Makeup_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.batchSize / input.unitWeight; results["totalUnits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUnits"] = Number.NaN; }
  try { const v = input.batchSize * input.materialCostPerGram; results["totalMaterialCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMaterialCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalUnits"])) * input.containerCostPerUnit; results["totalContainerCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContainerCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalUnits"])) * input.laborCostPerUnit; results["totalLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLaborCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMaterialCost"])) + (toNumericFormulaValue(results["totalContainerCost"])) + (toNumericFormulaValue(results["totalLaborCost"])); results["totalDirectCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDirectCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDirectCost"])) * (input.overheadPercentage / 100); results["overheadCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDirectCost"])) + (toNumericFormulaValue(results["overheadCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / (toNumericFormulaValue(results["totalUnits"])); results["costPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerUnit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["costPerUnit"])) * (1 + input.desiredMarginPercentage / 100); results["sellingPricePerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellingPricePerUnit"] = Number.NaN; }
  return results;
}


export function calculateMakeup_calculator(input: Makeup_calculatorInput): Makeup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPricePerUnit"]);
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


export interface Makeup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
