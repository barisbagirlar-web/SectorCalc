// Auto-generated premium calculator: taeron-marj-sznt-dedektr
import * as z from 'zod';

export interface TaeronMarjSzntDedektrInput {
  sozlesmeBedeli: number;
  taseronTeklifBedeli: number;
  gerceklesenTaseronHakedisi: number;
  changeOrderTutarları: number;
  reworkMaliyeti: number;
  gecikmeCezaları: number;
}

export const TaeronMarjSzntDedektrInputSchema = z.object({
  sozlesmeBedeli: z.number().min(0).default(0),
  taseronTeklifBedeli: z.number().min(0).default(0),
  gerceklesenTaseronHakedisi: z.number().min(0).default(0),
  changeOrderTutarları: z.number().min(0).default(0),
  reworkMaliyeti: z.number().min(0).default(0),
  gecikmeCezaları: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.contractValue * input.estimatedSubcontractorCost; results["quotedMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["quotedMargin"] = Number.NaN; }
  try { const v = input.contractValue * input.actualSubcontractorCost * input.reworkCost * input.delayPenalties; results["actualMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualMargin"] = Number.NaN; }
  try { const v = input.quotedMargin * input.actualMargin; results["marginLeak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginLeak"] = Number.NaN; }
  try { const v = input.changeOrderAmountI; results["changeOrderCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["changeOrderCost"] = Number.NaN; }
  try { const v = input.actualWorkCompleted * input.billedAmount; results["unbilledWork"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["unbilledWork"] = Number.NaN; }
  try { const v = input.marginLeak * input.quotedMargin; results["leakagePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leakagePct"] = Number.NaN; }
  return results;
}

export function calculateTaeronMarjSzntDedektr(input) {
  return evaluateAllFormulas(input);
}
