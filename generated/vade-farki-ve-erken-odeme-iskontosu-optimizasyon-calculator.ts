// Auto-generated from vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInput {
  invoiceAmount: number;
  paymentTermDays: number;
  earlyPaymentDays: number;
  annualInterestRate: number;
  discountRate: number;
  calculationMode: 'iskonto' | 'vadeFarki';
  dataConfidence: number;
}

export const VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInputSchema = z.object({
  invoiceAmount: z.number().min(0).default(100000),
  paymentTermDays: z.number().min(1).max(365).default(30),
  earlyPaymentDays: z.number().min(0).max(365).default(10),
  annualInterestRate: z.number().min(0).max(100).default(15),
  discountRate: z.number().min(0).max(100).default(2),
  calculationMode: z.enum(['iskonto', 'vadeFarki']).default('iskonto'),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorOutput {
  netBenefit: number;
  breakdown: {
    earlyPaymentDiscountAmount: number;
    vadeFarkiAmount: number;
    effectiveDiscountRate: number;
    annualizedReturn: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dailyInterestRate = ((): number => { try { const __v = input.annualInterestRate / 100 / 365; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.earlyPaymentDiscountAmount = ((): number => { try { const __v = input.invoiceAmount * input.discountRate / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.vadeFarkiAmount = ((): number => { try { const __v = input.invoiceAmount * results.dailyInterestRate * (input.paymentTermDays - input.earlyPaymentDays); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netBenefit = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveDiscountRate = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualizedReturn = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.netBenefit * input.dataConfidence / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateVadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator(input: VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorInput): VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const netBenefit = results.netBenefit ?? 0;
  const breakdown = {
    earlyPaymentDiscountAmount: results.earlyPaymentDiscountAmount,
    vadeFarkiAmount: results.vadeFarkiAmount,
    effectiveDiscountRate: results.effectiveDiscountRate,
    annualizedReturn: results.annualizedReturn,
  };

  // rule: earlyPaymentDays <= paymentTermDays
  // rule: if calculationMode == 'iskonto' then discountRate > 0
  // rule: if calculationMode == 'vadeFarki' then annualInterestRate > 0
  // rule: invoiceAmount > 0
  // rule: paymentTermDays > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek iskonto orani, tedarikci finansal sikinti isareti olabilir.
  // threshold skipped (non-JS): Cok yuksek faiz orani, enflasyon veya risk gostergesi.
  // threshold skipped (non-JS): Erken odeme cok yakin, iskonto etkisi sinirli.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return netBenefit; } })();

  return {
    netBenefit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV Export","Trend Analizi","Karsilastirma (Farkli senaryolar)","Detayli Rapor"],
  };
}
