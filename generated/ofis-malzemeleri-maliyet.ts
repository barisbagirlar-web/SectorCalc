// Auto-generated from ofis-malzemeleri-maliyet-schema.json
import * as z from 'zod';

export interface Ofis_malzemeleri_maliyetInput {
  CalisanSayisi: number;
  tuketimMiktarlari: number;
  birimFiyatlar: number;
  siparisMaliyeti: number;
  acilKargoMaliyeti: number;
  stokTasimaOrani: number;
  fireIsrafOrani: number;
  dataConfidence?: number;
}

export const Ofis_malzemeleri_maliyetInputSchema = z.object({
  CalisanSayisi: z.number().min(0).default(0),
  tuketimMiktarlari: z.number().min(0).default(0),
  birimFiyatlar: z.number().min(0).default(0),
  siparisMaliyeti: z.number().min(0).default(0),
  acilKargoMaliyeti: z.number().min(0).default(0),
  stokTasimaOrani: z.number().min(0).default(0),
  fireIsrafOrani: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(_input: Ofis_malzemeleri_maliyetInput): Record<string, number> {
  return {};
}


export function calculateOfis_malzemeleri_maliyet(input: Ofis_malzemeleri_maliyetInput): Ofis_malzemeleri_maliyetOutput {
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


export interface Ofis_malzemeleri_maliyetOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ofis_malzemeleri_maliyetOutputMeta = {
  primaryKey: "total",
  unit: "%",
  breakdownKeys: [],
} as const;

