// Auto-generated premium calculator: iskele-kiralama
import * as z from 'zod';

export interface IskeleKiralamaInput {
  CevreYukseklik: number;
  sure: number;
  mKiralamaIscilik: number;
  sefer: number;
  kritikYol: number;
  risk: number;
}

export const IskeleKiralamaInputSchema = z.object({
  CevreYukseklik: z.number().min(0).default(0),
  sure: z.number().min(0).default(0),
  mKiralamaIscilik: z.number().min(0).default(0),
  sefer: z.number().min(0).default(0),
  kritikYol: z.number().min(0).default(0),
  risk: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.perim * input.height; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area"] = Number.NaN; }
  try { const v = input.area * input.standoff; results["vol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vol"] = Number.NaN; }
  try { const v = input.area * input.rate * input.dur; results["rental"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rental"] = Number.NaN; }
  try { const v = input.area * input.erectRate; results["labErect"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["labErect"] = Number.NaN; }
  try { const v = input.area * input.dismRate; results["labDism"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["labDism"] = Number.NaN; }
  try { const v = input.trips * input.truckRate; results["transp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["transp"] = Number.NaN; }
  try { const v = input.rental * input.labErect * input.labDism * input.transp; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = input.critPath * input.buffer * input.overlap; results["optDur"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optDur"] = Number.NaN; }
  try { const v = input.actual * input.optDur * input.dailyRate; results["overrun"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overrun"] = Number.NaN; }
  return results;
}

export function calculateIskeleKiralama(input) {
  return evaluateAllFormulas(input);
}
