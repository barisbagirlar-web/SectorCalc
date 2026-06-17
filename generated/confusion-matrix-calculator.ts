// @ts-nocheck
// Auto-generated from confusion-matrix-calculator-schema.json
import * as z from 'zod';

export interface Confusion_matrix_calculatorInput {
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
}

export const Confusion_matrix_calculatorInputSchema = z.object({
  true_positives: z.number().default(50),
  false_positives: z.number().default(10),
  true_negatives: z.number().default(100),
  false_negatives: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Confusion_matrix_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (((input.true_positives + input.false_positives + input.true_negatives + input.false_negatives) !== 0 ? (input.true_positives + input.true_negatives) / (input.true_positives + input.false_positives + input.true_negatives + input.false_negatives) : 0) ? 1 : 0); results["accuracy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["accuracy"] = 0; }
  try { const v = (((input.true_positives + input.false_positives) !== 0 ? input.true_positives / (input.true_positives + input.false_positives) : 0) ? 1 : 0); results["precision"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["precision"] = 0; }
  try { const v = (((input.true_positives + input.false_negatives) !== 0 ? input.true_positives / (input.true_positives + input.false_negatives) : 0) ? 1 : 0); results["recall"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recall"] = 0; }
  try { const v = (((input.true_negatives + input.false_positives) !== 0 ? input.true_negatives / (input.true_negatives + input.false_positives) : 0) ? 1 : 0); results["specificity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["specificity"] = 0; }
  try { const v = ((input.true_positives + input.false_positives) !== 0 && (input.true_positives + input.false_negatives) !== 0) ? (2 * (input.true_positives / (input.true_positives + input.false_positives)) * (input.true_positives / (input.true_positives + input.false_negatives))) / ((input.true_positives / (input.true_positives + input.false_positives)) + (input.true_positives / (input.true_positives + input.false_negatives))) : 0; results["f1_score"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["f1_score"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConfusion_matrix_calculator(input: Confusion_matrix_calculatorInput): Confusion_matrix_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["f1_score"]);
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


export interface Confusion_matrix_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
