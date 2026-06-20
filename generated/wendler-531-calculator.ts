// Auto-generated from wendler-531-calculator-schema.json
import * as z from 'zod';

export interface Wendler_531_calculatorInput {
  oneRepMax: number;
  trainingMaxPercent: number;
  week: number;
  set1Percent: number;
  set2Percent: number;
  set3Percent: number;
  dataConfidence?: number;
}

export const Wendler_531_calculatorInputSchema = z.object({
  oneRepMax: z.number().default(100),
  trainingMaxPercent: z.number().default(90),
  week: z.number().default(1),
  set1Percent: z.number().default(65),
  set2Percent: z.number().default(75),
  set3Percent: z.number().default(85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wendler_531_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oneRepMax * input.trainingMaxPercent / 100; results["trainingMax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["trainingMax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["trainingMax"])) * input.set1Percent / 100; results["set1Weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["set1Weight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["trainingMax"])) * input.set2Percent / 100; results["set2Weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["set2Weight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["trainingMax"])) * input.set3Percent / 100; results["set3Weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["set3Weight"] = Number.NaN; }
  return results;
}


export function calculateWendler_531_calculator(input: Wendler_531_calculatorInput): Wendler_531_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["set3Weight"]);
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


export interface Wendler_531_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
