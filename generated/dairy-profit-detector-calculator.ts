// Auto-generated from dairy-profit-detector-calculator-schema.json
import * as z from 'zod';

export interface Dairy_profit_detector_calculatorInput {
  milk_volume_liters: number;
  fat_percentage: number;
  protein_percentage: number;
  selling_price_per_liter: number;
  production_cost_per_liter: number;
  waste_percentage: number;
  labor_hours_per_day: number;
  labor_rate_per_hour: number;
  dataConfidence?: number;
}

export const Dairy_profit_detector_calculatorInputSchema = z.object({
  milk_volume_liters: z.number().min(0).max(1000000).default(10000),
  fat_percentage: z.number().min(0).max(10).default(3.5),
  protein_percentage: z.number().min(0).max(6).default(3.2),
  selling_price_per_liter: z.number().min(0).max(10).default(0.45),
  production_cost_per_liter: z.number().min(0).max(10).default(0.35),
  waste_percentage: z.number().min(0).max(20).default(2),
  labor_hours_per_day: z.number().min(0).max(500).default(40),
  labor_rate_per_hour: z.number().min(0).max(100).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dairy_profit_detector_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.milk_volume_liters * (input.fat_percentage / 100) * (input.protein_percentage / 100) * input.selling_price_per_liter; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.milk_volume_liters * (input.fat_percentage / 100) * (input.protein_percentage / 100) * input.selling_price_per_liter * (input.production_cost_per_liter * (input.waste_percentage / 100) * input.labor_hours_per_day * (input.labor_rate_per_hour / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.production_cost_per_liter * (input.waste_percentage / 100) * input.labor_hours_per_day * (input.labor_rate_per_hour / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateDairy_profit_detector_calculator(input: Dairy_profit_detector_calculatorInput): Dairy_profit_detector_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Automated root cause alerts"],
  };
}


export interface Dairy_profit_detector_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Dairy_profit_detector_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

