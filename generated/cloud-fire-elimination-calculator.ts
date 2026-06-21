// Auto-generated premium calculator: cloud-fire-elimination
import * as z from 'zod';

export interface CloudFireEliminationInput {
  bagımsızDiskAtılSnapshot: number;
  mevcutRightSizedMaliyet: number;
  spotOranı: number;
  mesaiDısıSunucu: number;
}

export const CloudFireEliminationInputSchema = z.object({
  bagımsızDiskAtılSnapshot: z.number().min(0).default(0),
  mevcutRightSizedMaliyet: z.number().min(0).default(0),
  spotOranı: z.number().min(0).default(0),
  mesaiDısıSunucu: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.unattachedVolumes * input.rate * input.idleLBs * input.orphanSnapshots * input.storageRate; results["zombieCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["zombieCost"] = Number.NaN; }
  try { const v = input.currentCost * input.rightSizedCost * input.uptime; results["oversizingSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oversizingSavings"] = Number.NaN; }
  try { const v = input.onDemand * input.spot * input.faultTolerantHours; results["spotSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["spotSavings"] = Number.NaN; }
  try { const v = input.onDemand * input.reserved * input.commitUtil; results["reservedSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reservedSavings"] = Number.NaN; }
  try { const v = input.nonBizHours * input.runningInstances * input.hourlyRate; results["idleHoursCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["idleHoursCost"] = Number.NaN; }
  try { const v = input.zombie * input.oversizing * input.spot * input.reserved * input.idle; results["totalWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWaste"] = Number.NaN; }
  return results;
}

export function calculateCloudFireElimination(input) {
  return evaluateAllFormulas(input);
}
