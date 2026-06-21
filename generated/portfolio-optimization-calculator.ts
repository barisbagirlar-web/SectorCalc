// Auto-generated from portfolio-optimization-calculator-schema.json
import * as z from 'zod';

export interface Portfolio_optimization_calculatorInput {
  beklenenGetiri: number;
  beklenenRisk: number;
  dataConfidence?: number;
}

export const Portfolio_optimization_calculatorInputSchema = z.object({
  beklenenGetiri: z.number().min(0).default(12),
  beklenenRisk: z.number().min(0).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Portfolio_optimization_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.beklenenGetiri / Math.max(0.0001, input.beklenenRisk); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePortfolio_optimization_calculator(input: Portfolio_optimization_calculatorInput): Portfolio_optimization_calculatorOutput {
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
    unit: "ratio",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Portfolio_optimization_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Portfolio_optimization_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

