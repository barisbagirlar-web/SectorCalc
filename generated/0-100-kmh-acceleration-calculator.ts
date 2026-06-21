// Auto-generated from 0-100-kmh-acceleration-calculator-schema.json
import * as z from 'zod';

export interface _0_100_kmh_acceleration_calculatorInput {
  kutle: number;
  tork: number;
  cekisKatsayisi: number;
  havaDirenci: number;
  dataConfidence?: number;
}

export const _0_100_kmh_acceleration_calculatorInputSchema = z.object({
  kutle: z.number().min(0).default(1500),
  tork: z.number().min(0).default(300),
  cekisKatsayisi: z.number().min(0).default(0.8),
  havaDirenci: z.number().min(0).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _0_100_kmh_acceleration_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.tork * input.cekisKatsayisi) - input.havaDirenci) / Math.max(0.0001, input.kutle); results["ivme"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ivme"] = Number.NaN; }
  try { const v = (100 / 3.6) / Math.max(0.0001, (toNumericFormulaValue(results["ivme"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculate_0_100_kmh_acceleration_calculator(input: _0_100_kmh_acceleration_calculatorInput): _0_100_kmh_acceleration_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High fuel/energy consumption indicates efficiency losses."];
  const suggestedActions: string[] = ["Regular maintenance improves overall equipment efficiency.","Simulate real-world driving conditions for accurate range estimates."];
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface _0_100_kmh_acceleration_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const _0_100_kmh_acceleration_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: ["sonuc"],
} as const;

