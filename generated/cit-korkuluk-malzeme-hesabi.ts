// Auto-generated from cit-korkuluk-malzeme-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CitKorkulukMalzemeHesabiInput {
  korkulukBoyu: number;
  korkulukYuksekligi: number;
  malzemeTuru: 'celik' | 'aluminyum' | 'paslanmaz';
  profilKesiti: 'kare40x40' | 'kare50x50' | 'dikdortgen40x60' | 'dairesel42.4';
  dikeyAralik: number;
  yatayKisitSayisi: number;
  birimFiyat: number;
  iscilikFaktoru: number;
}

export const CitKorkulukMalzemeHesabiInputSchema = z.object({
  korkulukBoyu: z.number().min(1).max(1000).default(10),
  korkulukYuksekligi: z.number().min(0.5).max(2.5).default(1.1),
  malzemeTuru: z.enum(['celik', 'aluminyum', 'paslanmaz']).default('celik'),
  profilKesiti: z.enum(['kare40x40', 'kare50x50', 'dikdortgen40x60', 'dairesel42.4']).default('kare40x40'),
  dikeyAralik: z.number().min(0.05).max(0.2).default(0.1),
  yatayKisitSayisi: z.number().min(1).max(4).default(2),
  birimFiyat: z.number().min(5).max(100).default(15),
  iscilikFaktoru: z.number().min(1).max(2).default(1.3),
});

export interface CitKorkulukMalzemeHesabiOutput {
  toplamMaliyet: number;
  breakdown: {
    toplamAgirlik: number;
    malzemeMaliyeti: number;
    iscilikMaliyeti: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CitKorkulukMalzemeHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dikeyCubukSayisi = ((): number => { try { const __v = Math.Math.ceil(input.korkulukBoyu / input.dikeyAralik) + 1; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dikeyCubukToplamBoy = ((): number => { try { const __v = results.dikeyCubukSayisi * input.korkulukYuksekligi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yatayKirisToplamBoy = ((): number => { try { const __v = input.yatayKisitSayisi * input.korkulukBoyu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamProfilBoyu = ((): number => { try { const __v = results.dikeyCubukToplamBoy + results.yatayKirisToplamBoy; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimAgirlik = ((): number => { try { const __v = input.profilKesiti === 'kare40x40' ? 2.5 : input.profilKesiti === 'kare50x50' ? 3.5 : input.profilKesiti === 'dikdortgen40x60' ? 3.0 : 2.8; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamAgirlik = ((): number => { try { const __v = results.toplamProfilBoyu * results.birimAgirlik; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.malzemeMaliyeti = ((): number => { try { const __v = results.toplamAgirlik * input.birimFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMaliyet = ((): number => { try { const __v = results.malzemeMaliyeti * input.iscilikFaktoru; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCitKorkulukMalzemeHesabi(input: CitKorkulukMalzemeHesabiInput): CitKorkulukMalzemeHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamMaliyet = results.toplamMaliyet ?? 0;
  const breakdown = {
    toplamAgirlik: results.toplamAgirlik,
    malzemeMaliyeti: results.malzemeMaliyeti,
    iscilikMaliyeti: results.iscilikMaliyeti,
  };

  // rule: dikeyAralik <= 0.10 ? 'Dikey aralik 0.10 m'den buyuk olamaz (cocuk guvenligi)' : ''
  // rule: korkulukYuksekligi >= 1.10 ? '' : 'Korkuluk yuksekligi en az 1.10 m olmalidir'
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (invalid condition): > 10000

  const dataConfidenceAdjusted = (() => { try { return results.toplamMaliyet * 1.1; } catch { return toplamMaliyet; } })();

  return {
    toplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
