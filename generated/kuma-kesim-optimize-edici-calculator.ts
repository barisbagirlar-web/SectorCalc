// Auto-generated premium calculator: kuma-kesim-optimize-edici
import * as z from 'zod';

export interface KumaKesimOptimizeEdiciInput {
  kumasEni: number;
  pastalBoyu: number;
  fireEndLoss: number;
  parcaAlanları: number;
  pastalVerimi: number;
  metretulFiyatı: number;
  ortalamaBindirmePayı: number;
}

export const KumaKesimOptimizeEdiciInputSchema = z.object({
  kumasEni: z.number().min(0).default(0),
  pastalBoyu: z.number().min(0).default(0),
  fireEndLoss: z.number().min(0).default(0),
  parcaAlanları: z.number().min(0).default(0),
  pastalVerimi: z.number().min(0).default(0),
  metretulFiyatı: z.number().min(0).default(0),
  ortalamaBindirmePayı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.totalPatternArea * input.markerLength * input.fabricWidth; results["markerEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["markerEfficiency"] = Number.NaN; }
  try { const v = input.totalPatternArea * input.markerEfficiency * input.endLossPct; results["fabricRequired"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fabricRequired"] = Number.NaN; }
  try { const v = input.fabricRequired * input.pricePerMeter; results["costFabric"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costFabric"] = Number.NaN; }
  try { const v = input.newEfficiency * input.oldEfficiency * input.fabricRequired * input.pricePerMeter; results["utilizationGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilizationGain"] = Number.NaN; }
  try { const v = input.splices * input.overlapLength * input.fabricWidth; results["splicingLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["splicingLoss"] = Number.NaN; }
  try { const v = input.markerLength * input.endLoss * input.splicingLoss; results["totalYardage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalYardage"] = Number.NaN; }
  return results;
}

export function calculateKumaKesimOptimizeEdici(input) {
  return evaluateAllFormulas(input);
}
