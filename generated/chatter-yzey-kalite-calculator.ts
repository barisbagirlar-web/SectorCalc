// Auto-generated premium calculator: chatter-yzey-kalite
import * as z from 'zod';

export interface ChatterYzeyKaliteInput {
  kesmeHızıVc: number;
  devirN: number;
  IlerlemeVf: number;
  disSayısıZ: number;
  takımUcuRadyusu: number;
  titresimGenligi: number;
  raLimiti: number;
}

export const ChatterYzeyKaliteInputSchema = z.object({
  kesmeHızıVc: z.number().min(0).default(0),
  devirN: z.number().min(0).default(0),
  IlerlemeVf: z.number().min(0).default(0),
  disSayısıZ: z.number().min(0).default(0),
  takımUcuRadyusu: z.number().min(0).default(0),
  titresimGenligi: z.number().min(0).default(0),
  raLimiti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.d * input.n; results["vC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vC"] = Number.NaN; }
  try { const v = input.vF * input.z * input.n; results["fZ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fZ"] = Number.NaN; }
  try { const v = input.fZ * input.rEpsilon; results["surfaceRoughnessTheo"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["surfaceRoughnessTheo"] = Number.NaN; }
  try { const v = input.theo * input.chatterAmplification; results["surfaceRoughnessActual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["surfaceRoughnessActual"] = Number.NaN; }
  try { const v = input.actual * input.toleranceLimit * input.reworkCostPerMicron; results["qualityLossCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualityLossCost"] = Number.NaN; }
  try { const v = input.actual * input.maxTolerance * input.batchSize; results["scrapRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scrapRate"] = Number.NaN; }
  return results;
}

export function calculateChatterYzeyKalite(input) {
  return evaluateAllFormulas(input);
}
