// Auto-generated from bottleneck-analysis-calculator-schema.json
import * as z from 'zod';

export interface Bottleneck_analysis_calculatorInput {
  istasyon1: number;
  istasyon2: number;
  istasyon3: number;
  dataConfidence?: number;
}

export const Bottleneck_analysis_calculatorInputSchema = z.object({
  istasyon1: z.number().min(0).default(45),
  istasyon2: z.number().min(0).default(60),
  istasyon3: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bottleneck_analysis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(input.istasyon1, input.istasyon2, input.istasyon3); results["darbogaz"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["darbogaz"] = Number.NaN; }
  try { const v = 60 / Math.max(0.0001, Math.max(input.istasyon1, input.istasyon2, input.istasyon3)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBottleneck_analysis_calculator(input: Bottleneck_analysis_calculatorInput): Bottleneck_analysis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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
    unit: "units/hour",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Bottleneck_analysis_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Bottleneck_analysis_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "units/hour",
  breakdownKeys: ["sonuc"],
} as const;

