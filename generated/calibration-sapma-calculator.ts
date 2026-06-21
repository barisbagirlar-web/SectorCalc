// Auto-generated premium calculator: calibration-sapma
import * as z from 'zod';

export interface CalibrationSapmaInput {
  sonOncekiHata: number;
  kalibrasyonlarArasıSure: number;
  tolerans: number;
  kritiklik: string;
  bazAralık: number;
  birimHataEtkisi: number;
}

export const CalibrationSapmaInputSchema = z.object({
  sonOncekiHata: z.number().min(0).default(0),
  kalibrasyonlarArasıSure: z.number().min(0).default(0),
  tolerans: z.number().min(0).default(0),
  kritiklik: z.number().min(0).default(0),
  bazAralık: z.number().min(0).default(0),
  birimHataEtkisi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.lastError * input.prevError * input.timeBetween; results["driftRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["driftRate"] = Number.NaN; }
  try { const v = input.driftRate * input.timeSinceLast; results["predictedDrift"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["predictedDrift"] = Number.NaN; }
  try { const v = input.baseUncertainty * input.predictedDrift * input.envFactor; results["currentUncertainty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentUncertainty"] = Number.NaN; }
  try { const v = input.currentUncertainty * input.tolerance * input.criticality * input.usageFreq; results["riskScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskScore"] = Number.NaN; }
  try { const v = input.baseInterval * input.tolerance * input.currentUncertainty; results["optimalInterval"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalInterval"] = Number.NaN; }
  try { const v = input.expandedUncertainty * input.k; results["guardBand"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["guardBand"] = Number.NaN; }
  return results;
}

export function calculateCalibrationSapma(input) {
  return evaluateAllFormulas(input);
}
