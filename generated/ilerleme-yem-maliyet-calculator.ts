// Auto-generated premium calculator: ilerleme-yem-maliyet
import * as z from 'zod';

export interface IlerlemeYemMaliyetInput {
  kısıtlar: number;
  besin: number;
  fiyatlar: number;
  Ogutme: number;
  fire: number;
  fCR: number;
  kazanc: number;
}

export const IlerlemeYemMaliyetInputSchema = z.object({
  kısıtlar: z.number().min(0).default(0),
  besin: z.number().min(0).default(0),
  fiyatlar: z.number().min(0).default(0),
  Ogutme: z.number().min(0).default(0),
  fire: z.number().min(0).default(0),
  fCR: z.number().min(0).default(0),
  kazanc: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.inclRate * input.price; results["costIng"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costIng"] = Number.NaN; }
  try { const v = input.costIng; results["costBase"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costBase"] = Number.NaN; }
  try { const v = input.grind * input.mix * input.pellet; results["costProc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costProc"] = Number.NaN; }
  try { const v = input.enz * input.vit * input.tox; results["costAdd"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costAdd"] = Number.NaN; }
  try { const v = input.costBase * input.shrinkRate; results["shrink"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shrink"] = Number.NaN; }
  try { const v = input.feedCons * input.weightGain; results["fCR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fCR"] = Number.NaN; }
  try { const v = input.base * input.proc * input.add * input.shrink * input.fCR; results["costPerKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerKg"] = Number.NaN; }
  try { const v = input.base * input.sUBJECT * input.tO * input.constraints; results["opt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["opt"] = Number.NaN; }
  return results;
}

export function calculateIlerlemeYemMaliyet(input) {
  return evaluateAllFormulas(input);
}
