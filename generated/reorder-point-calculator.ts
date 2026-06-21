// Auto-generated from reorder-point-calculator-schema.json
import * as z from 'zod';

export interface Reorder_point_calculatorInput {
  ortTalep: number;
  stdSapma: number;
  tedarikSure: number;
  Z: number;
  dataConfidence?: number;
}

export const Reorder_point_calculatorInputSchema = z.object({
  ortTalep: z.number().min(0).default(100),
  stdSapma: z.number().min(0).default(20),
  tedarikSure: z.number().min(0).default(7),
  Z: z.number().min(0).default(1.65),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Reorder_point_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Z * input.stdSapma * Math.sqrt(Math.max(0, input.tedarikSure)); results["ss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ss"] = Number.NaN; }
  try { const v = (input.ortTalep * input.tedarikSure) + (input.Z * input.stdSapma * Math.sqrt(Math.max(0, input.tedarikSure))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateReorder_point_calculator(input: Reorder_point_calculatorInput): Reorder_point_calculatorOutput {
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


export interface Reorder_point_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Reorder_point_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "units",
  breakdownKeys: ["sonuc"],
} as const;

