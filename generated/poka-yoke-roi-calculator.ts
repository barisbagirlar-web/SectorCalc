// Auto-generated premium calculator: poka-yoke-roi
import * as z from 'zod';

export interface PokaYokeRoiInput {
  mevcutHataOranı: number;
  hataBasınaMaliyet: number;
  etkililik: number;
  yıllık Uretim: number;
  tasarımUygulamaEgitimMaliyeti: number;
  yıllıkBakımMaliyeti: number;
}

export const PokaYokeRoiInputSchema = z.object({
  mevcutHataOranı: z.number().min(0).default(0),
  hataBasınaMaliyet: z.number().min(0).default(0),
  etkililik: z.number().min(0).default(0),
  yıllık Uretim: z.number().min(0).default(0),
  tasarımUygulamaEgitimMaliyeti: z.number().min(0).default(0),
  yıllıkBakımMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.defects * input.totalUnits; results["currentDefectRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentDefectRate"] = Number.NaN; }
  try { const v = input.currentDefectRate * input.totalUnits * input.costPerDefect; results["defectCostAnnual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["defectCostAnnual"] = Number.NaN; }
  try { const v = input.design * input.implementation * input.training * input.maintenance; results["pokaYokeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pokaYokeCost"] = Number.NaN; }
  try { const v = input.currentDefectRate * input.effectiveness; results["newDefectRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newDefectRate"] = Number.NaN; }
  try { const v = input.currentDefectRate * input.newDefectRate * input.totalUnits * input.costPerDefect; results["savings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["savings"] = Number.NaN; }
  try { const v = input.savings * input.pokaYokeCost; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  try { const v = input.pokaYokeCost * input.savings; results["paybackMonths"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paybackMonths"] = Number.NaN; }
  return results;
}

export function calculatePokaYokeRoi(input) {
  return evaluateAllFormulas(input);
}
