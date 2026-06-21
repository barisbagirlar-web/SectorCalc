// Auto-generated premium calculator: hacimsel-airlik
import * as z from 'zod';

export interface HacimselAirlikInput {
  lWH: number;
  brut: number;
  mod: string;
  kgCBMFiyat: number;
  minThreshold: number;
  Istifleme: number;
}

export const HacimselAirlikInputSchema = z.object({
  lWH: z.number().min(0).default(0),
  brut: z.number().min(0).default(0),
  mod: z.number().min(0).default(0),
  kgCBMFiyat: z.number().min(0).default(0),
  minThreshold: z.number().min(0).default(0),
  Istifleme: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.l * input.w * input.h; results["volWeightAir"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volWeightAir"] = Number.NaN; }
  try { const v = input.l * input.w * input.h; results["volWeightRoad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volWeightRoad"] = Number.NaN; }
  try { const v = input.l * input.w * input.h; results["volWeightSea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volWeightSea"] = Number.NaN; }
  try { const v = input.gross * input.volWeight; results["chargeable"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chargeable"] = Number.NaN; }
  try { const v = input.chargeable * input.rate; results["freight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["freight"] = Number.NaN; }
  try { const v = input.gross * input.vol; results["density"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["density"] = Number.NaN; }
  try { const v = input.actualLoad * input.maxCont; results["stackLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stackLoss"] = Number.NaN; }
  try { const v = input.chargeable * input.gross * input.rate; results["ineff"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ineff"] = Number.NaN; }
  return results;
}

export function calculateHacimselAirlik(input) {
  return evaluateAllFormulas(input);
}
