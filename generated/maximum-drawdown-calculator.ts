// Auto-generated from maximum-drawdown-calculator-schema.json
import * as z from 'zod';

export interface Maximum_drawdown_calculatorInput {
  zirveDeger: number;
  dipDeger: number;
  dataConfidence?: number;
}

export const Maximum_drawdown_calculatorInputSchema = z.object({
  zirveDeger: z.number().min(0).default(100000),
  dipDeger: z.number().min(0).default(70000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Maximum_drawdown_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.zirveDeger - input.dipDeger) / Math.max(1, input.zirveDeger)) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMaximum_drawdown_calculator(input: Maximum_drawdown_calculatorInput): Maximum_drawdown_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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


export interface Maximum_drawdown_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Maximum_drawdown_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

