// Auto-generated from customer-lifetime-value-calculator-schema.json
import * as z from 'zod';

export interface Customer_lifetime_value_calculatorInput {
  dataConfidence?: number;
  ortSiparis: number;
  siklik: number;
  omur: number;
  marj: number;
}

export const Customer_lifetime_value_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  ortSiparis: z.number().min(0).default(100),
  siklik: z.number().min(1).default(12),
  omur: z.number().min(0).default(3),
  marj: z.number().min(0).max(100).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Customer_lifetime_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["ortSiparis"] * input["siklik"] * input["omur"] * (input["marj"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCustomer_lifetime_value_calculator(input: Customer_lifetime_value_calculatorInput): Customer_lifetime_value_calculatorOutput {
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

export interface Customer_lifetime_value_calculatorOutput {
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

export const Customer_lifetime_value_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
