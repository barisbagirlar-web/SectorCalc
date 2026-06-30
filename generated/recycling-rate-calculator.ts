// Auto-generated from recycling-rate-calculator-schema.json
import * as z from 'zod';

export interface Recycling_rate_calculatorInput {
  dataConfidence?: number;
  geriDonusen: number;
  toplamAtik: number;
}

export const Recycling_rate_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  geriDonusen: z.number().min(0).default(300),
  toplamAtik: z.number().min(0).default(1000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recycling_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["geriDonusen"] / Math.max(0.0001, input["toplamAtik"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateRecycling_rate_calculator(input: Recycling_rate_calculatorInput): Recycling_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High environmental score may reduce operational costs.","Low ESG score may increase capital costs."];
  const suggestedActions: string[] = ["Set improvement targets for each ESG pillar.","Consider carbon offset programs for residual emissions."];
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

export interface Recycling_rate_calculatorOutput {
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

export const Recycling_rate_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
