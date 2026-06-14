// Auto-generated from ic-verim-orani-irr-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IcVerimOraniIrrHesaplamaInput {
  initialInvestment: number;
  cashFlows: number;
  periodType: 'yil' | 'ay' | 'gun';
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const IcVerimOraniIrrHesaplamaInputSchema = z.object({
  initialInvestment: z.number().min(0).default(0),
  cashFlows: z.number().default(0),
  periodType: z.enum(['yil', 'ay', 'gun']).default('yil'),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface IcVerimOraniIrrHesaplamaOutput {
  iRR: number;
  breakdown: {
    npvProfile: number;
    paybackPeriod: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IcVerimOraniIrrHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.irr = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIcVerimOraniIrrHesaplama(input: IcVerimOraniIrrHesaplamaInput): IcVerimOraniIrrHesaplamaOutput {
  const results = evaluateFormulas(input);
  const iRR = results.iRR ?? 0;
  const breakdown = {
    npvProfile: results.npvProfile,
    paybackPeriod: results.paybackPeriod,
  };

  // rule: initialInvestment > 0
  // rule: cashFlows en az 2 deger icermeli (bir negatif, bir pozitif)
  // rule: cashFlows degerleri sayi olmali
  // rule: periodType gecerli bir secenek olmali
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.15
  // threshold skipped (non-JS): IRR < 0.15 ise 'Dusuk getiri' uyarisi

  const dataConfidenceAdjusted = (() => { try { return iRR; } catch { return iRR; } })();

  return {
    iRR,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman serisi)","Karsilastirma (birden fazla proje)","Detayli rapor (NPV profili, duyarlilik grafigi)"],
  };
}
