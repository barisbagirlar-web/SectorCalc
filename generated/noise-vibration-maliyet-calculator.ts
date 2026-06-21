// Auto-generated premium calculator: noise-vibration-maliyet
import * as z from 'zod';

export interface NoiseVibrationMaliyetInput {
  gurultuSeviyeleriVeSureler: number;
  titresim Ivmeleri: number;
  titresimKaynaklıHataOranı: number;
  CıktıFarkı: number;
  taramaKKDSigortaMaliyeti: number;
  yalıtımYatırımı: number;
}

export const NoiseVibrationMaliyetInputSchema = z.object({
  gurultuSeviyeleriVeSureler: z.number().min(0).default(0),
  titresim Ivmeleri: z.number().min(0).default(0),
  titresimKaynaklıHataOranı: z.number().min(0).default(0),
  CıktıFarkı: z.number().min(0).default(0),
  taramaKKDSigortaMaliyeti: z.number().min(0).default(0),
  yalıtımYatırımı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.t * input.tI * input.lI; results["noiseExposureDBA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["noiseExposureDBA"] = Number.NaN; }
  try { const v = input.t * input.aI * input.tI; results["vibrationRMS"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vibrationRMS"] = Number.NaN; }
  try { const v = input.noise * input.vibration * input.limit * input.medicalScreening * input.pPECost * input.insurancePremiumHike; results["healthCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["healthCost"] = Number.NaN; }
  try { const v = input.actualOutput * input.baselineOutput * input.unitMargin; results["productivityLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["productivityLoss"] = Number.NaN; }
  try { const v = input.vibrationDefectRate * input.totalUnits * input.reworkCostPerUnit; results["reworkCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reworkCost"] = Number.NaN; }
  try { const v = input.healthCost * input.prodLoss * input.reworkCost * input.mitigationInvestment; results["mitigationROI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mitigationROI"] = Number.NaN; }
  return results;
}

export function calculateNoiseVibrationMaliyet(input) {
  return evaluateAllFormulas(input);
}
