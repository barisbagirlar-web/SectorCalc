// Auto-generated from traffic-signal-delay-calculator-schema.json
import * as z from 'zod';

export interface Traffic_signal_delay_calculatorInput {
  dataConfidence?: number;
  donguSuresi: number;
  yesilSure: number;
  akisHizi: number;
  doygunAkis: number;
}

export const Traffic_signal_delay_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  donguSuresi: z.number().min(0).default(90),
  yesilSure: z.number().min(0).default(30),
  akisHizi: z.number().min(0).default(0.3),
  doygunAkis: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Traffic_signal_delay_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["donguSuresi"] * Math.pow((1 - input["yesilSure"]/Math.max(1,input["donguSuresi"])), 2)) / Math.max(0.0001, (2 * (1 - (input["akisHizi"]/Math.max(0.0001, input["doygunAkis"]))))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateTraffic_signal_delay_calculator(input: Traffic_signal_delay_calculatorInput): Traffic_signal_delay_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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
    unit: "s/veh",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Traffic_signal_delay_calculatorOutput {
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

export const Traffic_signal_delay_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "s/veh",
  breakdownKeys: [],
} as const;
