// Auto-generated from duvar-kagidi-hesaplama-schema.json
import * as z from 'zod';

export interface Duvar_kagidi_hesaplamaInput {
  alan: number;
  ruloEn: number;
  ruloBoy: number;
  desenTekrari: number;
  dataConfidence?: number;
}

export const Duvar_kagidi_hesaplamaInputSchema = z.object({
  alan: z.number().min(0).default(50),
  ruloEn: z.number().min(0).default(0.53),
  ruloBoy: z.number().min(0).default(10),
  desenTekrari: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Duvar_kagidi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.alan / Math.max(0.0001, (input.ruloEn * input.ruloBoy * (1 - input.desenTekrari / Math.max(0.0001, input.ruloBoy))))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDuvar_kagidi_hesaplama(input: Duvar_kagidi_hesaplamaInput): Duvar_kagidi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "rolls",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Duvar_kagidi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Duvar_kagidi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "rolls",
  breakdownKeys: ["sonuc"],
} as const;

