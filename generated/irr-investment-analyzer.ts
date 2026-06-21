// Auto-generated from irr-investment-analyzer-schema.json
import * as z from 'zod';

export interface Irr_investment_analyzerInput {
  cashFlows: number;
  initialGuess: number;
  maxIterations: number;
  tolerance: number;
  reinvestmentRate: number;
  financeRate: number;
  dataConfidence?: number;
}

export const Irr_investment_analyzerInputSchema = z.object({
  cashFlows: z.number().min(0).default(0),
  initialGuess: z.number().min(0).default(0),
  maxIterations: z.number().min(0).default(0),
  tolerance: z.number().min(0).default(0),
  reinvestmentRate: z.number().min(0).default(0),
  financeRate: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Irr_investment_analyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maxIterations * input.cashFlows; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.maxIterations * input.cashFlows * (1 + (input.initialGuess / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.maxIterations * input.cashFlows * (1 + (input.initialGuess / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateIrr_investment_analyzer(input: Irr_investment_analyzerInput): Irr_investment_analyzerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"])
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Irr_investment_analyzerOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Irr_investment_analyzerOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost"],
} as const;

