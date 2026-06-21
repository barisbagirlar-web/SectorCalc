// Auto-generated from equity-dilution-calculator-schema.json
import * as z from 'zod';

export interface Equity_dilution_calculatorInput {
  mevcutHisse: number;
  yeniHisse: number;
  dataConfidence?: number;
}

export const Equity_dilution_calculatorInputSchema = z.object({
  mevcutHisse: z.number().min(0).default(1000000),
  yeniHisse: z.number().min(0).default(200000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Equity_dilution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yeniHisse / Math.max(1, (input.mevcutHisse + input.yeniHisse)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEquity_dilution_calculator(input: Equity_dilution_calculatorInput): Equity_dilution_calculatorOutput {
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


export interface Equity_dilution_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Equity_dilution_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

