// @ts-nocheck
// Auto-generated from sensitivity-specificity-calculator-schema.json
import * as z from 'zod';

export interface Sensitivity_specificity_calculatorInput {
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
}

export const Sensitivity_specificity_calculatorInputSchema = z.object({
  truePositive: z.number().default(80),
  falsePositive: z.number().default(20),
  falseNegative: z.number().default(10),
  trueNegative: z.number().default(90),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sensitivity_specificity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.truePositive / (input.truePositive + input.falseNegative); results["sensitivity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sensitivity"] = 0; }
  try { const v = input.trueNegative / (input.trueNegative + input.falsePositive); results["specificity"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["specificity"] = 0; }
  try { const v = input.truePositive / (input.truePositive + input.falsePositive); results["ppv"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ppv"] = 0; }
  try { const v = input.trueNegative / (input.trueNegative + input.falseNegative); results["npv"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["npv"] = 0; }
  try { const v = (input.truePositive + input.trueNegative) / (input.truePositive + input.falsePositive + input.falseNegative + input.trueNegative); results["accuracy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["accuracy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSensitivity_specificity_calculator(input: Sensitivity_specificity_calculatorInput): Sensitivity_specificity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sensitivity"]);
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


export interface Sensitivity_specificity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
