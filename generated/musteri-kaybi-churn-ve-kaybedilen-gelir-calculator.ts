// Auto-generated from musteri-kaybi-churn-ve-kaybedilen-gelir-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MusteriKaybiChurnVeKaybedilenGelirCalculatorInput {
  totalCustomers: number;
  churnedCustomers: number;
  averageRevenuePerCustomer: number;
  periodMonths: number;
  customerLifetimeMonths: number;
  discountRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const MusteriKaybiChurnVeKaybedilenGelirCalculatorInputSchema = z.object({
  totalCustomers: z.number().min(1).default(1000),
  churnedCustomers: z.number().min(0).default(50),
  averageRevenuePerCustomer: z.number().min(0).default(100),
  periodMonths: z.number().min(1).max(60).default(12),
  customerLifetimeMonths: z.number().min(1).default(36),
  discountRate: z.number().min(0).max(100).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface MusteriKaybiChurnVeKaybedilenGelirCalculatorOutput {
  annualLostRevenue: number;
  breakdown: {
    churnRate: number;
    monthlyChurnRate: number;
    lostRevenuePeriod: number;
    totalLostLifetimeValue: number;
    discountedLostRevenue: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MusteriKaybiChurnVeKaybedilenGelirCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.churnRate = ((): number => { try { const __v = input.churnedCustomers / input.totalCustomers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyChurnRate = ((): number => { try { const __v = input.churnedCustomers / (input.totalCustomers * input.periodMonths); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lostRevenuePeriod = ((): number => { try { const __v = input.churnedCustomers * input.averageRevenuePerCustomer; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualLostRevenue = ((): number => { try { const __v = results.lostRevenuePeriod * (12 / input.periodMonths); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.customerLifetimeValue = ((): number => { try { const __v = input.averageRevenuePerCustomer * input.customerLifetimeMonths; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLostLifetimeValue = ((): number => { try { const __v = input.churnedCustomers * results.customerLifetimeValue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.discountedLostRevenue = ((): number => { try { const __v = results.totalLostLifetimeValue / (1 + input.discountRate/100)^(input.periodMonths/12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMusteriKaybiChurnVeKaybedilenGelirCalculator(input: MusteriKaybiChurnVeKaybedilenGelirCalculatorInput): MusteriKaybiChurnVeKaybedilenGelirCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualLostRevenue = results.annualLostRevenue ?? 0;
  const breakdown = {
    churnRate: results.churnRate,
    monthlyChurnRate: results.monthlyChurnRate,
    lostRevenuePeriod: results.lostRevenuePeriod,
    totalLostLifetimeValue: results.totalLostLifetimeValue,
    discountedLostRevenue: results.discountedLostRevenue,
  };

  // rule: churnedCustomers <= totalCustomers
  // rule: averageRevenuePerCustomer >= 0
  // rule: periodMonths > 0
  // rule: customerLifetimeMonths > 0
  // rule: discountRate >= 0 and discountRate <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (churnRate > 0.05) hiddenLossDrivers.push("Yuksek musteri kaybi orani");
  if (lostRevenue > 100000) hiddenLossDrivers.push("Onemli gelir kaybi");

  const dataConfidenceAdjusted = (() => { try { return input.dataConfidence == 'low' ? results.annualLostRevenue * 0.8 : (input.dataConfidence == 'medium' ? results.annualLostRevenue * 0.9 : results.annualLostRevenue); } catch { return annualLostRevenue; } })();

  return {
    annualLostRevenue,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis donemlerle karsilastirma)","Detayli rapor (segment bazinda kirilim)","Simulasyon (farkli senaryolar)"],
  };
}
