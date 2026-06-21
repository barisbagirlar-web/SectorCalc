// Auto-generated from vadeli-hayat-sigortasi-hesaplama-schema.json
import * as z from 'zod';

export interface Vadeli_hayat_sigortasi_hesaplamaInput {
  teminat: number;
  olumOlasiligi: number;
  giderMarji: number;
  dataConfidence?: number;
}

export const Vadeli_hayat_sigortasi_hesaplamaInputSchema = z.object({
  teminat: z.number().min(0).default(500000),
  olumOlasiligi: z.number().min(0).default(0.2),
  giderMarji: z.number().min(0).max(100).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vadeli_hayat_sigortasi_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.teminat * (input.olumOlasiligi / 100); results["netPrim"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netPrim"] = Number.NaN; }
  try { const v = (input.teminat * (input.olumOlasiligi / 100)) / Math.max(0.0001, (1 - input.giderMarji / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateVadeli_hayat_sigortasi_hesaplama(input: Vadeli_hayat_sigortasi_hesaplamaInput): Vadeli_hayat_sigortasi_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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
    unit: "TRY",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Vadeli_hayat_sigortasi_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vadeli_hayat_sigortasi_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

