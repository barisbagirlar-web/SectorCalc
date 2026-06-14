// Auto-generated from temizlik-ve-hijyen-kimyasal-tuketim-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInput {
  alanMetrekare: number;
  temizlikSikligi: number;
  kimyasalDozaj: number;
  kimyasalBirimFiyat: number;
  iscilikSaatlikUcret: number;
  temizlikSuresiMetrekareBasi: number;
  calismaGunuAy: number;
  atikBertarafMaliyeti: number;
  kimyasalYogunluk: number;
  optimizasyonHedefi: 'maliyet' | 'cevreselEtki' | 'denge';
}

export const TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInputSchema = z.object({
  alanMetrekare: z.number().min(1).max(100000).default(1000),
  temizlikSikligi: z.number().min(1).max(10).default(2),
  kimyasalDozaj: z.number().min(0.1).max(100).default(5),
  kimyasalBirimFiyat: z.number().min(0.01).max(1000).default(50),
  iscilikSaatlikUcret: z.number().min(0).max(500).default(30),
  temizlikSuresiMetrekareBasi: z.number().min(0.01).max(10).default(0.5),
  calismaGunuAy: z.number().min(1).max(31).default(30),
  atikBertarafMaliyeti: z.number().min(0).max(100).default(2),
  kimyasalYogunluk: z.number().min(0.5).max(2).default(1),
  optimizasyonHedefi: z.enum(['maliyet', 'cevreselEtki', 'denge']).default('maliyet'),
});

export interface TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorOutput {
  optimizeEdilmisAylikToplamMaliyet: number;
  breakdown: {
    mevcutDurum: number;
    optimizeEdilmis: number;
    tasarrufOrani: number;
    cevreselEtkiPuani: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.gunlukKimyasalHacim = ((): number => { try { const __v = input.alanMetrekare * input.temizlikSikligi * input.kimyasalDozaj / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikKimyasalHacim = ((): number => { try { const __v = results.gunlukKimyasalHacim * input.calismaGunuAy; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikKimyasalMaliyet = ((): number => { try { const __v = results.aylikKimyasalHacim * input.kimyasalBirimFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gunlukTemizlikSuresiSaat = ((): number => { try { const __v = input.alanMetrekare * input.temizlikSuresiMetrekareBasi / 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikTemizlikSuresiSaat = ((): number => { try { const __v = results.gunlukTemizlikSuresiSaat * input.calismaGunuAy; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikIscilikMaliyeti = ((): number => { try { const __v = results.aylikTemizlikSuresiSaat * input.iscilikSaatlikUcret; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikAtikMiktariKg = ((): number => { try { const __v = results.aylikKimyasalHacim * input.kimyasalYogunluk * 0.1; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikAtikMaliyeti = ((): number => { try { const __v = results.aylikAtikMiktariKg * input.atikBertarafMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikToplamMaliyet = ((): number => { try { const __v = results.aylikKimyasalMaliyet + results.aylikIscilikMaliyeti + results.aylikAtikMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cevreselEtkiPuani = ((): number => { try { const __v = results.aylikKimyasalHacim * 0.5 + results.aylikAtikMiktariKg * 0.3; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimizeEdilmisDozaj = ((): number => { try { const __v = input.optimizasyonHedefi == 'maliyet' ? input.kimyasalDozaj * 0.9 : (input.optimizasyonHedefi == 'cevreselEtki' ? input.kimyasalDozaj * 0.8 : input.kimyasalDozaj * 0.85); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimizeEdilmisAylikKimyasalHacim = ((): number => { try { const __v = input.alanMetrekare * input.temizlikSikligi * results.optimizeEdilmisDozaj / 1000 * input.calismaGunuAy; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimizeEdilmisAylikKimyasalMaliyet = ((): number => { try { const __v = results.optimizeEdilmisAylikKimyasalHacim * input.kimyasalBirimFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimizeEdilmisAylikAtikMiktariKg = ((): number => { try { const __v = results.optimizeEdilmisAylikKimyasalHacim * input.kimyasalYogunluk * 0.1; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimizeEdilmisAylikAtikMaliyeti = ((): number => { try { const __v = results.optimizeEdilmisAylikAtikMiktariKg * input.atikBertarafMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimizeEdilmisAylikToplamMaliyet = ((): number => { try { const __v = results.optimizeEdilmisAylikKimyasalMaliyet + results.aylikIscilikMaliyeti + results.optimizeEdilmisAylikAtikMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tasarrufOrani = ((): number => { try { const __v = (results.aylikToplamMaliyet - results.optimizeEdilmisAylikToplamMaliyet) / results.aylikToplamMaliyet * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator(input: TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorInput): TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const optimizeEdilmisAylikToplamMaliyet = results.optimizeEdilmisAylikToplamMaliyet ?? 0;
  const breakdown = {
    mevcutDurum: results.mevcutDurum,
    optimizeEdilmis: results.optimizeEdilmisDozaj,
    tasarrufOrani: results.tasarrufOrani,
    cevreselEtkiPuani: results.cevreselEtkiPuani,
  };

  // rule: alanMetrekare > 0
  // rule: temizlikSikligi >= 1
  // rule: kimyasalDozaj > 0
  // rule: kimyasalBirimFiyat > 0
  // rule: iscilikSaatlikUcret >= 0
  // rule: temizlikSuresiMetrekareBasi > 0
  // rule: calismaGunuAy >= 1 && calismaGunuAy <= 31
  // rule: atikBertarafMaliyeti >= 0
  // rule: kimyasalYogunluk > 0
  // rule: optimizasyonHedefi == 'maliyet' || optimizasyonHedefi == 'cevreselEtki' || optimizasyonHedefi == 'denge'
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek kimyasal dozaji: cevresel etki ve maliyet artisi riski
  // threshold skipped (non-JS): Dusuk verimlilik: temizlik suresi cok uzun
  // threshold skipped (non-JS): Yuksek iscilik maliyeti

  const dataConfidenceAdjusted = (() => { try { return results.optimizeEdilmisAylikToplamMaliyet * 1.1; } catch { return optimizeEdilmisAylikToplamMaliyet; } })();

  return {
    optimizeEdilmisAylikToplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli senaryolar)","Detayli rapor"],
  };
}
