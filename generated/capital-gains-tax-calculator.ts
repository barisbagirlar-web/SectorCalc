// Auto-generated from capital-gains-tax-calculator-schema.json
import * as z from 'zod';

export interface Capital_gains_tax_calculatorInput {
  satis: number;
  alis: number;
  vergiOrani: number;
  istisna: number;
  dataConfidence?: number;
}

export const Capital_gains_tax_calculatorInputSchema = z.object({
  satis: z.number().min(0).default(500000),
  alis: z.number().min(0).default(300000),
  vergiOrani: z.number().min(0).max(100).default(15),
  istisna: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Capital_gains_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.satis - input.alis - input.istisna); results["matrah"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["matrah"] = Number.NaN; }
  try { const v = Math.max(0, (input.satis - input.alis - input.istisna)) * input.vergiOrani / 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCapital_gains_tax_calculator(input: Capital_gains_tax_calculatorInput): Capital_gains_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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


export interface Capital_gains_tax_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Capital_gains_tax_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

