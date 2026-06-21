// Auto-generated from project-maliyet-tahmin-schema.json
import * as z from 'zod';

export interface Project_maliyet_tahminInput {
  IscilikSaatleriUcretleri: number;
  malzemeListesi: number;
  ekipmanKiralama: number;
  taseronTeklifleri: number;
  overheadOrani: number;
  riskKontenjansi: number;
  onaylanmisButce: number;
  dataConfidence?: number;
}

export const Project_maliyet_tahminInputSchema = z.object({
  IscilikSaatleriUcretleri: z.number().min(0).default(0),
  malzemeListesi: z.number().min(0).default(0),
  ekipmanKiralama: z.number().min(0).default(0),
  taseronTeklifleri: z.number().min(0).default(0),
  overheadOrani: z.number().min(0).default(0),
  riskKontenjansi: z.number().min(0).default(0),
  onaylanmisButce: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(_input: Project_maliyet_tahminInput): Record<string, number> {
  return {};
}


export function calculateProject_maliyet_tahmin(input: Project_maliyet_tahminInput): Project_maliyet_tahminOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
  const breakdown = {

  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Project_maliyet_tahminOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Project_maliyet_tahminOutputMeta = {
  primaryKey: "total",
  unit: "%",
  breakdownKeys: [],
} as const;

