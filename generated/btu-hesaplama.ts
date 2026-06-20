// Auto-generated from btu-hesaplama-schema.json
import * as z from 'zod';

export interface Btu_hesaplamaInput {
  powerValue: number;
  dataConfidence?: number;
}

export const Btu_hesaplamaInputSchema = z.object({
  powerValue: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Btu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerValue * (1 + input.powerValue/500) + Math.sqrt(input.powerValue) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.powerValue * (1 + input.powerValue/500) + Math.sqrt(input.powerValue) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBtu_hesaplama(input: Btu_hesaplamaInput): Btu_hesaplamaOutput {
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
    unit: "W",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Btu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Btu_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "W",
  breakdownKeys: ["result"],
} as const;

