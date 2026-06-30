// Auto-generated from customs-duty-calculator-schema.json
import * as z from 'zod';

export interface Customs_duty_calculatorInput {
  dataConfidence?: number;
  cifBedel: number;
  gumrukOrani: number;
}

export const Customs_duty_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  cifBedel: z.number().min(0).default(50000),
  gumrukOrani: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Customs_duty_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["cifBedel"] * (input["gumrukOrani"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCustoms_duty_calculator(input: Customs_duty_calculatorInput): Customs_duty_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Factor in return rates and chargebacks.","Review platform fee schedules regularly."];
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

export interface Customs_duty_calculatorOutput {
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

export const Customs_duty_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
