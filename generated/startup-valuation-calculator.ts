// Auto-generated from startup-valuation-calculator-schema.json
import * as z from 'zod';

export interface Startup_valuation_calculatorInput {
  dataConfidence?: number;
  yatirim: number;
  hisseOrani: number;
}

export const Startup_valuation_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yatirim: z.number().min(0).default(1000000),
  hisseOrani: z.number().min(0.1).max(99).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Startup_valuation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["yatirim"] / Math.max(0.0001, input["hisseOrani"] / 100); results["degerlemeSonrasi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["degerlemeSonrasi"] = Number.NaN; }
  try { const v = (input["yatirim"] / Math.max(0.0001, input["hisseOrani"] / 100)) - input["yatirim"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateStartup_valuation_calculator(input: Startup_valuation_calculatorInput): Startup_valuation_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Startup_valuation_calculatorOutput {
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

export const Startup_valuation_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["degerlemeSonrasi"],
} as const;
