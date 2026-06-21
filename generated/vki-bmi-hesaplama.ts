// Auto-generated from vki-bmi-hesaplama-schema.json
import * as z from 'zod';

export interface Vki_bmi_hesaplamaInput {
  agirlik: number;
  boy: number;
  dataConfidence?: number;
}

export const Vki_bmi_hesaplamaInputSchema = z.object({
  agirlik: z.number().min(20).max(300).default(75),
  boy: z.number().min(0.5).max(2.5).default(1.75),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vki_bmi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.agirlik / Math.max(0.0001, (input.boy * input.boy)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateVki_bmi_hesaplama(input: Vki_bmi_hesaplamaInput): Vki_bmi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult a healthcare professional before starting any diet or exercise program.","Individual results may vary."];
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
    unit: "kg/m2",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Vki_bmi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vki_bmi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg/m2",
  breakdownKeys: ["sonuc"],
} as const;

