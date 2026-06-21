// Auto-generated premium calculator: transfer-fiyatlandrmas-optimize-edici
import * as z from 'zod';

export interface TransferFiyatlandrmasOptimizeEdiciInput {
  karsılastırılabilirPiyasaFiyatı: number;
  yuksekDusukVergiOranları: number;
  tamMaliyetDegiskenMaliyet: number;
  fırsatMaliyeti: number;
  hedefMarj: number;
  duzenleyiciCezaRiski: number;
}

export const TransferFiyatlandrmasOptimizeEdiciInputSchema = z.object({
  karsılastırılabilirPiyasaFiyatı: z.number().min(0).default(0),
  yuksekDusukVergiOranları: z.number().min(0).default(0),
  tamMaliyetDegiskenMaliyet: z.number().min(0).default(0),
  fırsatMaliyeti: z.number().min(0).default(0),
  hedefMarj: z.number().min(0).default(0),
  duzenleyiciCezaRiski: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.fullCost * input.markupPct; results["costPlusPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPlusPrice"] = Number.NaN; }
  try { const v = input.comparableUncontrolledPrice; results["marketBasedPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marketBasedPrice"] = Number.NaN; }
  try { const v = input.variableCost * input.opportunityCost; results["marginalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginalCost"] = Number.NaN; }
  try { const v = input.transferPrice * input.armLengthPrice * input.taxRateHigh * input.taxRateLow; results["taxImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxImpact"] = Number.NaN; }
  try { const v = input.revenueFinal * input.costOrigin * input.costTransfer * input.taxImpact; results["globalProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["globalProfit"] = Number.NaN; }
  try { const v = input.price * input.that * input.mAXIMIZES * input.globalProfit * input.subject * input.to * input.taxRegulations; results["optimalTransferPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalTransferPrice"] = Number.NaN; }
  return results;
}

export function calculateTransferFiyatlandrmasOptimizeEdici(input) {
  return evaluateAllFormulas(input);
}
