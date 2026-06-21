// Auto-generated premium calculator: deme-vadesi-optimize-edici
import * as z from 'zod';

export interface DemeVadesiOptimizeEdiciInput {
  yıllıkGelir: number;
  ortalamaVadeGun: number;
  wACC: number;
  erken Odeme Iskontosu: number;
  IskontoKullanımOranı: number;
  temerrutBatmaOranı: number;
  alacakBakiyesi: number;
}

export const DemeVadesiOptimizeEdiciInputSchema = z.object({
  yıllıkGelir: z.number().min(0).default(0),
  ortalamaVadeGun: z.number().min(0).default(0),
  wACC: z.number().min(0).default(0),
  erken Odeme Iskontosu: z.number().min(0).default(0),
  IskontoKullanımOranı: z.number().min(0).default(0),
  temerrutBatmaOranı: z.number().min(0).default(0),
  alacakBakiyesi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.accountsReceivable * input.revenue * input.days; results["dSO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dSO"] = Number.NaN; }
  try { const v = input.averageAR * input.wACC; results["carryingCostAR"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carryingCostAR"] = Number.NaN; }
  try { const v = input.revenue * input.defaultRate; results["badDebtExpense"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["badDebtExpense"] = Number.NaN; }
  try { const v = input.earlyPaymentDiscountPct * input.discountTakeRate * input.revenue; results["discountCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountCost"] = Number.NaN; }
  try { const v = input.terms * input.where * input.carryingCost * input.badDebt * input.discountCost * input.is * input.mINIMUM; results["optimalTerms"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalTerms"] = Number.NaN; }
  try { const v = input.newDSO * input.oldDSO * input.revenue; results["cashFlowImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cashFlowImpact"] = Number.NaN; }
  try { const v = input.cashInflowT * input.dailyWACC * input.t; results["nPVTerms"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nPVTerms"] = Number.NaN; }
  return results;
}

export function calculateDemeVadesiOptimizeEdici(input) {
  return evaluateAllFormulas(input);
}
