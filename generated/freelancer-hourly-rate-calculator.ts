// Auto-generated from freelancer-hourly-rate-calculator-schema.json
import * as z from 'zod';

export interface Freelancer_hourly_rate_calculatorInput {
  hedefNet: number;
  vergi: number;
  gider: number;
  calismaSaati: number;
  dataConfidence?: number;
}

export const Freelancer_hourly_rate_calculatorInputSchema = z.object({
  hedefNet: z.number().min(0).default(300000),
  vergi: z.number().min(0).max(100).default(25),
  gider: z.number().min(0).default(50000),
  calismaSaati: z.number().min(1).default(1800),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Freelancer_hourly_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hedefNet + input.gider) / Math.max(0.0001, (1 - input.vergi / 100)); results["brutHedef"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["brutHedef"] = Number.NaN; }
  try { const v = ((input.hedefNet + input.gider) / Math.max(0.0001, (1 - input.vergi / 100))) / Math.max(1, input.calismaSaati); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateFreelancer_hourly_rate_calculator(input: Freelancer_hourly_rate_calculatorInput): Freelancer_hourly_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "TRY/hour",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Freelancer_hourly_rate_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Freelancer_hourly_rate_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY/hour",
  breakdownKeys: ["sonuc"],
} as const;

