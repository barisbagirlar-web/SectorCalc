// Auto-generated from sewing-thread-calculator-schema.json
import * as z from 'zod';

export interface Sewing_thread_calculatorInput {
  seamLength: number;
  stitchesPerCm: number;
  threadConsumptionPerStitch: number;
  numberOfGarments: number;
  wastePercentage: number;
  dataConfidence?: number;
}

export const Sewing_thread_calculatorInputSchema = z.object({
  seamLength: z.number().default(1),
  stitchesPerCm: z.number().default(4),
  threadConsumptionPerStitch: z.number().default(0.75),
  numberOfGarments: z.number().default(1),
  wastePercentage: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sewing_thread_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.seamLength * input.stitchesPerCm * input.threadConsumptionPerStitch; results["totalThreadPerGarment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalThreadPerGarment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalThreadPerGarment"])) * input.numberOfGarments; results["totalWithoutWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWithoutWaste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWithoutWaste"])) * input.wastePercentage / 100; results["wasteAddition"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteAddition"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWithoutWaste"])) + (toNumericFormulaValue(results["wasteAddition"])); results["totalThreadWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalThreadWithWaste"] = Number.NaN; }
  return results;
}


export function calculateSewing_thread_calculator(input: Sewing_thread_calculatorInput): Sewing_thread_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalThreadWithWaste"]);
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


export interface Sewing_thread_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
