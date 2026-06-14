// Auto-generated from boru-capi-akis-hizi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoruCapiAkisHiziHesaplamaInput {
  debisi: number;
  akisHizi: number;
  akiskaniTuru: 'su' | 'hava' | 'buhar' | 'yag' | 'dogalgaz';
}

export const BoruCapiAkisHiziHesaplamaInputSchema = z.object({
  debisi: z.number().min(0.0001).max(100).default(0.1),
  akisHizi: z.number().min(0.1).max(10).default(2),
  akiskaniTuru: z.enum(['su', 'hava', 'buhar', 'yag', 'dogalgaz']).default('su'),
});

export interface BoruCapiAkisHiziHesaplamaOutput {
  boruCapi: number;
  breakdown: {
    kesitAlani: number;
    reynoldsSayisi: number;
    basincKaybi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoruCapiAkisHiziHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.boruCapi = sqrt((4 * input.debisi) / (Math.PI * input.akisHizi));
  results.kesitAlani = Math.PI * Math.pow(results.boruCapi / 2, 2);
  results.reynoldsSayisi = (1000 * input.akisHizi * results.boruCapi) / 0.001;
  results.basincKaybi = 0.02 * (100 / results.boruCapi) * (1000 * Math.pow(input.akisHizi, 2) / 2);
  return results;
}

export function calculateBoruCapiAkisHiziHesaplama(input: BoruCapiAkisHiziHesaplamaInput): BoruCapiAkisHiziHesaplamaOutput {
  const results = evaluateFormulas(input);
  const boruCapi = results.boruCapi;
  const breakdown = {
    kesitAlani: results.kesitAlani,
    reynoldsSayisi: results.reynoldsSayisi,
    basincKaybi: results.basincKaybi,
  };

  // rule: Debi > 0
  // rule: Akış hızı > 0
  // rule: Akış hızı <= 10 m/s (ekonomik hız sınırı)
  // threshold akisHizi: Akış hızı > 5 m/s ise yüksek aşınma riski uyarısı
  const hiddenLossDrivers: string[] = ["Yüksek akış hızı aşınmayı artırır","Düşük Reynolds sayısı laminer akışa işaret eder"];
  const suggestedActions: string[] = ["Ekonomik boru çapı seçimi için standart çapları kontrol edin","Yüksek basınç kaybı durumunda pompa gücünü artırın"];
  const dataConfidenceAdjusted = dataConfidence input'u olmadığından uygulanmaz;

  return {
    boruCapi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Detaylı basınç kaybı hesaplamaları"],
  };
}
