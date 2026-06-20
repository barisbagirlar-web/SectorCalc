// Auto-generated from stok-hesaplama-schema.json
import * as z from 'zod';

export interface Stok_hesaplamaInput {
  warehouseArea: number;
  dataConfidence?: number;
}

export const Stok_hesaplamaInputSchema = z.object({
  warehouseArea: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stok_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.warehouseArea * (1 + input.warehouseArea/500) + Math.sqrt(input.warehouseArea) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.warehouseArea * (1 + input.warehouseArea/500) + Math.sqrt(input.warehouseArea) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateStok_hesaplama(input: Stok_hesaplamaInput): Stok_hesaplamaOutput {
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
    unit: "m²",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Stok_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Stok_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "m²",
  breakdownKeys: ["result"],
} as const;

