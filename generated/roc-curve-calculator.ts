// Auto-generated from roc-curve-calculator-schema.json
import * as z from 'zod';

export interface Roc_curve_calculatorInput {
  tpr1: number;
  fpr1: number;
  tpr2: number;
  fpr2: number;
  tpr3: number;
  fpr3: number;
  tpr4: number;
  fpr4: number;
  dataConfidence?: number;
}

export const Roc_curve_calculatorInputSchema = z.object({
  tpr1: z.number().default(0),
  fpr1: z.number().default(0),
  tpr2: z.number().default(0),
  fpr2: z.number().default(0),
  tpr3: z.number().default(0),
  fpr3: z.number().default(0),
  tpr4: z.number().default(0),
  fpr4: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roc_curve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * ((input.fpr2 - input.fpr1) * (input.tpr2 + input.tpr1) + (input.fpr3 - input.fpr2) * (input.tpr3 + input.tpr2) + (input.fpr4 - input.fpr3) * (input.tpr4 + input.tpr3)); results["auc"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["auc"] = 0; }
  try { const v = input.tpr1; results["tpr1_out"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tpr1_out"] = 0; }
  try { const v = input.fpr1; results["fpr1_out"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fpr1_out"] = 0; }
  try { const v = input.tpr2; results["tpr2_out"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tpr2_out"] = 0; }
  try { const v = input.fpr2; results["fpr2_out"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fpr2_out"] = 0; }
  try { const v = input.tpr3; results["tpr3_out"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tpr3_out"] = 0; }
  try { const v = input.fpr3; results["fpr3_out"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fpr3_out"] = 0; }
  try { const v = input.tpr4; results["tpr4_out"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tpr4_out"] = 0; }
  try { const v = input.fpr4; results["fpr4_out"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fpr4_out"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoc_curve_calculator(input: Roc_curve_calculatorInput): Roc_curve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["auc"]));
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


export interface Roc_curve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
