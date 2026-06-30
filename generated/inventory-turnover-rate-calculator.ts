// Auto-generated from inventory-turnover-rate-calculator-schema.json
import * as z from 'zod';

export interface Inventory_turnover_rate_calculatorInput {
  dataConfidence?: number;
  yillikCOGS: number;
  ortStok: number;
}

export const Inventory_turnover_rate_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yillikCOGS: z.number().min(0).default(1000000),
  ortStok: z.number().min(0).default(200000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Inventory_turnover_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["yillikCOGS"] / Math.max(0.0001, input["ortStok"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateInventory_turnover_rate_calculator(input: Inventory_turnover_rate_calculatorInput): Inventory_turnover_rate_calculatorOutput {
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
    unit: "times",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Inventory_turnover_rate_calculatorOutput {
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

export const Inventory_turnover_rate_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "times",
  breakdownKeys: [],
} as const;
