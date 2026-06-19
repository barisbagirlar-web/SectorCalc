// Auto-generated from roc-auc-calculator-schema.json
import * as z from 'zod';

export interface Roc_auc_calculatorInput {
  fpr1: number;
  tpr1: number;
  fpr2: number;
  tpr2: number;
  fpr3: number;
  tpr3: number;
  fpr4: number;
  tpr4: number;
  dataConfidence?: number;
}

export const Roc_auc_calculatorInputSchema = z.object({
  fpr1: z.number().default(0.1),
  tpr1: z.number().default(0.5),
  fpr2: z.number().default(0.2),
  tpr2: z.number().default(0.8),
  fpr3: z.number().default(0.5),
  tpr3: z.number().default(0.9),
  fpr4: z.number().default(0.8),
  tpr4: z.number().default(0.95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roc_auc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * (input.fpr1 * input.tpr1 + (input.fpr2 - input.fpr1) * (input.tpr1 + input.tpr2) + (input.fpr3 - input.fpr2) * (input.tpr2 + input.tpr3) + (input.fpr4 - input.fpr3) * (input.tpr3 + input.tpr4) + (1 - input.fpr4) * (input.tpr4 + 1)); results["auc"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["auc"] = 0; }
  try { const v = 2 * (asFormulaNumber(results["auc"])) - 1; results["gini"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gini"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoc_auc_calculator(input: Roc_auc_calculatorInput): Roc_auc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["auc"]);
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


export interface Roc_auc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
