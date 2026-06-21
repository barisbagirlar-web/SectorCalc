// Auto-generated premium calculator: moq-stok-denge
import * as z from 'zod';

export interface MoqStokDengeInput {
  yıllıkTalep: number;
  siparisMaliyeti: number;
  mOQ: number;
  standartMOQBirimFiyat: number;
  birimTasımaMaliyeti: number;
  tedarikSuresi: number;
  stokAlanıKısıtı: number;
}

export const MoqStokDengeInputSchema = z.object({
  yıllıkTalep: z.number().min(0).default(0),
  siparisMaliyeti: z.number().min(0).default(0),
  mOQ: z.number().min(0).default(0),
  standartMOQBirimFiyat: z.number().min(0).default(0),
  birimTasımaMaliyeti: z.number().min(0).default(0),
  tedarikSuresi: z.number().min(0).default(0),
  stokAlanıKısıtı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.annualDemand * input.orderCost * input.holdingCost; results["eOQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eOQ"] = Number.NaN; }
  try { const v = input.mOQ * input.eOQ * input.holdingCost; results["mOQPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mOQPenalty"] = Number.NaN; }
  try { const v = input.unitPriceStandard * input.unitPriceMOQ * input.annualDemand; results["priceBreakSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["priceBreakSavings"] = Number.NaN; }
  try { const v = input.priceBreakSavings * input.mOQPenalty * input.additionalOrderCostSavings; results["netBenefit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netBenefit"] = Number.NaN; }
  try { const v = input.netBenefit * input.mOQ * input.eOQ; results["optimalOrderQty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalOrderQty"] = Number.NaN; }
  try { const v = input.optimalOrderQty * input.holdingCost; results["cycleStockCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cycleStockCost"] = Number.NaN; }
  return results;
}

export function calculateMoqStokDenge(input) {
  return evaluateAllFormulas(input);
}
