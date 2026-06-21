// Auto-generated from tork-donusturucu-hesaplama-schema.json
import * as z from 'zod';

export interface Tork_donusturucu_hesaplamaInput {
  deger: number;
  kaynak: number;
  dataConfidence?: number;
}

export const Tork_donusturucu_hesaplamaInputSchema = z.object({
  deger: z.number().min(0).default(100),
  kaynak: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tork_donusturucu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kaynak === 1 ? input.deger * 1.3558 : input.kaynak === 2 ? input.deger * 9.8066 : input.deger; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateTork_donusturucu_hesaplama(input: Tork_donusturucu_hesaplamaInput): Tork_donusturucu_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "N.m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Tork_donusturucu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Tork_donusturucu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N.m",
  breakdownKeys: ["sonuc"],
} as const;

