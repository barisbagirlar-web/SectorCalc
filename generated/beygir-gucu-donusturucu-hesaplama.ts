// Auto-generated from beygir-gucu-donusturucu-hesaplama-schema.json
import * as z from 'zod';

export interface Beygir_gucu_donusturucu_hesaplamaInput {
  deger: number;
  kaynak: number;
  dataConfidence?: number;
}

export const Beygir_gucu_donusturucu_hesaplamaInputSchema = z.object({
  deger: z.number().min(0).default(100),
  kaynak: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beygir_gucu_donusturucu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kaynak === 0 ? input.deger * 0.7457 : input.kaynak === 2 ? input.deger * 0.7355 : input.deger; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBeygir_gucu_donusturucu_hesaplama(input: Beygir_gucu_donusturucu_hesaplamaInput): Beygir_gucu_donusturucu_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High fuel/energy consumption indicates efficiency losses."];
  const suggestedActions: string[] = ["Regular maintenance improves overall equipment efficiency.","Simulate real-world driving conditions for accurate range estimates."];
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
    unit: "kW",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Beygir_gucu_donusturucu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Beygir_gucu_donusturucu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kW",
  breakdownKeys: ["sonuc"],
} as const;

