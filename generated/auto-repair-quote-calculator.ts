// Auto-generated premium calculator: auto-repair-quote
import * as z from 'zod';

export interface AutoRepairQuoteInput {
  teklif123Toplam: number;
  parcaTeklifPiyasaFiyatı: number;
  miktar: number;
  teklifStandart IscilikSaati: number;
}

export const AutoRepairQuoteInputSchema = z.object({
  teklif123Toplam: z.number().min(0).default(0),
  parcaTeklifPiyasaFiyatı: z.number().min(0).default(0),
  miktar: z.number().min(0).default(0),
  teklifStandart IscilikSaati: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.quoteAmounts; results["quoteVariance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["quoteVariance"] = Number.NaN; }
  try { const v = input.quotedPartPrice * input.marketAvg; results["partPriceDeviation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["partPriceDeviation"] = Number.NaN; }
  try { const v = input.quotedLaborHours * input.standardHours; results["laborTimeDeviation"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborTimeDeviation"] = Number.NaN; }
  try { const v = input.quoteVariance * input.partPriceDeviation * input.laborTimeDeviation; results["consistencyScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["consistencyScore"] = Number.NaN; }
  try { const v = input.marketPrice * input.quotedPrice * input.quantity; results["marginLeak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginLeak"] = Number.NaN; }
  return results;
}

export function calculateAutoRepairQuote(input) {
  return evaluateAllFormulas(input);
}
