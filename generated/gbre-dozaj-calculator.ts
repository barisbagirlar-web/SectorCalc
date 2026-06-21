// Auto-generated premium calculator: gbre-dozaj
import * as z from 'zod';

export interface GbreDozajInput {
  hedefVerim: number;
  toprakNPK: number;
  Ihtiyac: number;
  verimlilik: number;
  alan: number;
  Icerik: number;
  fiyat: number;
}

export const GbreDozajInputSchema = z.object({
  hedefVerim: z.number().min(0).default(0),
  toprakNPK: z.number().min(0).default(0),
  Ihtiyac: z.number().min(0).default(0),
  verimlilik: z.number().min(0).default(0),
  alan: z.number().min(0).default(0),
  Icerik: z.number().min(0).default(0),
  fiyat: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.yieldTarget * input.remRate; results["nutReq"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nutReq"] = Number.NaN; }
  try { const v = input.soilTest * input.convFactor; results["soilSupp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["soilSupp"] = Number.NaN; }
  try { const v = input.nutReq * input.soilSupp * input.eff; results["fertNeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fertNeed"] = Number.NaN; }
  try { const v = input.fertNeed * input.contentPct; results["appRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["appRate"] = Number.NaN; }
  try { const v = input.appRate * input.area * input.price; results["cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cost"] = Number.NaN; }
  try { const v = input.appRate * input.uptake * input.leach; results["envRisk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["envRisk"] = Number.NaN; }
  try { const v = input.yieldInc * input.cropPrice * input.cost; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  try { const v = input.baseRate * input.zoneFactor; results["precision"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["precision"] = Number.NaN; }
  return results;
}

export function calculateGbreDozaj(input) {
  return evaluateAllFormulas(input);
}
