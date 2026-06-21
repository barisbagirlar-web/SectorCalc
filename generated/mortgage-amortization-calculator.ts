// Auto-generated from mortgage-amortization-calculator-schema.json
import * as z from 'zod';

export interface Mortgage_amortization_calculatorInput {
  kredi: number;
  faiz: number;
  vade: number;
  donem: number;
  dataConfidence?: number;
}

export const Mortgage_amortization_calculatorInputSchema = z.object({
  kredi: z.number().min(0).default(1000000),
  faiz: z.number().min(0).default(12),
  vade: z.number().min(1).default(120),
  donem: z.number().min(1).default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mortgage_amortization_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faiz === 0 ? input.kredi / Math.max(1, input.vade) : input.kredi * ((input.faiz / 1200) / (1 - Math.pow(1 + input.faiz / 1200, -input.vade))); results["taksit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taksit"] = Number.NaN; }
  try { const v = input.faiz === 0 ? Math.max(0, input.kredi - (input.donem - 1) * (input.kredi / Math.max(1, input.vade))) : input.kredi * (Math.pow(1 + input.faiz / 1200, input.donem - 1) - Math.pow(1 + input.faiz / 1200, input.vade)) / (1 - Math.pow(1 + input.faiz / 1200, input.vade)); results["kalanAnapara"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kalanAnapara"] = Number.NaN; }
  try { const v = input.faiz === 0 ? input.kredi / Math.max(1, input.vade) : input.kredi * Math.pow(1 + input.faiz / 1200, input.donem - 1) * (1 - 1 / (1 + input.faiz / 1200)) / (1 - Math.pow(1 + input.faiz / 1200, -input.vade)) / (input.faiz / 1200); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMortgage_amortization_calculator(input: Mortgage_amortization_calculatorInput): Mortgage_amortization_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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


export interface Mortgage_amortization_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mortgage_amortization_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

