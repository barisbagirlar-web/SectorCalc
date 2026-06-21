// Auto-generated premium calculator: renme-erisi-sre-tahmincisi
import * as z from 'zod';

export interface RenmeErisiSreTahmincisiInput {
  IlkBirimSuresi: number;
  OgrenmeOranı: number;
  hedefStandartSure: number;
  toplam UretimAdediN: number;
  saatlik IscilikMaliyeti: number;
  hataDuzeltmeSuresi: number;
}

export const RenmeErisiSreTahmincisiInputSchema = z.object({
  IlkBirimSuresi: z.number().min(0).default(0),
  OgrenmeOranı: z.number().min(0).default(0),
  hedefStandartSure: z.number().min(0).default(0),
  toplam UretimAdediN: z.number().min(0).default(0),
  saatlik IscilikMaliyeti: z.number().min(0).default(0),
  hataDuzeltmeSuresi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.time2N * input.timeN; results["learningRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["learningRate"] = Number.NaN; }
  try { const v = input.learningRate; results["slopeB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["slopeB"] = Number.NaN; }
  try { const v = input.time1 * input.n * input.b; results["timeN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["timeN"] = Number.NaN; }
  try { const v = input.time1 * input.n * input.b; results["cumulativeTimeN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cumulativeTimeN"] = Number.NaN; }
  try { const v = input.cumulativeTimeN * input.n; results["averageTimeN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageTimeN"] = Number.NaN; }
  try { const v = input.timeN * input.laborRate; results["costN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costN"] = Number.NaN; }
  try { const v = input.n * input.where * input.standardTime * input.is * input.reached; results["breakevenUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakevenUnit"] = Number.NaN; }
  try { const v = input.cumulativeTimeN * input.laborRate; results["totalLaborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLaborCost"] = Number.NaN; }
  return results;
}

export function calculateRenmeErisiSreTahmincisi(input) {
  return evaluateAllFormulas(input);
}
