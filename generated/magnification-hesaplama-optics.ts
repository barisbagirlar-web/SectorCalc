// Auto-generated from magnification-hesaplama-optics-schema.json
import * as z from 'zod';

export interface Magnification_hesaplama_opticsInput {
  focalLength: number;
  dataConfidence?: number;
}

export const Magnification_hesaplama_opticsInputSchema = z.object({
  focalLength: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Magnification_hesaplama_opticsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.focalLength * (1 + input.focalLength/500) + Math.sqrt(input.focalLength) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.focalLength * (1 + input.focalLength/500) + Math.sqrt(input.focalLength) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMagnification_hesaplama_optics(input: Magnification_hesaplama_opticsInput): Magnification_hesaplama_opticsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "mm",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Magnification_hesaplama_opticsOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Magnification_hesaplama_opticsOutputMeta = {
  primaryKey: "result",
  unit: "mm",
  breakdownKeys: ["result"],
} as const;

