// Auto-generated from effective-radiation-dose-calculator-schema.json
import * as z from 'zod';

export interface Effective_radiation_dose_calculatorInput {
  dataConfidence?: number;
  sozurulenDoz: number;
  dokuAgirlikFaktoru: number;
  radyasyonTuruFaktoru: number;
}

export const Effective_radiation_dose_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  sozurulenDoz: z.number().min(0).default(10),
  dokuAgirlikFaktoru: z.number().min(0).default(0.12),
  radyasyonTuruFaktoru: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Effective_radiation_dose_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["sozurulenDoz"] * input["dokuAgirlikFaktoru"] * input["radyasyonTuruFaktoru"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateEffective_radiation_dose_calculator(input: Effective_radiation_dose_calculatorInput): Effective_radiation_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low SLA indicates service reliability issue.","High latency degrades user experience."];
  const suggestedActions: string[] = ["Monitor system performance regularly.","Implement redundancy for critical infrastructure."];
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
    unit: "mSv",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Effective_radiation_dose_calculatorOutput {
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

export const Effective_radiation_dose_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "mSv",
  breakdownKeys: [],
} as const;
