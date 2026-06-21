// Auto-generated from economic-order-quantity-calculator-schema.json
import * as z from 'zod';

export interface Economic_order_quantity_calculatorInput {
  yillikTalep: number;
  siparisMaliyeti: number;
  tasimaMaliyeti: number;
  dataConfidence?: number;
}

export const Economic_order_quantity_calculatorInputSchema = z.object({
  yillikTalep: z.number().min(1).default(10000),
  siparisMaliyeti: z.number().min(0).default(100),
  tasimaMaliyeti: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Economic_order_quantity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(Math.max(0, (2 * input.yillikTalep * input.siparisMaliyeti) / Math.max(0.0001, input.tasimaMaliyeti))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEconomic_order_quantity_calculator(input: Economic_order_quantity_calculatorInput): Economic_order_quantity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inventory turnover metrics monthly.","Factor in seasonality for safety stock."];
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
    unit: "units",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Economic_order_quantity_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Economic_order_quantity_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "units",
  breakdownKeys: ["sonuc"],
} as const;

