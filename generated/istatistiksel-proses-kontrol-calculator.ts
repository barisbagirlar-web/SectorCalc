// Auto-generated premium calculator: istatistiksel-proses-kontrol
import * as z from 'zod';

export interface IstatistikselProsesKontrolInput {
  altGrupN: number;
  veri: number;
  uSL: number;
  lSL: number;
  tip: string;
  hedef: number;
}

export const IstatistikselProsesKontrolInputSchema = z.object({
  altGrupN: z.number().min(0).default(0),
  veri: z.number().min(0).default(0),
  uSL: z.number().min(0).default(0),
  lSL: z.number().min(0).default(0),
  tip: z.number().min(0).default(0),
  hedef: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.means; results["xBarBar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["xBarBar"] = Number.NaN; }
  try { const v = input.ranges; results["rBar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rBar"] = Number.NaN; }
  try { const v = input.stdDevs; results["sBar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sBar"] = Number.NaN; }
  try { const v = input.xBarBar * input.a2 * input.rBar; results["uCLX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["uCLX"] = Number.NaN; }
  try { const v = input.xBarBar * input.a2 * input.rBar; results["lCLX"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lCLX"] = Number.NaN; }
  try { const v = input.d4 * input.rBar; results["uCLR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["uCLR"] = Number.NaN; }
  try { const v = input.d3 * input.rBar; results["lCLR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lCLR"] = Number.NaN; }
  try { const v = input.rBar * input.d2; results["sigma"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sigma"] = Number.NaN; }
  try { const v = input.uSL * input.lSL * input.sigma; results["cp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cp"] = Number.NaN; }
  return results;
}

export function calculateIstatistikselProsesKontrol(input) {
  return evaluateAllFormulas(input);
}
