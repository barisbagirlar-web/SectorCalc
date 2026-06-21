// Auto-generated from lvl-kiris-kapasitesi-hesaplama-schema.json
import * as z from 'zod';

export interface Lvl_kiris_kapasitesi_hesaplamaInput {
  kesitModulu: number;
  egilmeDayanimi: number;
  dataConfidence?: number;
}

export const Lvl_kiris_kapasitesi_hesaplamaInputSchema = z.object({
  kesitModulu: z.number().min(0).default(0.00025),
  egilmeDayanimi: z.number().min(0).default(40000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lvl_kiris_kapasitesi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.kesitModulu * input.egilmeDayanimi; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateLvl_kiris_kapasitesi_hesaplama(input: Lvl_kiris_kapasitesi_hesaplamaInput): Lvl_kiris_kapasitesi_hesaplamaOutput {
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


export interface Lvl_kiris_kapasitesi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Lvl_kiris_kapasitesi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "N.m",
  breakdownKeys: ["sonuc"],
} as const;

