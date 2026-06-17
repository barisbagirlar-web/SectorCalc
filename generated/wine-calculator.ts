// @ts-nocheck
// Auto-generated from wine-calculator-schema.json
import * as z from 'zod';

export interface Wine_calculatorInput {
  grapeWeight: number;
  sugarContent: number;
  yieldPercent: number;
  alcoholConversion: number;
  fermentationLoss: number;
  bottleVolume: number;
}

export const Wine_calculatorInputSchema = z.object({
  grapeWeight: z.number().default(1000),
  sugarContent: z.number().default(220),
  yieldPercent: z.number().default(70),
  alcoholConversion: z.number().default(0.55),
  fermentationLoss: z.number().default(5),
  bottleVolume: z.number().default(0.75),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wine_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.grapeWeight * input.yieldPercent / 100; results["mustVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mustVolume"] = 0; }
  try { const v = (asFormulaNumber(results["mustVolume"])) * input.sugarContent; results["totalSugar"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSugar"] = 0; }
  try { const v = (asFormulaNumber(results["totalSugar"])) * input.alcoholConversion / 10; results["alcoholPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["alcoholPercent"] = 0; }
  try { const v = (asFormulaNumber(results["mustVolume"])) * (1 - input.fermentationLoss / 100); results["finalVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["finalVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWine_calculator(input: Wine_calculatorInput): Wine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mustVolume"]);
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


export interface Wine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
