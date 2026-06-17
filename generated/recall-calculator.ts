// @ts-nocheck
// Auto-generated from recall-calculator-schema.json
import * as z from 'zod';

export interface Recall_calculatorInput {
  totalUnitsProduced: number;
  defectRate: number;
  recallEffectiveness: number;
  costPerRecallUnit: number;
  fixedRecallCost: number;
  replacementCostPerUnit: number;
}

export const Recall_calculatorInputSchema = z.object({
  totalUnitsProduced: z.number().default(10000),
  defectRate: z.number().default(0.5),
  recallEffectiveness: z.number().default(80),
  costPerRecallUnit: z.number().default(50),
  fixedRecallCost: z.number().default(5000),
  replacementCostPerUnit: z.number().default(30),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Recall_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalUnitsProduced * (input.defectRate / 100); results["defectiveUnits"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["defectiveUnits"] = 0; }
  try { const v = (asFormulaNumber(results["defectiveUnits"])) * (input.recallEffectiveness / 100); results["recalledUnits"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recalledUnits"] = 0; }
  try { const v = (asFormulaNumber(results["recalledUnits"])) * input.costPerRecallUnit; results["variableRecallCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["variableRecallCost"] = 0; }
  try { const v = (asFormulaNumber(results["recalledUnits"])) * input.replacementCostPerUnit; results["totalReplacementCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalReplacementCost"] = 0; }
  try { const v = input.fixedRecallCost; results["fixedCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fixedCost"] = 0; }
  try { const v = (asFormulaNumber(results["fixedCost"])) + (asFormulaNumber(results["variableRecallCost"])) + (asFormulaNumber(results["totalReplacementCost"])); results["totalRecallCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRecallCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRecall_calculator(input: Recall_calculatorInput): Recall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRecallCost"]);
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


export interface Recall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
