// Auto-generated from contribution-margin-calculator-schema.json
import * as z from 'zod';

export interface Contribution_margin_calculatorInput {
  dataConfidence?: number;
  satisFiyati: number;
  degiskenMaliyet: number;
}

export const Contribution_margin_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  satisFiyati: z.number().min(0).default(100),
  degiskenMaliyet: z.number().min(0).default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Contribution_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["satisFiyati"] - input["degiskenMaliyet"]; results["katki"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["katki"] = Number.NaN; }
  try { const v = ((input["satisFiyati"] - input["degiskenMaliyet"]) / Math.max(0.0001, input["satisFiyati"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateContribution_margin_calculator(input: Contribution_margin_calculatorInput): Contribution_margin_calculatorOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Contribution_margin_calculatorOutput {
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

export const Contribution_margin_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["katki"],
} as const;
