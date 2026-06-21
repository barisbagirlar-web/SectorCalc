// Auto-generated from scrap-rate-optimization-calculator-schema.json
import * as z from 'zod';

export interface Scrap_rate_optimization_calculatorInput {
  uretim: number;
  hurda: number;
  birimMaliyet: number;
  dataConfidence?: number;
}

export const Scrap_rate_optimization_calculatorInputSchema = z.object({
  uretim: z.number().min(1).default(10000),
  hurda: z.number().min(0).default(500),
  birimMaliyet: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Scrap_rate_optimization_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hurda / Math.max(1, input.uretim)) * 100; results["oran"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oran"] = Number.NaN; }
  try { const v = input.hurda * input.birimMaliyet; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateScrap_rate_optimization_calculator(input: Scrap_rate_optimization_calculatorInput): Scrap_rate_optimization_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Scrap_rate_optimization_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Scrap_rate_optimization_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

