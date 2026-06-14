// Auto-generated from mil-aks-capi-hesabi-egilme-burulma-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MilAksCapiHesabiEgilmeBurulmaInput {
  egilmeMomenti: number;
  burulmaMomenti: number;
  akmaDayanimi: number;
  guvenlikKatsayisi: number;
  malzemeTuru: 'C45' | '16MnCr5' | '42CrMo4' | '34CrNiMo6';
}

export const MilAksCapiHesabiEgilmeBurulmaInputSchema = z.object({
  egilmeMomenti: z.number().min(0).default(1000),
  burulmaMomenti: z.number().min(0).default(500),
  akmaDayanimi: z.number().min(0).default(250),
  guvenlikKatsayisi: z.number().min(1).max(10).default(2),
  malzemeTuru: z.enum(['C45', '16MnCr5', '42CrMo4', '34CrNiMo6']).default('C45'),
});

export interface MilAksCapiHesabiEgilmeBurulmaOutput {
  gerekliCap: number;
  breakdown: {
    esdegerMoment: number;
    gerekliCap: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MilAksCapiHesabiEgilmeBurulmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.esdegerMoment = ((): number => { try { const __v = Math.sqrt(input.egilmeMomenti^2 + 0.75 * input.burulmaMomenti^2); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerekliCap = ((): number => { try { const __v = ((16 * results.esdegerMoment * input.guvenlikKatsayisi) / (pi * input.akmaDayanimi))^(1/3) * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMilAksCapiHesabiEgilmeBurulma(input: MilAksCapiHesabiEgilmeBurulmaInput): MilAksCapiHesabiEgilmeBurulmaOutput {
  const results = evaluateFormulas(input);
  const gerekliCap = results.gerekliCap ?? 0;
  const breakdown = {
    esdegerMoment: results.esdegerMoment,
    gerekliCap: results.gerekliCap,
  };

  // rule: egilmeMomenti >= 0
  // rule: burulmaMomenti >= 0
  // rule: akmaDayanimi > 0
  // rule: guvenlikKatsayisi >= 1
  // rule: egilmeMomenti > 0 veya burulmaMomenti > 0 olmalidir
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): UYARI: Guvenlik katsayisi cok dusuk, mil kirilma riski yuksek.
  // threshold skipped (non-JS): UYARI: Akma dayanimi dusuk, daha yuksek dayanimli malzeme secin.

  const dataConfidenceAdjusted = (() => { try { return dataConfidenceAdjusted; } catch { return gerekliCap; } })();

  return {
    gerekliCap,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
