// Auto-generated from confidence-interval-calculator-schema.json
import * as z from 'zod';

export interface Confidence_interval_calculatorInput {
  dataConfidence?: number;
  ortalama: number;
  stdHata: number;
  guvenSeviyesi: number;
}

export const Confidence_interval_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  ortalama: z.number().min(0).default(100),
  stdHata: z.number().min(0).default(5),
  guvenSeviyesi: z.number().min(1).max(99.9).default(95),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Confidence_interval_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["guvenSeviyesi"] >= 99 ? 2.576 : input["guvenSeviyesi"] >= 95 ? 1.96 : 1.645; results["Z"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Z"] = Number.NaN; }
  try { const v = input["ortalama"] - (input["guvenSeviyesi"] >= 99 ? 2.576 : input["guvenSeviyesi"] >= 95 ? 1.96 : 1.645) * input["stdHata"]; results["alt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alt"] = Number.NaN; }
  try { const v = input["ortalama"] + (input["guvenSeviyesi"] >= 99 ? 2.576 : input["guvenSeviyesi"] >= 95 ? 1.96 : 1.645) * input["stdHata"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateConfidence_interval_calculator(input: Confidence_interval_calculatorInput): Confidence_interval_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "alt": toNumericFormulaValue(values["alt"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify statistical assumptions before making decisions.","Use larger sample sizes for better accuracy."];
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
    unit: "number",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Confidence_interval_calculatorOutput {
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

export const Confidence_interval_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "number",
  breakdownKeys: ["Z","alt"],
} as const;
