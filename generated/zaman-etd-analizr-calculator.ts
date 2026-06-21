// Auto-generated premium calculator: zaman-etd-analizr
import * as z from 'zod';

export interface ZamanEtdAnalizrInput {
  gozlemlenenSurelerArray: number;
  performansDegerlendirme: number;
  kisiselYorgunlukGecikmePayları: number;
  saatlik Ucret: number;
  vardiyaSuresiDk: number;
  gercek UretimAdedi: number;
}

export const ZamanEtdAnalizrInputSchema = z.object({
  gozlemlenenSurelerArray: z.number().min(0).default(0),
  performansDegerlendirme: z.number().min(0).default(0),
  kisiselYorgunlukGecikmePayları: z.number().min(0).default(0),
  saatlik Ucret: z.number().min(0).default(0),
  vardiyaSuresiDk: z.number().min(0).default(0),
  gercek UretimAdedi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.cycleTimes * input.numberOfCycles; results["observedTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["observedTime"] = Number.NaN; }
  try { const v = input.observedTime * input.performanceRating; results["normalTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalTime"] = Number.NaN; }
  try { const v = input.personal * input.fatigue * input.delay; results["allowancePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowancePct"] = Number.NaN; }
  try { const v = input.normalTime * input.allowancePct; results["standardTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["standardTime"] = Number.NaN; }
  try { const v = input.shiftDuration * input.standardTime; results["standardOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["standardOutput"] = Number.NaN; }
  try { const v = input.standardTime * input.hourlyRate; results["laborCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCostPerUnit"] = Number.NaN; }
  try { const v = input.standardTime * input.actualTime * input.actualProduction * input.hourlyRate; results["efficiencyVariance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["efficiencyVariance"] = Number.NaN; }
  return results;
}

export function calculateZamanEtdAnalizr(input) {
  return evaluateAllFormulas(input);
}
