// Auto-generated from yemek-tabldot-maliyet-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YemekTabldotMaliyetHesaplamaInput {
  porsiyonSayisi: number;
  birimYemekMaliyeti: number;
  iscilikSaatUcreti: number;
  calismaSuresi: number;
  enerjiMaliyeti: number;
  kiraMaliyeti: number;
  digerGiderler: number;
  fireOrani: number;
  gunlukCalismaGunu: number;
}

export const YemekTabldotMaliyetHesaplamaInputSchema = z.object({
  porsiyonSayisi: z.number().min(1).max(10000).default(100),
  birimYemekMaliyeti: z.number().min(0).max(100).default(15),
  iscilikSaatUcreti: z.number().min(0).max(500).default(50),
  calismaSuresi: z.number().min(1).max(24).default(8),
  enerjiMaliyeti: z.number().min(0).max(100000).default(3000),
  kiraMaliyeti: z.number().min(0).max(100000).default(5000),
  digerGiderler: z.number().min(0).max(50000).default(2000),
  fireOrani: z.number().min(0).max(50).default(5),
  gunlukCalismaGunu: z.number().min(1).max(31).default(26),
});

export interface YemekTabldotMaliyetHesaplamaOutput {
  birimMaliyet: number;
  breakdown: {
    aylikToplamMaliyet: number;
    aylikUretimMiktari: number;
    iscilikMaliyetiToplam: number;
    sabitMaliyetler: number;
    degiskenMaliyetler: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YemekTabldotMaliyetHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.aylikToplamMaliyet = ((): number => { try { const __v = input.porsiyonSayisi * input.birimYemekMaliyeti * input.gunlukCalismaGunu + input.iscilikSaatUcreti * input.calismaSuresi * input.gunlukCalismaGunu + input.enerjiMaliyeti + input.kiraMaliyeti + input.digerGiderler; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikUretimMiktari = ((): number => { try { const __v = input.porsiyonSayisi * input.gunlukCalismaGunu * (1 - input.fireOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimMaliyet = ((): number => { try { const __v = results.aylikToplamMaliyet / results.aylikUretimMiktari; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.iscilikMaliyetiToplam = ((): number => { try { const __v = input.iscilikSaatUcreti * input.calismaSuresi * input.gunlukCalismaGunu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sabitMaliyetler = ((): number => { try { const __v = input.enerjiMaliyeti + input.kiraMaliyeti + input.digerGiderler; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.degiskenMaliyetler = ((): number => { try { const __v = input.porsiyonSayisi * input.birimYemekMaliyeti * input.gunlukCalismaGunu + results.iscilikMaliyetiToplam; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYemekTabldotMaliyetHesaplama(input: YemekTabldotMaliyetHesaplamaInput): YemekTabldotMaliyetHesaplamaOutput {
  const results = evaluateFormulas(input);
  const birimMaliyet = results.birimMaliyet ?? 0;
  const breakdown = {
    aylikToplamMaliyet: results.aylikToplamMaliyet,
    aylikUretimMiktari: results.aylikUretimMiktari,
    iscilikMaliyetiToplam: results.iscilikMaliyetiToplam,
    sabitMaliyetler: results.sabitMaliyetler,
    degiskenMaliyetler: results.degiskenMaliyetler,
  };

  // rule: porsiyonSayisi > 0
  // rule: birimYemekMaliyeti >= 0
  // rule: iscilikSaatUcreti >= 0
  // rule: calismaSuresi > 0
  // rule: enerjiMaliyeti >= 0
  // rule: kiraMaliyeti >= 0
  // rule: digerGiderler >= 0
  // rule: fireOrani >= 0 && fireOrani <= 50
  // rule: gunlukCalismaGunu >= 1 && gunlukCalismaGunu <= 31
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Fire orani %10'un uzerinde, surec iyilestirme onerilir.
  // threshold skipped (non-JS): Birim maliyet yuksek, tedarikci alternatifleri degerlendirilmeli.

  const dataConfidenceAdjusted = (() => { try { return results.birimMaliyet * (1 + (1 - dataConfidence) * 0.1); } catch { return birimMaliyet; } })();

  return {
    birimMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV raporu","Trend analizi (zaman serisi)","Karsilastirmali senaryo analizi","Detayli maliyet kirilimi grafikleri"],
  };
}
