// Auto-generated premium calculator: haccp-deviation
import * as z from 'zod';

export interface HaccpDeviationInput {
  karantinaHacim: number;
  bekletme: number;
  test: number;
  reworkImha: number;
  geri Cagırma: number;
  ceza: number;
}

export const HaccpDeviationInputSchema = z.object({
  karantinaHacim: z.number().min(0).default(0),
  bekletme: z.number().min(0).default(0),
  test: z.number().min(0).default(0),
  reworkImha: z.number().min(0).default(0),
  geri Cagırma: z.number().min(0).default(0),
  ceza: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.quarVol * input.holdCost * input.days; results["costHold"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costHold"] = Number.NaN; }
  try { const v = input.samples * input.labCost; results["costTest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costTest"] = Number.NaN; }
  try { const v = input.devVol * input.reworkCost; results["costRework"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costRework"] = Number.NaN; }
  try { const v = input.condVol * input.dispCost * input.lostMat; results["costDisp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costDisp"] = Number.NaN; }
  try { const v = input.notif * input.logRev * input.retailPen * input.brand; results["costRecall"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costRecall"] = Number.NaN; }
  try { const v = input.probDet * input.fineAmt; results["fine"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fine"] = Number.NaN; }
  try { const v = input.hold * input.test * input.rework * input.disp * input.recall * input.fine; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = input.sev * input.occ * input.det; results["rPN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rPN"] = Number.NaN; }
  return results;
}

export function calculateHaccpDeviation(input) {
  return evaluateAllFormulas(input);
}
