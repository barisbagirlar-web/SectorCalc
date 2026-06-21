// Auto-generated from sivi-gida-akis-enerji-hesaplama-schema.json
import * as z from 'zod';

export interface Sivi_gida_akis_enerji_hesaplamaInput {
  debi: number;
  basincDusumu: number;
  pompaVerim: number;
  dataConfidence?: number;
}

export const Sivi_gida_akis_enerji_hesaplamaInputSchema = z.object({
  debi: z.number().min(0).default(0.005),
  basincDusumu: z.number().min(0).default(200000),
  pompaVerim: z.number().min(0).default(75),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sivi_gida_akis_enerji_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.debi * input.basincDusumu) / Math.max(0.0001, (input.pompaVerim / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSivi_gida_akis_enerji_hesaplama(input: Sivi_gida_akis_enerji_hesaplamaInput): Sivi_gida_akis_enerji_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "W",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Sivi_gida_akis_enerji_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sivi_gida_akis_enerji_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "W",
  breakdownKeys: ["sonuc"],
} as const;

