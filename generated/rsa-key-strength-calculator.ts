// Auto-generated from rsa-key-strength-calculator-schema.json
import * as z from 'zod';

export interface Rsa_key_strength_calculatorInput {
  dataConfidence?: number;
  rsaAnahtarUzunlugu: number;
}

export const Rsa_key_strength_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  rsaAnahtarUzunlugu: z.number().min(0).default(2048),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rsa_key_strength_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["rsaAnahtarUzunlugu"] >= 15360 ? 256 : input["rsaAnahtarUzunlugu"] >= 7680 ? 192 : input["rsaAnahtarUzunlugu"] >= 3072 ? 128 : input["rsaAnahtarUzunlugu"] >= 2048 ? 112 : input["rsaAnahtarUzunlugu"] >= 1024 ? 80 : 56; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateRsa_key_strength_calculator(input: Rsa_key_strength_calculatorInput): Rsa_key_strength_calculatorOutput {
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
    unit: "bits",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Rsa_key_strength_calculatorOutput {
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

export const Rsa_key_strength_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "bits",
  breakdownKeys: [],
} as const;
