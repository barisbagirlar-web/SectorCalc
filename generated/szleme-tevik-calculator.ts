// Auto-generated premium calculator: szleme-tevik
import * as z from 'zod';

export interface SzlemeTevikInput {
  hedefMaliyet: number;
  hedefKar: number;
  paylasımOranı: number;
  gerceklesenMaliyet: number;
  metrikAgırlıklarıSkorları: number;
  minMaxKar Carpanları: number;
}

export const SzlemeTevikInputSchema = z.object({
  hedefMaliyet: z.number().min(0).default(0),
  hedefKar: z.number().min(0).default(0),
  paylasımOranı: z.number().min(0).default(0),
  gerceklesenMaliyet: z.number().min(0).default(0),
  metrikAgırlıklarıSkorları: z.number().min(0).default(0),
  minMaxKar Carpanları: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.baselineEstimate; results["targetCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["targetCost"] = Number.NaN; }
  try { const v = input.targetCost * input.targetFeePct; results["targetFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["targetFee"] = Number.NaN; }
  try { const v = input.overrunShare * input.underrunShare; results["shareRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shareRatio"] = Number.NaN; }
  try { const v = input.targetFee * input.targetCost * input.actualCost * input.contractorSharePct; results["actualFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualFee"] = Number.NaN; }
  try { const v = input.targetFee * input.maxFeeMultiplier; results["maxFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxFee"] = Number.NaN; }
  try { const v = input.targetFee * input.minFeeMultiplier; results["minFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["minFee"] = Number.NaN; }
  try { const v = input.actualFee * input.minFee * input.maxFee; results["finalFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalFee"] = Number.NaN; }
  try { const v = input.actualCost * input.finalFee; results["finalPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalPrice"] = Number.NaN; }
  try { const v = input.metricWeightI * input.metricScoreI * input.bonusPool; results["performanceBonus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["performanceBonus"] = Number.NaN; }
  return results;
}

export function calculateSzlemeTevik(input) {
  return evaluateAllFormulas(input);
}
