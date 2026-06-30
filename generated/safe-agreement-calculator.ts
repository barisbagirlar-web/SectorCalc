// Auto-generated from safe-agreement-calculator-schema.json
import * as z from 'zod';

export interface Safe_agreement_calculatorInput {
  dataConfidence?: number;
  yatirim: number;
  tavanDeger: number;
  toplamHisse: number;
}

export const Safe_agreement_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yatirim: z.number().min(0).default(500000),
  tavanDeger: z.number().min(0).default(5000000),
  toplamHisse: z.number().min(0).default(1000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Safe_agreement_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["tavanDeger"] / Math.max(1, input["toplamHisse"]); results["donusumFiyati"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["donusumFiyati"] = Number.NaN; }
  try { const v = input["yatirim"] / Math.max(0.0001, (input["tavanDeger"] / Math.max(1, input["toplamHisse"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSafe_agreement_calculator(input: Safe_agreement_calculatorInput): Safe_agreement_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "shares",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Safe_agreement_calculatorOutput {
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

export const Safe_agreement_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "shares",
  breakdownKeys: ["donusumFiyati"],
} as const;
