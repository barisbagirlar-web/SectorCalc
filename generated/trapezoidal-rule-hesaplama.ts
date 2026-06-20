// Auto-generated from trapezoidal-rule-hesaplama-schema.json
import * as z from 'zod';

export interface Trapezoidal_rule_hesaplamaInput {
  totalValue: number;
  percentage: number;
  dataConfidence?: number;
}

export const Trapezoidal_rule_hesaplamaInputSchema = z.object({
  totalValue: z.number().min(0).default(100),
  percentage: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Trapezoidal_rule_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * input.totalValue * input.percentage + Math.pow(input.totalValue, 2) * input.percentage / 1000; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = Math.PI * input.totalValue * input.percentage + Math.pow(input.totalValue, 2) * input.percentage / 1000; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateTrapezoidal_rule_hesaplama(input: Trapezoidal_rule_hesaplamaInput): Trapezoidal_rule_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Trapezoidal_rule_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Trapezoidal_rule_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["result"],
} as const;

