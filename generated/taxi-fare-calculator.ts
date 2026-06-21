// Auto-generated from taxi-fare-calculator-schema.json
import * as z from 'zod';

export interface Taxi_fare_calculatorInput {
  acilis: number;
  kmFiyati: number;
  dakikaFiyati: number;
  mesafe: number;
  sure: number;
  dataConfidence?: number;
}

export const Taxi_fare_calculatorInputSchema = z.object({
  acilis: z.number().min(0).default(10),
  kmFiyati: z.number().min(0).default(15),
  dakikaFiyati: z.number().min(0).default(3),
  mesafe: z.number().min(0).default(10),
  sure: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Taxi_fare_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.acilis + (input.mesafe * input.kmFiyati) + (input.sure * input.dakikaFiyati); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTaxi_fare_calculator(input: Taxi_fare_calculatorInput): Taxi_fare_calculatorOutput {
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


export interface Taxi_fare_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Taxi_fare_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

