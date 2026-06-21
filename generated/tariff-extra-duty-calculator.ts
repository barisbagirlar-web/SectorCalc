// Auto-generated from tariff-extra-duty-calculator-schema.json
import * as z from 'zod';

export interface Tariff_extra_duty_calculatorInput {
  urunBedeli: number;
  ekVergi: number;
  dataConfidence?: number;
}

export const Tariff_extra_duty_calculatorInputSchema = z.object({
  urunBedeli: z.number().min(0).default(50000),
  ekVergi: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tariff_extra_duty_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.urunBedeli * (input.ekVergi / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTariff_extra_duty_calculator(input: Tariff_extra_duty_calculatorInput): Tariff_extra_duty_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Factor in return rates and chargebacks.","Review platform fee schedules regularly."];
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Tariff_extra_duty_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tariff_extra_duty_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

