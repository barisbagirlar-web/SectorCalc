// Auto-generated premium calculator: cpk-to-ppm
import * as z from 'zod';

export interface CpkToPpmInput {
  uSL: number;
  lSL: number;
  mean: number;
  stdDev: number;
  hedefCpk: number;
  gunlukHacim: number;
}

export const CpkToPpmInputSchema = z.object({
  uSL: z.number().min(0).default(0),
  lSL: z.number().min(0).default(0),
  mean: z.number().min(0).default(0),
  stdDev: z.number().min(0).default(0),
  hedefCpk: z.number().min(0).default(0),
  gunlukHacim: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.uSL * input.mean; results["zUSL"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zUSL"] = Number.NaN; }
  try { const v = input.mean * input.lSL; results["zLSL"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zLSL"] = Number.NaN; }
  try { const v = input.zUSL * input.zLSL; results["cpk"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cpk"] = Number.NaN; }
  try { const v = input.zUSL; results["pUSL"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pUSL"] = Number.NaN; }
  try { const v = input.zLSL; results["pLSL"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pLSL"] = Number.NaN; }
  try { const v = input.pUSL * input.pLSL; results["pTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pTotal"] = Number.NaN; }
  try { const v = input.pTotal; results["pPM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pPM"] = Number.NaN; }
  try { const v = input.pTotal; results["yield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yield"] = Number.NaN; }
  try { const v = input.cpk; results["sigmaShortTerm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sigmaShortTerm"] = Number.NaN; }
  return results;
}

export function calculateCpkToPpm(input) {
  return evaluateAllFormulas(input);
}
