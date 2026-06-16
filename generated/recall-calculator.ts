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

function evaluateAllFormulas(input: Recall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalUnitsProduced * (input.defectRate / 100); results["defectiveUnits"] = Number.isFinite(v) ? v : 0; } catch { results["defectiveUnits"] = 0; }
  try { const v = (results["defectiveUnits"] ?? 0) * (input.recallEffectiveness / 100); results["recalledUnits"] = Number.isFinite(v) ? v : 0; } catch { results["recalledUnits"] = 0; }
  try { const v = (results["recalledUnits"] ?? 0) * input.costPerRecallUnit; results["variableRecallCost"] = Number.isFinite(v) ? v : 0; } catch { results["variableRecallCost"] = 0; }
  try { const v = (results["recalledUnits"] ?? 0) * input.replacementCostPerUnit; results["totalReplacementCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalReplacementCost"] = 0; }
  try { const v = input.fixedRecallCost; results["fixedCost"] = Number.isFinite(v) ? v : 0; } catch { results["fixedCost"] = 0; }
  try { const v = (results["fixedCost"] ?? 0) + (results["variableRecallCost"] ?? 0) + (results["totalReplacementCost"] ?? 0); results["totalRecallCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalRecallCost"] = 0; }
  return results;
}


export function calculateRecall_calculator(input: Recall_calculatorInput): Recall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRecallCost"] ?? 0;
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


export interface Recall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
