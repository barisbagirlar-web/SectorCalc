// Auto-generated premium calculator: cpm-gecikme-cezasi
import * as z from 'zod';

export interface CpmGecikmeCezasiInput {
  planlananGercekSure: number;
  float: number;
  gunlukCeza: number;
  mucbirSebep: number;
  crashingMaliyeti: number;
  verimlilik: number;
}

export const CpmGecikmeCezasiInputSchema = z.object({
  planlananGercekSure: z.number().min(0).default(0),
  float: z.number().min(0).default(0),
  gunlukCeza: z.number().min(0).default(0),
  mucbirSebep: z.number().min(0).default(0),
  crashingMaliyeti: z.number().min(0).default(0),
  verimlilik: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.lateStart * input.earlyStart; results["totalFloat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFloat"] = Number.NaN; }
  try { const v = input.actual * input.planned * input.totalFloat; results["criticalDelay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["criticalDelay"] = Number.NaN; }
  try { const v = input.forceMajeure * input.ownerCaused; results["excusableDelay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["excusableDelay"] = Number.NaN; }
  try { const v = input.criticalDelay * input.excusable; results["nonExcusable"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nonExcusable"] = Number.NaN; }
  try { const v = input.nonExcusable * input.dailyPenalty; results["liquidatedDamages"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["liquidatedDamages"] = Number.NaN; }
  try { const v = input.crashingCost * input.daysAccelerated; results["accelerationCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["accelerationCost"] = Number.NaN; }
  try { const v = input.liquidatedDamages * input.accelerationCost; results["netPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netPenalty"] = Number.NaN; }
  try { const v = input.excusable * input.effFactor; results["eOTClaim"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eOTClaim"] = Number.NaN; }
  return results;
}

export function calculateCpmGecikmeCezasi(input) {
  return evaluateAllFormulas(input);
}
