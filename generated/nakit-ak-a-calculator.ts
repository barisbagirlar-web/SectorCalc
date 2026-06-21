// Auto-generated premium calculator: nakit-ak-a
import * as z from 'zod';

export interface NakitAkAInput {
  aylıkNakitGirisCıkıs: number;
  alacakBorcStokBakiyeleri: number;
  krediSatıslar: number;
  vadeGun: number;
  krediAlımlar: number;
  gunlukFaizOranı: number;
}

export const NakitAkAInputSchema = z.object({
  aylıkNakitGirisCıkıs: z.number().min(0).default(0),
  alacakBorcStokBakiyeleri: z.number().min(0).default(0),
  krediSatıslar: z.number().min(0).default(0),
  vadeGun: z.number().min(0).default(0),
  krediAlımlar: z.number().min(0).default(0),
  gunlukFaizOranı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.receiptsT; results["cashInflow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cashInflow"] = Number.NaN; }
  try { const v = input.paymentsT; results["cashOutflow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cashOutflow"] = Number.NaN; }
  try { const v = input.cashInflowT * input.cashOutflowT; results["netCashFlowT"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netCashFlowT"] = Number.NaN; }
  try { const v = input.netCashFlowT; results["cumulativeCashFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cumulativeCashFlow"] = Number.NaN; }
  try { const v = input.cumulativeCashFlow; results["cashGap"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cashGap"] = Number.NaN; }
  try { const v = input.accountsReceivable * input.totalCreditSales * input.days; results["dSO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dSO"] = Number.NaN; }
  try { const v = input.accountsPayable * input.totalCreditPurchases * input.days; results["dPO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dPO"] = Number.NaN; }
  try { const v = input.inventory * input.cOGS * input.days; results["dIO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dIO"] = Number.NaN; }
  try { const v = input.dSO * input.dIO * input.dPO; results["cashConversionCycle"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cashConversionCycle"] = Number.NaN; }
  try { const v = input.cashGap * input.dailyInterestRate; results["financingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["financingCost"] = Number.NaN; }
  return results;
}

export function calculateNakitAkA(input) {
  return evaluateAllFormulas(input);
}
