// Auto-generated from opportunity-cost-calculator-schema.json
import * as z from 'zod';

export interface Opportunity_cost_calculatorInput {
  tercihEdilenGetiri: number;
  vazgecilenGetiri: number;
  dataConfidence?: number;
}

export const Opportunity_cost_calculatorInputSchema = z.object({
  tercihEdilenGetiri: z.number().min(0).default(15000),
  vazgecilenGetiri: z.number().min(0).default(25000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Opportunity_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vazgecilenGetiri - input.tercihEdilenGetiri; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateOpportunity_cost_calculator(input: Opportunity_cost_calculatorInput): Opportunity_cost_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Opportunity_cost_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Opportunity_cost_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

