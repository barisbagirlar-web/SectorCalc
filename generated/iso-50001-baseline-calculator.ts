// Auto-generated premium calculator: iso-50001-baseline
import * as z from 'zod';

export interface Iso50001BaselineInput {
  tuketim: number;
  Uretim: number;
  hDDCDD: number;
  rKare: number;
  bazYıl: number;
  azaltım: number;
  periyot: string;
}

export const Iso50001BaselineInputSchema = z.object({
  tuketim: z.number().min(0).default(0),
  Uretim: z.number().min(0).default(0),
  hDDCDD: z.number().min(0).default(0),
  rKare: z.number().min(0).default(0),
  bazYıl: z.number().min(0).default(0),
  azaltım: z.number().min(0).default(0),
  periyot: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.energy * input.volume; results["enPI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["enPI"] = Number.NaN; }
  try { const v = input.intercept * input.slope1 * input.prod * input.slope2 * input.dD; results["baseline"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseline"] = Number.NaN; }
  try { const v = input.actual * input.predicted; results["cusumT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cusumT"] = Number.NaN; }
  try { const v = input.cusumT; results["cusumCum"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cusumCum"] = Number.NaN; }
  try { const v = input.predicted * input.actual; results["savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["savings"] = Number.NaN; }
  try { const v = input.dDCurr * input.dDHist; results["norm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["norm"] = Number.NaN; }
  try { const v = input.r2 * input.p; results["sig"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sig"] = Number.NaN; }
  try { const v = input.baseline * input.redTarget; results["target"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["target"] = Number.NaN; }
  return results;
}

export function calculateIso50001Baseline(input) {
  return evaluateAllFormulas(input);
}
