// Auto-generated from enflasyon-fiyat-eskalasyonu-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EnflasyonFiyatEskalasyonuHesaplamaInput {
  basePrice: number;
  inflationRate: number;
  periodMonths: number;
  escalationMethod: 'simple' | 'compound';
  dataConfidence: number;
}

export const EnflasyonFiyatEskalasyonuHesaplamaInputSchema = z.object({
  basePrice: z.number().min(0).default(1000),
  inflationRate: z.number().min(0).max(100).default(10),
  periodMonths: z.number().min(1).max(120).default(12),
  escalationMethod: z.enum(['simple', 'compound']).default('compound'),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface EnflasyonFiyatEskalasyonuHesaplamaOutput {
  escalatedPrice: number;
  breakdown: {
    basePrice: number;
    priceIncrease: number;
    inflationRate: number;
    periodMonths: number;
    escalationMethod: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EnflasyonFiyatEskalasyonuHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.escalatedPrice = (() => { try { return 0; } catch { return 0; } })();
  results.priceIncrease = (() => { try { return results.escalatedPrice - input.basePrice; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.escalatedPrice * (input.dataConfidence/100); } catch { return 0; } })();
  return results;
}

export function calculateEnflasyonFiyatEskalasyonuHesaplama(input: EnflasyonFiyatEskalasyonuHesaplamaInput): EnflasyonFiyatEskalasyonuHesaplamaOutput {
  const results = evaluateFormulas(input);
  const escalatedPrice = results.escalatedPrice ?? 0;
  const breakdown = {
    basePrice: results.basePrice,
    priceIncrease: results.priceIncrease,
    inflationRate: results.inflationRate,
    periodMonths: results.periodMonths,
    escalationMethod: results.escalationMethod,
  };

  // rule: basePrice > 0
  // rule: inflationRate >= 0
  // rule: periodMonths >= 1
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Hiperenflasyon uyarisi: Enflasyon orani cok yuksek, sozlesme sartlarini gozden gecirin.
  // threshold skipped (non-JS): Uzun donem uyarisi: 5 yildan uzun surelerde belirsizlik artar.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return escalatedPrice; } })();

  return {
    escalatedPrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis enflasyon verileriyle)","Karsilastirma (farkli yontemler veya senaryolar)","Detayli rapor (grafiklerle)"],
  };
}
