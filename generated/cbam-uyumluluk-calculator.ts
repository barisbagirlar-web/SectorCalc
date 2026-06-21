// Auto-generated premium calculator: cbam-uyumluluk
import * as z from 'zod';

export interface CbamUyumlulukInput {
  toplamKutle: number;
  mense Ulke: string;
  kapsam12Emisyon: number;
  menseKarbonVergisi: number;
  karMarjıEsigi: number;
}

export const CbamUyumlulukInputSchema = z.object({
  toplamKutle: z.number().min(0).default(0),
  mense Ulke: z.number().min(0).default(0),
  kapsam12Emisyon: z.number().min(0).default(0),
  menseKarbonVergisi: z.number().min(0).default(0),
  karMarjıEsigi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.mass; results["totalMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMass"] = Number.NaN; }
  try { const v = input.direct * input.indirect; results["totalEmbedded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEmbedded"] = Number.NaN; }
  try { const v = input.totalEmbedded * input.totalMass; results["specificEmbedded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["specificEmbedded"] = Number.NaN; }
  try { const v = input.specificEmbedded * input.defaultEmissionFactor; results["actualVsDefault"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualVsDefault"] = Number.NaN; }
  try { const v = input.totalEmbedded * input.eUETSPrice * input.carbonPricePaidOrigin; results["financialLiability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["financialLiability"] = Number.NaN; }
  try { const v = input.actualVsDefault * input.liability * input.marginThreshold * input.proceed * input.reevaluate; results["complianceDecision"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["complianceDecision"] = Number.NaN; }
  return results;
}

export function calculateCbamUyumluluk(input) {
  return evaluateAllFormulas(input);
}
