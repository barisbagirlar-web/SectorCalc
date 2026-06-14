// Auto-generated from is-kazasi-maliyeti-gun-kaybi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IsKazasiMaliyetiGunKaybiHesaplamaInput {
  calisanSayisi: number;
  kazaliGunSayisi: number;
  kazaliCalisanMaas: number;
  gunlukCiro: number;
  ekMaliyetler: number;
  verimlilikKaybiOrani: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const IsKazasiMaliyetiGunKaybiHesaplamaInputSchema = z.object({
  calisanSayisi: z.number().min(1).max(100000).default(100),
  kazaliGunSayisi: z.number().min(0).max(365).default(10),
  kazaliCalisanMaas: z.number().min(0).max(10000).default(300),
  gunlukCiro: z.number().min(0).max(100000000).default(50000),
  ekMaliyetler: z.number().min(0).max(10000000).default(5000),
  verimlilikKaybiOrani: z.number().min(0).max(100).default(20),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface IsKazasiMaliyetiGunKaybiHesaplamaOutput {
  toplamMaliyet: number;
  breakdown: {
    dogrudanMaliyet: number;
    uretimKaybiMaliyeti: number;
    calisanBasiMaliyet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IsKazasiMaliyetiGunKaybiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dogrudanMaliyet = ((): number => { try { const __v = input.kazaliGunSayisi * input.kazaliCalisanMaas + input.ekMaliyetler; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.uretimKaybiMaliyeti = ((): number => { try { const __v = input.kazaliGunSayisi * input.gunlukCiro * (input.verimlilikKaybiOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMaliyet = ((): number => { try { const __v = results.dogrudanMaliyet + results.uretimKaybiMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.calisanBasiMaliyet = ((): number => { try { const __v = results.toplamMaliyet / input.calisanSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'dusuk' ? results.toplamMaliyet * 1.2 : (input.dataConfidence === 'orta' ? results.toplamMaliyet * 1.1 : results.toplamMaliyet); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIsKazasiMaliyetiGunKaybiHesaplama(input: IsKazasiMaliyetiGunKaybiHesaplamaInput): IsKazasiMaliyetiGunKaybiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const toplamMaliyet = results.toplamMaliyet ?? 0;
  const breakdown = {
    dogrudanMaliyet: results.dogrudanMaliyet,
    uretimKaybiMaliyeti: results.uretimKaybiMaliyeti,
    calisanBasiMaliyet: results.calisanBasiMaliyet,
  };

  // rule: calisanSayisi > 0
  // rule: kazaliGunSayisi >= 0
  // rule: kazaliCalisanMaas >= 0
  // rule: gunlukCiro >= 0
  // rule: ekMaliyetler >= 0
  // rule: verimlilikKaybiOrani >= 0 && verimlilikKaybiOrani <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Uzun sureli is goremezlik: kayip gun sayisi 30'u asti. Is sagligi ve guvenligi onlemleri gozden gecirilmeli.
  // threshold skipped (non-JS): Kritik verimlilik kaybi: oran %50'nin uzerinde. Acil mudahale ve iyilestirme plani gerekli.
  // threshold skipped (non-JS): Yuksek ek maliyet: 100.000 TL'yi asti. Sigorta ve tazminat surecleri incelenmeli.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return toplamMaliyet; } })();

  return {
    toplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirmali analiz","Detayli maliyet dokumu"],
  };
}
