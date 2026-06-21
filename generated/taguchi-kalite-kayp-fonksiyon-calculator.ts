// Auto-generated premium calculator: taguchi-kalite-kayp-fonksiyon
import * as z from 'zod';

export interface TaguchiKaliteKaypFonksiyonInput {
  hedefDeger: number;
  toleransSınırı: number;
  toleranstaMaliyet: number;
  gerceklesenOrtalama: number;
  varyans: number;
  yıllık Uretim: number;
  sNOranıTipi: string;
}

export const TaguchiKaliteKaypFonksiyonInputSchema = z.object({
  hedefDeger: z.number().min(0).default(0),
  toleransSınırı: z.number().min(0).default(0),
  toleranstaMaliyet: z.number().min(0).default(0),
  gerceklesenOrtalama: z.number().min(0).default(0),
  varyans: z.number().min(0).default(0),
  yıllık Uretim: z.number().min(0).default(0),
  sNOranıTipi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.k * input.actualValue * input.targetValue; results["lossPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossPerUnit"] = Number.NaN; }
  try { const v = input.costAtTolerance * input.tolerance; results["k"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["k"] = Number.NaN; }
  try { const v = input.k * input.variance * input.mean * input.target; results["averageLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageLoss"] = Number.NaN; }
  try { const v = input.averageLoss * input.annualProduction; results["totalAnnualLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAnnualLoss"] = Number.NaN; }
  try { const v = input.yI * input.n; results["signalToNoiseLargerBetter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["signalToNoiseLargerBetter"] = Number.NaN; }
  try { const v = input.yI * input.n; results["signalToNoiseSmallerBetter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["signalToNoiseSmallerBetter"] = Number.NaN; }
  try { const v = input.oldAverageLoss * input.newAverageLoss * input.annualProduction; results["qualityImprovementSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualityImprovementSavings"] = Number.NaN; }
  return results;
}

export function calculateTaguchiKaliteKaypFonksiyon(input) {
  return evaluateAllFormulas(input);
}
