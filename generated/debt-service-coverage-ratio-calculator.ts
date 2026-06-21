// Auto-generated from debt-service-coverage-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_service_coverage_ratio_calculatorInput {
  netIsletmeGeliri: number;
  yillikBorcOdemesi: number;
  dataConfidence?: number;
}

export const Debt_service_coverage_ratio_calculatorInputSchema = z.object({
  netIsletmeGeliri: z.number().min(0).default(200000),
  yillikBorcOdemesi: z.number().min(0).default(120000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Debt_service_coverage_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netIsletmeGeliri / Math.max(1, input.yillikBorcOdemesi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDebt_service_coverage_ratio_calculator(input: Debt_service_coverage_ratio_calculatorInput): Debt_service_coverage_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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
    unit: "ratio",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Debt_service_coverage_ratio_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Debt_service_coverage_ratio_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

