// Auto-generated premium calculator: eoq-envanter
import * as z from 'zod';

export interface EoqEnvanterInput {
  yıllıkTalep: number;
  siparisMaliyet: number;
  leadTime: number;
  tasımaMaliyet: number;
  stdDev: number;
  hizmetSeviyesi: number;
  stoksuzMaliyet: number;
}

export const EoqEnvanterInputSchema = z.object({
  yıllıkTalep: z.number().min(0).default(0),
  siparisMaliyet: z.number().min(0).default(0),
  leadTime: z.number().min(0).default(0),
  tasımaMaliyet: z.number().min(0).default(0),
  stdDev: z.number().min(0).default(0),
  hizmetSeviyesi: z.number().min(0).default(0),
  stoksuzMaliyet: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.demand * input.orderCost * input.holdingCost; results["eOQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eOQ"] = Number.NaN; }
  try { const v = input.leadTime * input.dailyDemand * input.safetyStock; results["rOP"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOP"] = Number.NaN; }
  try { const v = input.z * input.leadTime; results["safetyStock"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["safetyStock"] = Number.NaN; }
  try { const v = input.demand * input.eOQ * input.orderCost * input.safety * input.holdingCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.eOQ; results["cycleStock"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cycleStock"] = Number.NaN; }
  try { const v = input.demand * input.avgInv; results["turnover"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["turnover"] = Number.NaN; }
  try { const v = input.turnover; results["daysSales"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["daysSales"] = Number.NaN; }
  return results;
}

export function calculateEoqEnvanter(input) {
  return evaluateAllFormulas(input);
}
