// Auto-generated from ev-charging-time-calculator-schema.json
import * as z from 'zod';

export interface Ev_charging_time_calculatorInput {
  dataConfidence?: number;
  bataryaKapasite: number;
  sarjGuc: number;
  verim: number;
}

export const Ev_charging_time_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  bataryaKapasite: z.number().min(0).default(60),
  sarjGuc: z.number().min(0).default(7.4),
  verim: z.number().min(0).default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ev_charging_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["bataryaKapasite"] / Math.max(0.0001, (input["sarjGuc"] * (input["verim"] / 100))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateEv_charging_time_calculator(input: Ev_charging_time_calculatorInput): Ev_charging_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High fuel/energy consumption indicates efficiency losses."];
  const suggestedActions: string[] = ["Regular maintenance improves overall equipment efficiency.","Simulate real-world driving conditions for accurate range estimates."];
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
    unit: "hours",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Ev_charging_time_calculatorOutput {
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

export const Ev_charging_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "hours",
  breakdownKeys: [],
} as const;
