// Auto-generated premium calculator: civate-tork
import * as z from 'zod';

export interface CivateTorkInput {
  nominal CapD: number;
  hatveP: number;
  surtunmeK: number;
  malzemeSınıfı: string;
  akmaDayanımı: number;
  hedef Ongerilme: number;
}

export const CivateTorkInputSchema = z.object({
  nominal CapD: z.number().min(0).default(0),
  hatveP: z.number().min(0).default(0),
  surtunmeK: z.number().min(0).default(0),
  malzemeSınıfı: z.number().min(0).default(0),
  akmaDayanımı: z.number().min(0).default(0),
  hedef Ongerilme: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.k * input.d * input.f; results["t"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["t"] = Number.NaN; }
  try { const v = input.preload * input.sigmaP * input.aT; results["f"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["f"] = Number.NaN; }
  try { const v = input.proofStrength; results["sigmaP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sigmaP"] = Number.NaN; }
  try { const v = input.d2 * input.d3; results["aT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aT"] = Number.NaN; }
  try { const v = input.d * input.p; results["d2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d2"] = Number.NaN; }
  try { const v = input.d * input.p; results["d3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d3"] = Number.NaN; }
  try { const v = input.sigmaP * input.yieldStrength * input.fAIL * input.pASS; results["yieldCheck"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yieldCheck"] = Number.NaN; }
  return results;
}

export function calculateCivateTork(input) {
  return evaluateAllFormulas(input);
}
