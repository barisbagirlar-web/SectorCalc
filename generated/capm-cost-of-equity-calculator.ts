// Auto-generated from capm-cost-of-equity-calculator-schema.json
import * as z from 'zod';

export interface Capm_cost_of_equity_calculatorInput {
  risksizFaiz: number;
  beta: number;
  piyasaPrimi: number;
  dataConfidence?: number;
}

export const Capm_cost_of_equity_calculatorInputSchema = z.object({
  risksizFaiz: z.number().min(0).default(8),
  beta: z.number().min(0).default(1.2),
  piyasaPrimi: z.number().min(0).default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Capm_cost_of_equity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.risksizFaiz + input.beta * input.piyasaPrimi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCapm_cost_of_equity_calculator(input: Capm_cost_of_equity_calculatorInput): Capm_cost_of_equity_calculatorOutput {
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


export interface Capm_cost_of_equity_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Capm_cost_of_equity_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

