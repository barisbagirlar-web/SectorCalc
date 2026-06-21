// Auto-generated from desibel-donusturucu-hesaplama-schema.json
import * as z from 'zod';

export interface Desibel_donusturucu_hesaplamaInput {
  oran: number;
  tip: number;
  dataConfidence?: number;
}

export const Desibel_donusturucu_hesaplamaInputSchema = z.object({
  oran: z.number().min(0).default(100),
  tip: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Desibel_donusturucu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tip === 0 ? 10 * Math.log10(Math.max(0.0001, input.oran)) : 20 * Math.log10(Math.max(0.0001, input.oran)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDesibel_donusturucu_hesaplama(input: Desibel_donusturucu_hesaplamaInput): Desibel_donusturucu_hesaplamaOutput {
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
    unit: "dB",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Desibel_donusturucu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Desibel_donusturucu_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "dB",
  breakdownKeys: ["sonuc"],
} as const;

