// Auto-generated from sulama-maliyet-check-schema.json
import * as z from 'zod';

export interface Sulama_maliyet_checkInput {
  eTcMmgun: number;
  alanDekar: number;
  efektifYagisMm: number;
  toplamManometrikYukseklikM: number;
  pompaMotorVerimi: number;
  elektrikTarifesiCurrencykWh: number;
  bakimCurrencyda: number;
  dataConfidence?: number;
}

export const Sulama_maliyet_checkInputSchema = z.object({
  eTcMmgun: z.number().min(0).default(0),
  alanDekar: z.number().min(0).default(0),
  efektifYagisMm: z.number().min(0).default(0),
  toplamManometrikYukseklikM: z.number().min(0).default(0),
  pompaMotorVerimi: z.number().min(0).default(0),
  elektrikTarifesiCurrencykWh: z.number().min(0).default(0),
  bakimCurrencyda: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sulama_maliyet_checkInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.eTcMmgun * input.alanDekar * input.efektifYagisMm * input.toplamManometrikYukseklikM; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.eTcMmgun * input.alanDekar * input.efektifYagisMm * input.toplamManometrikYukseklikM * (input.pompaMotorVerimi * input.elektrikTarifesiCurrencykWh * input.bakimCurrencyda); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.pompaMotorVerimi * input.elektrikTarifesiCurrencykWh * input.bakimCurrencyda; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateSulama_maliyet_check(input: Sulama_maliyet_checkInput): Sulama_maliyet_checkOutput {
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Sulama_maliyet_checkOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Sulama_maliyet_checkOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

