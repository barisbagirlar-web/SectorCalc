// Auto-generated from eu-import-vat-calculator-schema.json
import * as z from 'zod';

export interface Eu_import_vat_calculatorInput {
  netFiyat: number;
  kargo: number;
  ulkeKDV: number;
  dataConfidence?: number;
}

export const Eu_import_vat_calculatorInputSchema = z.object({
  netFiyat: z.number().min(0).default(100),
  kargo: z.number().min(0).default(15),
  ulkeKDV: z.number().min(0).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Eu_import_vat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.netFiyat + input.kargo) * (input.ulkeKDV / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateEu_import_vat_calculator(input: Eu_import_vat_calculatorInput): Eu_import_vat_calculatorOutput {
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
    unit: "EUR",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Eu_import_vat_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Eu_import_vat_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "EUR",
  breakdownKeys: ["sonuc"],
} as const;

