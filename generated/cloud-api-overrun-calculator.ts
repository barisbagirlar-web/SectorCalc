// Auto-generated premium calculator: cloud-api-overrun
import * as z from 'zod';

export interface CloudApiOverrunInput {
  aylıkToplamDahil Istek: number;
  asım Ucreti: number;
  veri CıkısıGB: number;
  egressFiyat: number;
  sLATaahhutGercekUptime: number;
}

export const CloudApiOverrunInputSchema = z.object({
  aylıkToplamDahil Istek: z.number().min(0).default(0),
  asım Ucreti: z.number().min(0).default(0),
  veri CıkısıGB: z.number().min(0).default(0),
  egressFiyat: z.number().min(0).default(0),
  sLATaahhutGercekUptime: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.totalRequests * input.includedRequests; results["overrunRequests"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overrunRequests"] = Number.NaN; }
  try { const v = input.overrunRequests * input.overageRate; results["overrunCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overrunCost"] = Number.NaN; }
  try { const v = input.throttledRequests * input.retryCost * input.avgRetries; results["throttlingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["throttlingCost"] = Number.NaN; }
  try { const v = input.dataOutGB * input.egressRate; results["dataEgressCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dataEgressCost"] = Number.NaN; }
  try { const v = input.availability * input.sLA * input.monthlyFee * input.creditPct; results["sLABreachPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sLABreachPenalty"] = Number.NaN; }
  try { const v = input.overrunCost * input.throttlingCost * input.dataEgressCost * input.sLABreachPenalty; results["totalOverrunCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOverrunCost"] = Number.NaN; }
  return results;
}

export function calculateCloudApiOverrun(input) {
  return evaluateAllFormulas(input);
}
