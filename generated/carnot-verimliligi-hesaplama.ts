// Auto-generated from carnot-verimliligi-hesaplama-schema.json
import * as z from 'zod';

export interface Carnot_verimliligi_hesaplamaInput {
  sicakKaynak: number;
  sogukKaynak: number;
  dataConfidence?: number;
}

export const Carnot_verimliligi_hesaplamaInputSchema = z.object({
  sicakKaynak: z.number().min(0).default(500),
  sogukKaynak: z.number().min(0).default(300),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Carnot_verimliligi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - (input.sogukKaynak / Math.max(0.0001, input.sicakKaynak)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateCarnot_verimliligi_hesaplama(input: Carnot_verimliligi_hesaplamaInput): Carnot_verimliligi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low SNR indicates poor signal quality.","High Q indicates narrow bandwidth."];
  const suggestedActions: string[] = ["Use proper shielding for sensitive measurements.","Consider efficiency losses in energy calculations."];
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Carnot_verimliligi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Carnot_verimliligi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

