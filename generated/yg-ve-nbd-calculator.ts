// Auto-generated premium calculator: yg-ve-nbd
import * as z from 'zod';

export interface YgVeNbdInput {
  IlkYatırım: number;
  yıllıkNakitAkıslarıArray: number;
  proje OmruYıl: number;
  IskontoOranıWACC: number;
  hedefROI: number;
}

export const YgVeNbdInputSchema = z.object({
  IlkYatırım: z.number().min(0).default(0),
  yıllıkNakitAkıslarıArray: z.number().min(0).default(0),
  proje OmruYıl: z.number().min(0).default(0),
  IskontoOranıWACC: z.number().min(0).default(0),
  hedefROI: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.totalNetProfit * input.totalInvestment; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  try { const v = input.cashFlowT * input.discountRate * input.t * input.initialInvestment; results["nPV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nPV"] = Number.NaN; }
  try { const v = input.rate * input.where; results["iRR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["iRR"] = Number.NaN; }
  try { const v = input.year * input.before * input.full * input.recovery * input.unrecoveredCost * input.cashFlowRecoveryYear; results["paybackPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paybackPeriod"] = Number.NaN; }
  try { const v = input.pVFutureCashFlows * input.initialInvestment; results["profitabilityIndex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitabilityIndex"] = Number.NaN; }
  try { const v = input.year * input.where * input.cumulativeDiscountedCashFlow; results["discountedPayback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountedPayback"] = Number.NaN; }
  return results;
}

export function calculateYgVeNbd(input) {
  return evaluateAllFormulas(input);
}
