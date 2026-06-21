// Auto-generated premium calculator: teklif-risk-analizr
import * as z from 'zod';

export interface TeklifRiskAnalizrInput {
  dogrudanMaliyetler: number;
  overhead: number;
  teklifFiyatı: number;
  rakip Indeksi: number;
  tarihselKazanmaOranı: number;
  riskFaktoru: number;
  riskPrimi: number;
  hedefMarj: number;
}

export const TeklifRiskAnalizrInputSchema = z.object({
  dogrudanMaliyetler: z.number().min(0).default(0),
  overhead: z.number().min(0).default(0),
  teklifFiyatı: z.number().min(0).default(0),
  rakip Indeksi: z.number().min(0).default(0),
  tarihselKazanmaOranı: z.number().min(0).default(0),
  riskFaktoru: z.number().min(0).default(0),
  riskPrimi: z.number().min(0).default(0),
  hedefMarj: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.directCosts * input.overhead; results["baseEstimate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseEstimate"] = Number.NaN; }
  try { const v = input.baseEstimate * input.riskFactor; results["contingency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contingency"] = Number.NaN; }
  try { const v = input.bidPrice * input.baseEstimate * input.contingency; results["expectedMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedMargin"] = Number.NaN; }
  try { const v = input.f * input.bidPrice * input.competitorIndex * input.historicalWinRate; results["winProbability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["winProbability"] = Number.NaN; }
  try { const v = input.winProbability * input.expectedMargin * input.bidPrice; results["expectedValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedValue"] = Number.NaN; }
  try { const v = input.baseEstimate * input.targetMargin * input.riskPremium; results["riskAdjustedBid"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskAdjustedBid"] = Number.NaN; }
  return results;
}

export function calculateTeklifRiskAnalizr(input) {
  return evaluateAllFormulas(input);
}
