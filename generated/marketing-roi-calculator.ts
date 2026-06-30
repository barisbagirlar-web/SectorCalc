// Auto-generated from marketing-roi-calculator-schema.json
import * as z from 'zod';

export interface Marketing_roi_calculatorInput {
  dataConfidence?: number;
  kampanyaGeliri: number;
  kampanyaMaliyeti: number;
}

export const Marketing_roi_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kampanyaGeliri: z.number().min(0).default(200000),
  kampanyaMaliyeti: z.number().min(0).default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Marketing_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input["kampanyaGeliri"] - input["kampanyaMaliyeti"]) / Math.max(0.0001, input["kampanyaMaliyeti"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMarketing_roi_calculator(input: Marketing_roi_calculatorInput): Marketing_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Marketing_roi_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Marketing_roi_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
