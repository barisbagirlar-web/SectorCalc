// Auto-generated from operating-margin-calculator-schema.json
import * as z from 'zod';

export interface Operating_margin_calculatorInput {
  favok: number;
  ciro: number;
  dataConfidence?: number;
}

export const Operating_margin_calculatorInputSchema = z.object({
  favok: z.number().min(0).default(300000),
  ciro: z.number().min(0).default(1000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Operating_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.favok / Math.max(0.0001, input.ciro)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOperating_margin_calculator(input: Operating_margin_calculatorInput): Operating_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Operating_margin_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Operating_margin_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

