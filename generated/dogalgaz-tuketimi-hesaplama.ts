// Auto-generated from dogalgaz-tuketimi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DogalgazTuketimiHesaplamaInput {
  tuketimMiktari: number;
  birimFiyat: number;
  isitmaGunSayisi: number;
  binaIsiKaybi: number;
  verimlilik: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const DogalgazTuketimiHesaplamaInputSchema = z.object({
  tuketimMiktari: z.number().min(0).max(100000).default(100),
  birimFiyat: z.number().min(0).max(100).default(5.5),
  isitmaGunSayisi: z.number().min(0).max(365).default(180),
  binaIsiKaybi: z.number().min(0.1).max(2).default(0.6),
  verimlilik: z.number().min(50).max(100).default(90),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface DogalgazTuketimiHesaplamaOutput {
  ayl: number;
  breakdown: {
    aylikMaliyet: number;
    yillikMaliyet: number;
    birimAlanTuketim: number;
    duzeltilmisTuketim: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DogalgazTuketimiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.aylikMaliyet = ((): number => { try { const __v = input.tuketimMiktari * input.birimFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikMaliyet = ((): number => { try { const __v = results.aylikMaliyet * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimAlanTuketim = ((): number => { try { const __v = input.tuketimMiktari / (input.isitmaGunSayisi * 24 * input.binaIsiKaybi); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.duzeltilmisTuketim = ((): number => { try { const __v = input.tuketimMiktari * (100 / input.verimlilik); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceFactor = ((): number => { try { const __v = input.dataConfidence === 'yuksek' ? 1.0 : (input.dataConfidence === 'orta' ? 0.9 : 0.8); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.guvenilirMaliyet = ((): number => { try { const __v = results.aylikMaliyet * results.dataConfidenceFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDogalgazTuketimiHesaplama(input: DogalgazTuketimiHesaplamaInput): DogalgazTuketimiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const ayl = results.ayl ?? 0;
  const breakdown = {
    aylikMaliyet: results.aylikMaliyet,
    yillikMaliyet: results.yillikMaliyet,
    birimAlanTuketim: results.birimAlanTuketim,
    duzeltilmisTuketim: results.duzeltilmisTuketim,
  };

  // rule: tuketimMiktari >= 0
  // rule: birimFiyat >= 0
  // rule: isitmaGunSayisi >= 0 && isitmaGunSayisi <= 365
  // rule: binaIsiKaybi >= 0.1 && binaIsiKaybi <= 2.0
  // rule: verimlilik >= 50 && verimlilik <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Kazan verimi dusuk, bakim veya degisim onerilir.
  // threshold skipped (non-JS): Bina yalitimi zayif, enerji kaybi yuksek.

  const dataConfidenceAdjusted = (() => { try { return results.guvenilirMaliyet; } catch { return ayl; } })();

  return {
    ayl,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV raporu","Trend analizi (gecmis tuketim karsilastirmasi)","Benchmark karsilastirma (sektor ortalamasi ile)","Detayli enerji verimliligi raporu"],
  };
}
