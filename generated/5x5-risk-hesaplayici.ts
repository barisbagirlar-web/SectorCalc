// Auto-generated from 5x5-risk-hesaplayici-schema.json
import * as z from 'zod';

export interface _5x5_risk_hesaplayiciInput {
  maxWeight: number;
  dataConfidence?: number;
}

export const _5x5_risk_hesaplayiciInputSchema = z.object({
  maxWeight: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _5x5_risk_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(input.maxWeight / 100, 2) * 100 + Math.sqrt(input.maxWeight) * 2; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = Math.pow(input.maxWeight / 100, 2) * 100 + Math.sqrt(input.maxWeight) * 2; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculate_5x5_risk_hesaplayici(input: _5x5_risk_hesaplayiciInput): _5x5_risk_hesaplayiciOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "kg",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface _5x5_risk_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const _5x5_risk_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["result"],
} as const;

