// Auto-generated from vakum-kaa-enerji-kayb-schema.json
import * as z from 'zod';

export interface Vakum_kaa_enerji_kaybInput {
  sistemHacmiM3: number;
  basincDusumuDeltaPBar: number;
  sureDeltaTSn: number;
  atmosferikBasinc: number;
  pompaVerimi: number;
  yillikSaat: number;
  elektrikTarifesi: number;
  emisyonFaktoru: number;
  dataConfidence?: number;
}

export const Vakum_kaa_enerji_kaybInputSchema = z.object({
  sistemHacmiM3: z.number().min(0).default(0),
  basincDusumuDeltaPBar: z.number().min(0).default(0),
  sureDeltaTSn: z.number().min(0).default(0),
  atmosferikBasinc: z.number().min(0).default(0),
  pompaVerimi: z.number().min(0).default(0),
  yillikSaat: z.number().min(0).default(0),
  elektrikTarifesi: z.number().min(0).default(0),
  emisyonFaktoru: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vakum_kaa_enerji_kaybInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sistemHacmiM3 * input.basincDusumuDeltaPBar * input.sureDeltaTSn * input.atmosferikBasinc; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.sistemHacmiM3 * input.basincDusumuDeltaPBar * input.sureDeltaTSn * input.atmosferikBasinc * (input.pompaVerimi * input.yillikSaat * input.elektrikTarifesi * input.emisyonFaktoru); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.pompaVerimi * input.yillikSaat * input.elektrikTarifesi * input.emisyonFaktoru; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateVakum_kaa_enerji_kayb(input: Vakum_kaa_enerji_kaybInput): Vakum_kaa_enerji_kaybOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "units",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Vakum_kaa_enerji_kaybOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Vakum_kaa_enerji_kaybOutputMeta = {
  primaryKey: "result",
  unit: "units",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

