// Auto-generated from kisa-donem-kiralama-hesaplayici-schema.json
import * as z from 'zod';

export interface Kisa_donem_kiralama_hesaplayiciInput {
  investment: number;
  returnRate: number;
  dataConfidence?: number;
}

export const Kisa_donem_kiralama_hesaplayiciInputSchema = z.object({
  investment: z.number().min(0).default(10000),
  returnRate: z.number().min(-100).max(10000).default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kisa_donem_kiralama_hesaplayiciInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.investment * (1 + input.returnRate/100); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.investment * (1 + input.returnRate/100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateKisa_donem_kiralama_hesaplayici(input: Kisa_donem_kiralama_hesaplayiciInput): Kisa_donem_kiralama_hesaplayiciOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Kisa_donem_kiralama_hesaplayiciOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kisa_donem_kiralama_hesaplayiciOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["result"],
} as const;

