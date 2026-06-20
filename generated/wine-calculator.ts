// Auto-generated from wine-calculator-schema.json
import * as z from 'zod';

export interface Wine_calculatorInput {
  grapeWeight: number;
  sugarContent: number;
  yieldPercent: number;
  alcoholConversion: number;
  fermentationLoss: number;
  bottleVolume: number;
  dataConfidence?: number;
}

export const Wine_calculatorInputSchema = z.object({
  grapeWeight: z.number().default(1000),
  sugarContent: z.number().default(220),
  yieldPercent: z.number().default(70),
  alcoholConversion: z.number().default(0.55),
  fermentationLoss: z.number().default(5),
  bottleVolume: z.number().default(0.75),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grapeWeight * input.yieldPercent / 100; results["mustVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mustVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["mustVolume"])) * input.sugarContent; results["totalSugar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSugar"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSugar"])) * input.alcoholConversion / 10; results["alcoholPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alcoholPercent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["mustVolume"])) * (1 - input.fermentationLoss / 100); results["finalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalVolume"] = Number.NaN; }
  return results;
}


export function calculateWine_calculator(input: Wine_calculatorInput): Wine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mustVolume"]);
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


export interface Wine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
