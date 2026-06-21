// Auto-generated premium calculator: kaizen-tasarruf-takipisi
import * as z from 'zod';

export interface KaizenTasarrufTakipisiInput {
  bazGercekMaliyet: number;
  sure: number;
  hacim: number;
  IscilikMalzeme: number;
  donusum: number;
  kontrolAyı: number;
}

export const KaizenTasarrufTakipisiInputSchema = z.object({
  bazGercekMaliyet: z.number().min(0).default(0),
  sure: z.number().min(0).default(0),
  hacim: z.number().min(0).default(0),
  IscilikMalzeme: z.number().min(0).default(0),
  donusum: z.number().min(0).default(0),
  kontrolAyı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.baseline * input.actual * input.vol; results["hard"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hard"] = Number.NaN; }
  try { const v = input.timeSaved * input.labRate * input.conv; results["soft"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["soft"] = Number.NaN; }
  try { const v = input.labK * input.mat * input.down; results["impCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["impCost"] = Number.NaN; }
  try { const v = input.hard * input.soft * input.impCost; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  try { const v = input.impCost * input.monthSav; results["payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["payback"] = Number.NaN; }
  try { const v = input.savM6 * input.savM1; results["sust"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sust"] = Number.NaN; }
  try { const v = input.monthSav; results["cum"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cum"] = Number.NaN; }
  try { const v = input.timeK * input.prodRate * input.margin; results["opp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["opp"] = Number.NaN; }
  return results;
}

export function calculateKaizenTasarrufTakipisi(input) {
  return evaluateAllFormulas(input);
}
