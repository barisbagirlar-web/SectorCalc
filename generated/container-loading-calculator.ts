// Auto-generated from container-loading-calculator-schema.json
import * as z from 'zod';

export interface Container_loading_calculatorInput {
  dataConfidence?: number;
  konteynerHacim: number;
  kutuHacim: number;
  istifleme: number;
}

export const Container_loading_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  konteynerHacim: z.number().min(0).default(33),
  kutuHacim: z.number().min(0).default(0.036),
  istifleme: z.number().min(0).max(100).default(85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Container_loading_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor((input["konteynerHacim"] * (input["istifleme"] / 100)) / Math.max(0.0001, input["kutuHacim"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateContainer_loading_calculator(input: Container_loading_calculatorInput): Container_loading_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inventory turnover metrics monthly.","Factor in seasonality for safety stock."];
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
    unit: "boxes",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Container_loading_calculatorOutput {
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

export const Container_loading_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "boxes",
  breakdownKeys: [],
} as const;
