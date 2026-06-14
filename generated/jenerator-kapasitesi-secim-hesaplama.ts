// Auto-generated from jenerator-kapasitesi-secim-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface JeneratorKapasitesiSecimHesaplamaInput {
  toplamGucIhtiyaci: number;
  yedeklilikFaktoru: number;
  calismaSuresiGunluk: number;
  calismaGunuAylik: number;
  yakitTuketimOrani: number;
  yakitFiyati: number;
  jeneratorTipi: 'dizel' | 'gaz' | 'benzin';
  bakimMaliyetiYillik: number;
  yatirimMaliyeti: number;
  ekonomikOmur: number;
  iskontoOrani: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const JeneratorKapasitesiSecimHesaplamaInputSchema = z.object({
  toplamGucIhtiyaci: z.number().min(1).max(10000).default(100),
  yedeklilikFaktoru: z.number().min(1).max(2).default(1.2),
  calismaSuresiGunluk: z.number().min(1).max(24).default(8),
  calismaGunuAylik: z.number().min(1).max(31).default(22),
  yakitTuketimOrani: z.number().min(0.1).max(0.6).default(0.3),
  yakitFiyati: z.number().min(1).max(50).default(7.5),
  jeneratorTipi: z.enum(['dizel', 'gaz', 'benzin']).default('dizel'),
  bakimMaliyetiYillik: z.number().min(0).max(100000).default(5000),
  yatirimMaliyeti: z.number().min(1000).max(10000000).default(50000),
  ekonomikOmur: z.number().min(1).max(30).default(15),
  iskontoOrani: z.number().min(0).max(100).default(10),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface JeneratorKapasitesiSecimHesaplamaOutput {
  birimEnerjiMaliyeti: number;
  breakdown: {
    seciliKapasite: number;
    yillikEnerjiUretimi: number;
    yillikYakitMaliyeti: number;
    yillikBakimMaliyeti: number;
    yillikAmortisman: number;
    yillikToplamMaliyet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: JeneratorKapasitesiSecimHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.seciliKapasite = ((): number => { try { const __v = input.toplamGucIhtiyaci * input.yedeklilikFaktoru; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikCalismaSaati = ((): number => { try { const __v = input.calismaSuresiGunluk * input.calismaGunuAylik; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikCalismaSaati = ((): number => { try { const __v = results.aylikCalismaSaati * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikEnerjiUretimi = ((): number => { try { const __v = results.seciliKapasite * results.yillikCalismaSaati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikYakitTuketimi = ((): number => { try { const __v = results.yillikEnerjiUretimi * input.yakitTuketimOrani; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikYakitMaliyeti = ((): number => { try { const __v = results.yillikYakitTuketimi * input.yakitFiyati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikBakimMaliyeti = ((): number => { try { const __v = input.bakimMaliyetiYillik; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikToplamIsletmeMaliyeti = ((): number => { try { const __v = results.yillikYakitMaliyeti + results.yillikBakimMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikAmortisman = ((): number => { try { const __v = input.yatirimMaliyeti / input.ekonomikOmur; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikToplamMaliyet = ((): number => { try { const __v = results.yillikToplamIsletmeMaliyeti + results.yillikAmortisman; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimEnerjiMaliyeti = ((): number => { try { const __v = results.yillikToplamMaliyet / results.yillikEnerjiUretimi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateJeneratorKapasitesiSecimHesaplama(input: JeneratorKapasitesiSecimHesaplamaInput): JeneratorKapasitesiSecimHesaplamaOutput {
  const results = evaluateFormulas(input);
  const birimEnerjiMaliyeti = results.birimEnerjiMaliyeti ?? 0;
  const breakdown = {
    seciliKapasite: results.seciliKapasite,
    yillikEnerjiUretimi: results.yillikEnerjiUretimi,
    yillikYakitMaliyeti: results.yillikYakitMaliyeti,
    yillikBakimMaliyeti: results.yillikBakimMaliyeti,
    yillikAmortisman: results.yillikAmortisman,
    yillikToplamMaliyet: results.yillikToplamMaliyet,
  };

  // rule: toplamGucIhtiyaci > 0
  // rule: yedeklilikFaktoru >= 1.0
  // rule: calismaSuresiGunluk >= 1 && calismaSuresiGunluk <= 24
  // rule: calismaGunuAylik >= 1 && calismaGunuAylik <= 31
  // rule: yakitTuketimOrani > 0
  // rule: yakitFiyati > 0
  // rule: bakimMaliyetiYillik >= 0
  // rule: yatirimMaliyeti > 0
  // rule: ekonomikOmur > 0
  // rule: iskontoOrani >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if yakitMaliyetiAylik > 10000 then 'Yakit maliyeti cok yuksek'
  // threshold skipped (non-JS): if toplamMaliyetYillik > 200000 then 'Yillik toplam maliyet yuksek'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return birimEnerjiMaliyeti; } })();

  return {
    birimEnerjiMaliyeti,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
