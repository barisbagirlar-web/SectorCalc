// Auto-generated from karbon-ayak-izi-hesaplama-schema.json
import * as z from 'zod';

export interface Karbon_ayak_izi_hesaplamaInput {
  yakit: number;
  elektrik: number;
  tedarik: number;
  dataConfidence?: number;
}

export const Karbon_ayak_izi_hesaplamaInputSchema = z.object({
  yakit: z.number().min(0).default(10000),
  elektrik: z.number().min(0).default(50000),
  tedarik: z.number().min(0).default(20000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Karbon_ayak_izi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yakit * 2.31; results["scope1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scope1"] = Number.NaN; }
  try { const v = input.elektrik * 0.45; results["scope2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scope2"] = Number.NaN; }
  try { const v = (input.yakit * 2.31) + (input.elektrik * 0.45) + input.tedarik; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateKarbon_ayak_izi_hesaplama(input: Karbon_ayak_izi_hesaplamaInput): Karbon_ayak_izi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High environmental score may reduce operational costs.","Low ESG score may increase capital costs."];
  const suggestedActions: string[] = ["Set improvement targets for each ESG pillar.","Consider carbon offset programs for residual emissions."];
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
    unit: "kgCO2",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Karbon_ayak_izi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Karbon_ayak_izi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "kgCO2",
  breakdownKeys: ["sonuc"],
} as const;

