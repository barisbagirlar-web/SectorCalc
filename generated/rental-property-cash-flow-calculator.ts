// Auto-generated from rental-property-cash-flow-calculator-schema.json
import * as z from 'zod';

export interface Rental_property_cash_flow_calculatorInput {
  dataConfidence?: number;
  brutKira: number;
  bosluk: number;
  isletme: number;
  kredi: number;
}

export const Rental_property_cash_flow_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  brutKira: z.number().min(0).default(10000),
  bosluk: z.number().min(0).max(100).default(5),
  isletme: z.number().min(0).default(2000),
  kredi: z.number().min(0).default(5000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rental_property_cash_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["brutKira"] * (1 - input["bosluk"] / 100)) - input["isletme"] - input["kredi"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateRental_property_cash_flow_calculator(input: Rental_property_cash_flow_calculatorInput): Rental_property_cash_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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

export interface Rental_property_cash_flow_calculatorOutput {
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

export const Rental_property_cash_flow_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
