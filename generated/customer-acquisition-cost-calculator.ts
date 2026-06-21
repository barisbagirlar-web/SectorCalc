// Auto-generated from customer-acquisition-cost-calculator-schema.json
import * as z from 'zod';

export interface Customer_acquisition_cost_calculatorInput {
  pazarlama: number;
  satisGideri: number;
  yeniMusteri: number;
  dataConfidence?: number;
}

export const Customer_acquisition_cost_calculatorInputSchema = z.object({
  pazarlama: z.number().min(0).default(50000),
  satisGideri: z.number().min(0).default(30000),
  yeniMusteri: z.number().min(0).default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Customer_acquisition_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.pazarlama + input.satisGideri) / Math.max(1, input.yeniMusteri); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCustomer_acquisition_cost_calculator(input: Customer_acquisition_cost_calculatorInput): Customer_acquisition_cost_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Customer_acquisition_cost_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Customer_acquisition_cost_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

