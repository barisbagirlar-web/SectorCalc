// Auto-generated premium calculator: fiyat-esneklii
import * as z from 'zod';

export interface FiyatEsnekliiInput {
  mevcutFiyatTalep: number;
  degisim: number;
  esneklik: number;
  CaprazEsneklik: number;
  degiskenSabitMaliyet: number;
}

export const FiyatEsnekliiInputSchema = z.object({
  mevcutFiyatTalep: z.number().min(0).default(0),
  degisim: z.number().min(0).default(0),
  esneklik: z.number().min(0).default(0),
  CaprazEsneklik: z.number().min(0).default(0),
  degiskenSabitMaliyet: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.pctChangeDem * input.pctChangePrice; results["elasticity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["elasticity"] = Number.NaN; }
  try { const v = input.currDem * input.elast * input.pctChangePrice; results["newDem"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newDem"] = Number.NaN; }
  try { const v = input.newPrice * input.newDem; results["newRev"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newRev"] = Number.NaN; }
  try { const v = input.newPrice * input.varCost * input.newDem * input.fixed; results["newMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newMargin"] = Number.NaN; }
  try { const v = input.elast * input.varCost; results["maxPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxPrice"] = Number.NaN; }
  try { const v = input.elast; results["markup"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["markup"] = Number.NaN; }
  try { const v = input.newDem * input.cannibRate * input.marginOther; results["cannibLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cannibLoss"] = Number.NaN; }
  try { const v = input.newMargin * input.currMargin * input.cannib; results["netImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netImpact"] = Number.NaN; }
  return results;
}

export function calculateFiyatEsneklii(input) {
  return evaluateAllFormulas(input);
}
