// Auto-generated premium calculator: rneklem-bykl-endstri-mhendislii
import * as z from 'zod';

export interface RneklemByklEndstriMhendisliiInput {
  populasyonN: number;
  guvenSeviyesiZ: number;
  hataPayıE: number;
  tahminiOranP: number;
  stdDevSigma: number;
  iCC: number;
  birimMuayeneMaliyeti: number;
}

export const RneklemByklEndstriMhendisliiInputSchema = z.object({
  populasyonN: z.number().min(0).default(0),
  guvenSeviyesiZ: z.number().min(0).default(0),
  hataPayıE: z.number().min(0).default(0),
  tahminiOranP: z.number().min(0).default(0),
  stdDevSigma: z.number().min(0).default(0),
  iCC: z.number().min(0).default(0),
  birimMuayeneMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.z * input.p * input.e; results["nInfinite"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nInfinite"] = Number.NaN; }
  try { const v = input.nInfinite * input.n; results["nFinite"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nFinite"] = Number.NaN; }
  try { const v = input.z * input.sigma * input.e; results["nContinuous"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nContinuous"] = Number.NaN; }
  try { const v = input.n * input.zBeta * input.zAlpha; results["powerAdjusted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerAdjusted"] = Number.NaN; }
  try { const v = input.clusterSize * input.iCC; results["designEffect"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["designEffect"] = Number.NaN; }
  try { const v = input.nFinite * input.designEffect; results["finalN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalN"] = Number.NaN; }
  try { const v = input.finalN * input.costPerUnit; results["costSampling"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costSampling"] = Number.NaN; }
  return results;
}

export function calculateRneklemByklEndstriMhendislii(input) {
  return evaluateAllFormulas(input);
}
