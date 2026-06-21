// Auto-generated from ev-range-calculator-schema.json
import * as z from 'zod';

export interface Ev_range_calculatorInput {
  bataryaEnerji: number;
  tuketim: number;
  verim: number;
  dataConfidence?: number;
}

export const Ev_range_calculatorInputSchema = z.object({
  bataryaEnerji: z.number().min(0).default(60),
  tuketim: z.number().min(0).default(180),
  verim: z.number().min(0).default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ev_range_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.bataryaEnerji * 1000 * (input.verim / 100)) / Math.max(0.0001, input.tuketim); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEv_range_calculator(input: Ev_range_calculatorInput): Ev_range_calculatorOutput {
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
    unit: "km",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ev_range_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ev_range_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "km",
  breakdownKeys: ["sonuc"],
} as const;

