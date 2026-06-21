// Auto-generated from yayilma-sabiti-hesaplama-schema.json
import * as z from 'zod';

export interface Yayilma_sabiti_hesaplamaInput {
  direnc: number;
  induktans: number;
  kapasite: number;
  frekans: number;
  dataConfidence?: number;
}

export const Yayilma_sabiti_hesaplamaInputSchema = z.object({
  direnc: z.number().min(0).default(0.01),
  induktans: z.number().min(0).default(0.000001),
  kapasite: z.number().min(0).default(1e-12),
  frekans: z.number().min(0).default(1000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yayilma_sabiti_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * Math.PI * input.frekans; results["w"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["w"] = Number.NaN; }
  try { const v = Math.sqrt(Math.max(0, (0.01 + 0 + 1e-6 * 2 * Math.PI * 1e6) * (0 + 0 + 1e-12 * 2 * Math.PI * 1e6))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateYayilma_sabiti_hesaplama(input: Yayilma_sabiti_hesaplamaInput): Yayilma_sabiti_hesaplamaOutput {
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
    unit: "Np/m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Yayilma_sabiti_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Yayilma_sabiti_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Np/m",
  breakdownKeys: ["sonuc"],
} as const;

