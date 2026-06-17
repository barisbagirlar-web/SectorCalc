// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Makeup_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.batchSize / input.unitWeight; results["totalUnits"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalUnits"] = 0; }
  try { const v = input.batchSize * input.materialCostPerGram; results["totalMaterialCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMaterialCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalUnits"])) * input.containerCostPerUnit; results["totalContainerCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalContainerCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalUnits"])) * input.laborCostPerUnit; results["totalLaborCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLaborCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalMaterialCost"])) + (asFormulaNumber(results["totalContainerCost"])) + (asFormulaNumber(results["totalLaborCost"])); results["totalDirectCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDirectCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalDirectCost"])) * (input.overheadPercentage / 100); results["overheadCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalDirectCost"])) + (asFormulaNumber(results["overheadCost"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / (asFormulaNumber(results["totalUnits"])); results["costPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerUnit"] = 0; }
  try { const v = (asFormulaNumber(results["costPerUnit"])) * (1 + input.desiredMarginPercentage / 100); results["sellingPricePerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sellingPricePerUnit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMakeup_calculator(input: Makeup_calculatorInput): Makeup_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPricePerUnit"]);
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


export interface Makeup_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
