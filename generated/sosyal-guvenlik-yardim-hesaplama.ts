// Auto-generated from sosyal-guvenlik-yardim-hesaplama-schema.json
import * as z from 'zod';

export interface Sosyal_guvenlik_yardim_hesaplamaInput {
  ortIndeksliKazanc: number;
  emeklilikYasi: number;
  dataConfidence?: number;
}

export const Sosyal_guvenlik_yardim_hesaplamaInputSchema = z.object({
  ortIndeksliKazanc: z.number().min(0).default(8000),
  emeklilikYasi: z.number().min(62).max(70).default(65),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sosyal_guvenlik_yardim_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ortIndeksliKazanc * 0.9; results["temelBenefit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["temelBenefit"] = Number.NaN; }
  try { const v = input.emeklilikYasi >= 67 ? 1 + (input.emeklilikYasi - 67) * 0.08 : 1 - (67 - input.emeklilikYasi) * 0.067; results["yasCarpani"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yasCarpani"] = Number.NaN; }
  try { const v = (input.ortIndeksliKazanc * 0.9) * (input.emeklilikYasi >= 67 ? 1 + (input.emeklilikYasi - 67) * 0.08 : 1 - (67 - input.emeklilikYasi) * 0.067); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSosyal_guvenlik_yardim_hesaplama(input: Sosyal_guvenlik_yardim_hesaplamaInput): Sosyal_guvenlik_yardim_hesaplamaOutput {
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


export interface Sosyal_guvenlik_yardim_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sosyal_guvenlik_yardim_hesaplamaOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY",
  breakdownKeys: ["sonuc"],
} as const;

