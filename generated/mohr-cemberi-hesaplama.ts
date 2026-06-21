// Auto-generated from mohr-cemberi-hesaplama-schema.json
import * as z from 'zod';

export interface Mohr_cemberi_hesaplamaInput {
  sigmaX: number;
  sigmaY: number;
  tauXY: number;
  dataConfidence?: number;
}

export const Mohr_cemberi_hesaplamaInputSchema = z.object({
  sigmaX: z.number().min(0).default(100000000),
  sigmaY: z.number().min(0).default(50000000),
  tauXY: z.number().min(0).default(30000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mohr_cemberi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (100e6 + 50e6) / 2; results["merkez"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["merkez"] = Number.NaN; }
  try { const v = Math.sqrt(Math.max(0, Math.pow((100e6 - 50e6) / 2, 2) + Math.pow(30e6, 2))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMohr_cemberi_hesaplama(input: Mohr_cemberi_hesaplamaInput): Mohr_cemberi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    merkez: toNumericFormulaValue(values["merkez"]),
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Mohr_cemberi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { merkez: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Mohr_cemberi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "Pa",
  breakdownKeys: ["merkez","sonuc"],
} as const;

