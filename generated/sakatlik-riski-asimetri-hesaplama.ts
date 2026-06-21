// Auto-generated from sakatlik-riski-asimetri-hesaplama-schema.json
import * as z from 'zod';

export interface Sakatlik_riski_asimetri_hesaplamaInput {
  sagKuvvet: number;
  solKuvvet: number;
  dataConfidence?: number;
}

export const Sakatlik_riski_asimetri_hesaplamaInputSchema = z.object({
  sagKuvvet: z.number().min(0).default(500),
  solKuvvet: z.number().min(0).default(450),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sakatlik_riski_asimetri_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.abs(input.sagKuvvet - input.solKuvvet) / Math.max(0.0001, Math.max(input.sagKuvvet, input.solKuvvet))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSakatlik_riski_asimetri_hesaplama(input: Sakatlik_riski_asimetri_hesaplamaInput): Sakatlik_riski_asimetri_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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


export interface Sakatlik_riski_asimetri_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sakatlik_riski_asimetri_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["sonuc"],
} as const;

