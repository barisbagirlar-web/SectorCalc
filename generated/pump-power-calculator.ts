// Auto-generated from pump-power-calculator-schema.json
import * as z from 'zod';

export interface Pump_power_calculatorInput {
  debi: number;
  yukseklik: number;
  verim: number;
  dataConfidence?: number;
}

export const Pump_power_calculatorInputSchema = z.object({
  debi: z.number().min(0).default(10),
  yukseklik: z.number().min(0).default(50),
  verim: z.number().min(0).default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pump_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.debi * input.yukseklik * 9.81) / Math.max(0.0001, (3600 * (input.verim / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePump_power_calculator(input: Pump_power_calculatorInput): Pump_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "kW",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Pump_power_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pump_power_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kW",
  breakdownKeys: ["sonuc"],
} as const;

