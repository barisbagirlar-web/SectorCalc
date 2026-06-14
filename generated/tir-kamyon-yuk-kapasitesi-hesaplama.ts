// Auto-generated from tir-kamyon-yuk-kapasitesi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TirKamyonYukKapasitesiHesaplamaInput {
  aracTipi: 'TIR' | 'Kamyon' | 'Kamyonet';
  yasalAzamiYuk: number;
  daraAgirligi: number;
  yukHacmi: number;
  yukYogunlugu: number;
  yuklemeSuresi: number;
  bosaltmaSuresi: number;
  seferSayisi: number;
  yakitTuketimi: number;
  yakitFiyati: number;
  soforUcreti: number;
  bakimMaliyeti: number;
  ortalamaHiz: number;
  mesafe: number;
  dataConfidence: 'Dusuk' | 'Orta' | 'Yuksek';
}

export const TirKamyonYukKapasitesiHesaplamaInputSchema = z.object({
  aracTipi: z.enum(['TIR', 'Kamyon', 'Kamyonet']).default('TIR'),
  yasalAzamiYuk: z.number().min(0).max(60000).default(24000),
  daraAgirligi: z.number().min(0).max(30000).default(12000),
  yukHacmi: z.number().min(0).max(150).default(90),
  yukYogunlugu: z.number().min(0).max(3000).default(500),
  yuklemeSuresi: z.number().min(0.5).max(8).default(2),
  bosaltmaSuresi: z.number().min(0.5).max(8).default(1.5),
  seferSayisi: z.number().min(1).max(100).default(20),
  yakitTuketimi: z.number().min(10).max(60).default(30),
  yakitFiyati: z.number().min(0).max(100).default(25),
  soforUcreti: z.number().min(0).max(500).default(100),
  bakimMaliyeti: z.number().min(0).max(10).default(1.5),
  ortalamaHiz: z.number().min(20).max(120).default(70),
  mesafe: z.number().min(0).max(5000).default(500),
  dataConfidence: z.enum(['Dusuk', 'Orta', 'Yuksek']).default('Orta'),
});

export interface TirKamyonYukKapasitesiHesaplamaOutput {
  birimMaliyet: number;
  breakdown: {
    netYukKapasitesi: number;
    hacimselKapasite: number;
    efektifYukKapasitesi: number;
    seferSuresi: number;
    yakitMaliyetiSefer: number;
    soforMaliyetiSefer: number;
    bakimMaliyetiSefer: number;
    toplamMaliyetSefer: number;
    kapasiteKullanimOrani: number;
    aylikToplamMaliyet: number;
    aylikTasinanYuk: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TirKamyonYukKapasitesiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.netYukKapasitesi = ((): number => { try { const __v = input.yasalAzamiYuk - input.daraAgirligi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hacimselKapasite = ((): number => { try { const __v = input.yukHacmi * input.yukYogunlugu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.efektifYukKapasitesi = ((): number => { try { const __v = Math.Math.min(results.netYukKapasitesi, results.hacimselKapasite); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.seferSuresi = ((): number => { try { const __v = input.yuklemeSuresi + input.bosaltmaSuresi + (input.mesafe / input.ortalamaHiz); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikCalismaSuresi = ((): number => { try { const __v = input.seferSayisi * results.seferSuresi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yakitMaliyetiSefer = ((): number => { try { const __v = (input.mesafe / 100) * input.yakitTuketimi * input.yakitFiyati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.soforMaliyetiSefer = ((): number => { try { const __v = results.seferSuresi * input.soforUcreti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bakimMaliyetiSefer = ((): number => { try { const __v = input.mesafe * input.bakimMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMaliyetSefer = ((): number => { try { const __v = results.yakitMaliyetiSefer + results.soforMaliyetiSefer + results.bakimMaliyetiSefer; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimMaliyet = ((): number => { try { const __v = results.toplamMaliyetSefer / results.efektifYukKapasitesi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kapasiteKullanimOrani = ((): number => { try { const __v = results.efektifYukKapasitesi / results.netYukKapasitesi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikToplamMaliyet = ((): number => { try { const __v = results.toplamMaliyetSefer * input.seferSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikTasinanYuk = ((): number => { try { const __v = results.efektifYukKapasitesi * input.seferSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'Dusuk' ? results.birimMaliyet * 1.2 : input.dataConfidence === 'Orta' ? results.birimMaliyet * 1.1 : results.birimMaliyet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTirKamyonYukKapasitesiHesaplama(input: TirKamyonYukKapasitesiHesaplamaInput): TirKamyonYukKapasitesiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const birimMaliyet = results.birimMaliyet ?? 0;
  const breakdown = {
    netYukKapasitesi: results.netYukKapasitesi,
    hacimselKapasite: results.hacimselKapasite,
    efektifYukKapasitesi: results.efektifYukKapasitesi,
    seferSuresi: results.seferSuresi,
    yakitMaliyetiSefer: results.yakitMaliyetiSefer,
    soforMaliyetiSefer: results.soforMaliyetiSefer,
    bakimMaliyetiSefer: results.bakimMaliyetiSefer,
    toplamMaliyetSefer: results.toplamMaliyetSefer,
    kapasiteKullanimOrani: results.kapasiteKullanimOrani,
    aylikToplamMaliyet: results.aylikToplamMaliyet,
    aylikTasinanYuk: results.aylikTasinanYuk,
  };

  // rule: daraAgirligi < yasalAzamiYuk
  // rule: yukHacmi > 0
  // rule: yukYogunlugu > 0
  // rule: yuklemeSuresi > 0
  // rule: bosaltmaSuresi > 0
  // rule: seferSayisi > 0
  // rule: ortalamaHiz > 0
  // rule: mesafe > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): kapasiteKullanimOrani
  // threshold skipped (non-string): birimMaliyet

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return birimMaliyet; } })();

  return {
    birimMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
