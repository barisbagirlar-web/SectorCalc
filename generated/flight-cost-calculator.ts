// Auto-generated from flight-cost-calculator-schema.json
import * as z from 'zod';

export interface Flight_cost_calculatorInput {
  mesafe: number;
  yolcuSayisi: number;
  koltukMaliyeti: number;
  dataConfidence?: number;
}

export const Flight_cost_calculatorInputSchema = z.object({
  mesafe: z.number().min(0).default(3000),
  yolcuSayisi: z.number().min(1).default(180),
  koltukMaliyeti: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Flight_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mesafe * input.koltukMaliyeti; results["toplam"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toplam"] = Number.NaN; }
  try { const v = (input.mesafe * input.koltukMaliyeti) / Math.max(1, input.yolcuSayisi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFlight_cost_calculator(input: Flight_cost_calculatorInput): Flight_cost_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Flight_cost_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Flight_cost_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

