// Auto-generated from warehouse-capacity-calculator-schema.json
import * as z from 'zod';

export interface Warehouse_capacity_calculatorInput {
  dataConfidence?: number;
  toplamAlan: number;
  rafKullanimi: number;
  paletAlani: number;
}

export const Warehouse_capacity_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  toplamAlan: z.number().min(0).default(5000),
  rafKullanimi: z.number().min(0).max(100).default(60),
  paletAlani: z.number().min(0).default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Warehouse_capacity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor((input["toplamAlan"] * (input["rafKullanimi"] / 100)) / Math.max(0.0001, input["paletAlani"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateWarehouse_capacity_calculator(input: Warehouse_capacity_calculatorInput): Warehouse_capacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inventory turnover metrics monthly.","Factor in seasonality for safety stock."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "pallets",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Warehouse_capacity_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Warehouse_capacity_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "pallets",
  breakdownKeys: [],
} as const;
