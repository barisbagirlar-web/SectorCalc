// Auto-generated from hp-kw-hesaplayici-schema.json
import * as z from 'zod';

export interface Hp_kw_hesaplayiciInput {
  powerOutput: number;
  torqueValue: number;
  dataConfidence?: number;
}

export const Hp_kw_hesaplayiciInputSchema = z.object({
  powerOutput: z.number().min(0).default(100),
  torqueValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hp_kw_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerOutput * input.torqueValue + Math.floor(input.powerOutput / input.torqueValue) * 0.5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.powerOutput * input.torqueValue + Math.floor(input.powerOutput / input.torqueValue) * 0.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateHp_kw_hesaplayici(input: Hp_kw_hesaplayiciInput): Hp_kw_hesaplayiciOutput {
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
    unit: "hp",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Hp_kw_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hp_kw_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "hp",
  breakdownKeys: ["result"],
} as const;

