// Auto-generated premium calculator: clv-cac-orani
import * as z from 'zod';

export interface ClvCacOraniInput {
  butce: number;
  yeniMusteri: number;
  siparisDegeri: number;
  sıklık: number;
  yasamSuresi: number;
  churn: number;
  brutMarj: number;
  wACC: number;
}

export const ClvCacOraniInputSchema = z.object({
  butce: z.number().min(0).default(0),
  yeniMusteri: z.number().min(0).default(0),
  siparisDegeri: z.number().min(0).default(0),
  sıklık: z.number().min(0).default(0),
  yasamSuresi: z.number().min(0).default(0),
  churn: z.number().min(0).default(0),
  brutMarj: z.number().min(0).default(0),
  wACC: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.avgOrderValue * input.purchaseFreq * input.lifespan; results["cLV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cLV"] = Number.NaN; }
  try { const v = input.cLV * input.grossMarginPct; results["grossMarginCLV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossMarginCLV"] = Number.NaN; }
  try { const v = input.grossMarginCLV * input.retention * input.t * input.discountRate; results["discountedCLV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountedCLV"] = Number.NaN; }
  try { const v = input.salesMarketing * input.salaries * input.overhead * input.newCustomers; results["cAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cAC"] = Number.NaN; }
  try { const v = input.cAC * input.avgMonthlyGrossProfit; results["payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["payback"] = Number.NaN; }
  try { const v = input.discountedCLV * input.cAC; results["lTVCAC"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lTVCAC"] = Number.NaN; }
  return results;
}

export function calculateClvCacOrani(input) {
  return evaluateAllFormulas(input);
}
