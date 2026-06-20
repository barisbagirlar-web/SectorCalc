// Auto-generated from diopter-calculator-schema.json
import * as z from 'zod';

export interface Diopter_calculatorInput {
  focalLengthCm: number;
  diopter1: number;
  diopter2: number;
  originalDiopter: number;
  vertexDistanceMm: number;
  dataConfidence?: number;
}

export const Diopter_calculatorInputSchema = z.object({
  focalLengthCm: z.number().default(50),
  diopter1: z.number().default(1),
  diopter2: z.number().default(1),
  originalDiopter: z.number().default(-3),
  vertexDistanceMm: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Diopter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 100 / input.focalLengthCm; results["diopter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diopter"] = Number.NaN; }
  try { const v = input.focalLengthCm / 100; results["focalLengthM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["focalLengthM"] = Number.NaN; }
  try { const v = input.diopter1 + input.diopter2; results["combinedDiopter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["combinedDiopter"] = Number.NaN; }
  try { const v = 100 / (toNumericFormulaValue(results["combinedDiopter"])); results["combinedFocalLengthCm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["combinedFocalLengthCm"] = Number.NaN; }
  try { const v = input.originalDiopter / (1 - (input.vertexDistanceMm / 1000) * input.originalDiopter); results["effectiveDiopter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveDiopter"] = Number.NaN; }
  return results;
}


export function calculateDiopter_calculator(input: Diopter_calculatorInput): Diopter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["diopter"]);
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


export interface Diopter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
