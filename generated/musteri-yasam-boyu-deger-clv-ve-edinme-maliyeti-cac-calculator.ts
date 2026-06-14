// Auto-generated from musteri-yasam-boyu-deger-clv-ve-edinme-maliyeti-cac-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInput {
  averagePurchaseValue: number;
  purchaseFrequency: number;
  customerLifespan: number;
  grossMargin: number;
  discountRate: number;
  totalMarketingCost: number;
  newCustomersAcquired: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInputSchema = z.object({
  averagePurchaseValue: z.number().min(0).default(100),
  purchaseFrequency: z.number().min(0).default(4),
  customerLifespan: z.number().min(0).default(5),
  grossMargin: z.number().min(0).max(100).default(30),
  discountRate: z.number().min(0).max(100).default(10),
  totalMarketingCost: z.number().min(0).default(50000),
  newCustomersAcquired: z.number().min(1).default(1000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorOutput {
  clvToCacRatio: number;
  breakdown: {
    clv: number;
    cac: number;
    clvToCacRatio: number;
    cacRatio: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.clv = ((): number => { try { const __v = input.averagePurchaseValue * input.purchaseFrequency * input.customerLifespan * (input.grossMargin / 100) / (1 + input.discountRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cac = ((): number => { try { const __v = input.totalMarketingCost / input.newCustomersAcquired; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.clvToCacRatio = ((): number => { try { const __v = results.clv / results.cac; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cacRatio = ((): number => { try { const __v = results.cac / results.clv; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculator(input: MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorInput): MusteriYasamBoyuDegerClvVeEdinmeMaliyetiCacCalculatorOutput {
  const results = evaluateFormulas(input);
  const clvToCacRatio = results.clvToCacRatio ?? 0;
  const breakdown = {
    clv: results.clv,
    cac: results.cac,
    clvToCacRatio: results.clvToCacRatio,
    cacRatio: results.cacRatio,
  };

  // rule: averagePurchaseValue must be >= 0
  // rule: purchaseFrequency must be >= 0
  // rule: customerLifespan must be >= 0
  // rule: grossMargin must be between 0 and 100
  // rule: discountRate must be between 0 and 100
  // rule: totalMarketingCost must be >= 0
  // rule: newCustomersAcquired must be >= 1
  // rule: If dataConfidence is 'low', then averagePurchaseValue, purchaseFrequency, customerLifespan must be > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): clvToCacRatio < 3 -> 'Warning: CLV/CAC ratio below 3, consider improving retention or reducing CAC'
  // threshold skipped (non-JS): cacRatio > 0.3 -> 'Critical: CAC exceeds 30% of CLV, unsustainable'

  const dataConfidenceAdjusted = (() => { try { return results.clv * (input.dataConfidence === 'high' ? 1 : input.dataConfidence === 'medium' ? 0.9 : 0.8); } catch { return clvToCacRatio; } })();

  return {
    clvToCacRatio,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report"],
  };
}
