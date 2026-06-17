// @ts-nocheck
// Auto-generated from sewing-thread-calculator-schema.json
import * as z from 'zod';

export interface Sewing_thread_calculatorInput {
  seamLength: number;
  stitchesPerCm: number;
  threadConsumptionPerStitch: number;
  numberOfGarments: number;
  wastePercentage: number;
}

export const Sewing_thread_calculatorInputSchema = z.object({
  seamLength: z.number().default(1),
  stitchesPerCm: z.number().default(4),
  threadConsumptionPerStitch: z.number().default(0.75),
  numberOfGarments: z.number().default(1),
  wastePercentage: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sewing_thread_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.seamLength * input.stitchesPerCm * input.threadConsumptionPerStitch; results["totalThreadPerGarment"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalThreadPerGarment"] = 0; }
  try { const v = (asFormulaNumber(results["totalThreadPerGarment"])) * input.numberOfGarments; results["totalWithoutWaste"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWithoutWaste"] = 0; }
  try { const v = (asFormulaNumber(results["totalWithoutWaste"])) * input.wastePercentage / 100; results["wasteAddition"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wasteAddition"] = 0; }
  try { const v = (asFormulaNumber(results["totalWithoutWaste"])) + (asFormulaNumber(results["wasteAddition"])); results["totalThreadWithWaste"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalThreadWithWaste"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSewing_thread_calculator(input: Sewing_thread_calculatorInput): Sewing_thread_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalThreadWithWaste"]);
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


export interface Sewing_thread_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
