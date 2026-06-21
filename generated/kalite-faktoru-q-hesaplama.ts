// Auto-generated from kalite-faktoru-q-hesaplama-schema.json
import * as z from 'zod';

export interface Kalite_faktoru_q_hesaplamaInput {
  rezonansFrekans: number;
  bantGenislik: number;
  dataConfidence?: number;
}

export const Kalite_faktoru_q_hesaplamaInputSchema = z.object({
  rezonansFrekans: z.number().min(0).default(1000000),
  bantGenislik: z.number().min(0).default(20000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Kalite_faktoru_q_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rezonansFrekans / Math.max(0.0001, input.bantGenislik); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKalite_faktoru_q_hesaplama(input: Kalite_faktoru_q_hesaplamaInput): Kalite_faktoru_q_hesaplamaOutput {
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
    unit: "Q",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Kalite_faktoru_q_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Kalite_faktoru_q_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Q",
  breakdownKeys: ["sonuc"],
} as const;

