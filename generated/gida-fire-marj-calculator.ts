// Auto-generated premium calculator: gida-fire-marj
import * as z from 'zod';

export interface GidaFireMarjInput {
  girenCıkanAgırlık: number;
  bozulmaAsırı: number;
  teorikKullanım: number;
  kgMaliyet: number;
  salvage: number;
  Indirimli: number;
}

export const GidaFireMarjInputSchema = z.object({
  girenCıkanAgırlık: z.number().min(0).default(0),
  bozulmaAsırı: z.number().min(0).default(0),
  teorikKullanım: z.number().min(0).default(0),
  kgMaliyet: z.number().min(0).default(0),
  salvage: z.number().min(0).default(0),
  Indirimli: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.finished * input.raw; results["yield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yield"] = Number.NaN; }
  try { const v = input.raw * input.finished; results["shrinkage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shrinkage"] = Number.NaN; }
  try { const v = input.shrinkage * input.rawCost; results["costShrink"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costShrink"] = Number.NaN; }
  try { const v = input.spoiled * input.prodCost; results["costSpoil"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costSpoil"] = Number.NaN; }
  try { const v = input.excess * input.unitCost * input.salvage; results["costOver"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costOver"] = Number.NaN; }
  try { const v = input.shrink * input.spoil * input.over; results["marginLeak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginLeak"] = Number.NaN; }
  try { const v = input.avail * input.perf * input.qualYield; results["oEEFood"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oEEFood"] = Number.NaN; }
  try { const v = input.recipe * input.actualProd; results["theoUsage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["theoUsage"] = Number.NaN; }
  try { const v = input.actual * input.theo; results["variance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["variance"] = Number.NaN; }
  return results;
}

export function calculateGidaFireMarj(input) {
  return evaluateAllFormulas(input);
}
