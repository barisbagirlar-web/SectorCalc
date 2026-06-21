// Auto-generated premium calculator: hurda-orani-optimize
import * as z from 'zod';

export interface HurdaOraniOptimizeInput {
  girdiHurda: number;
  nedenler: number;
  hammaddeMakine: number;
  salvage: number;
  hedef: number;
  marj: number;
}

export const HurdaOraniOptimizeInputSchema = z.object({
  girdiHurda: z.number().min(0).default(0),
  nedenler: z.number().min(0).default(0),
  hammaddeMakine: z.number().min(0).default(0),
  salvage: z.number().min(0).default(0),
  hedef: z.number().min(0).default(0),
  marj: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.scrapQty * input.totalInput; results["scrapRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scrapRate"] = Number.NaN; }
  try { const v = input.scrapQty * input.matCost; results["costMat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costMat"] = Number.NaN; }
  try { const v = input.scrapQty * input.cycle * input.labRate; results["costLab"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costLab"] = Number.NaN; }
  try { const v = input.scrapQty * input.cycle * input.machRate; results["costOH"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costOH"] = Number.NaN; }
  try { const v = input.scrapQty * input.unitMargin; results["oppCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oppCost"] = Number.NaN; }
  try { const v = input.mat * input.lab * input.oH * input.opp * input.salvage; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.sORT * input.defects * input.freq * input.dESC; results["pareto"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pareto"] = Number.NaN; }
  try { const v = input.benchmark * input.impFactor; results["target"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["target"] = Number.NaN; }
  return results;
}

export function calculateHurdaOraniOptimize(input) {
  return evaluateAllFormulas(input);
}
