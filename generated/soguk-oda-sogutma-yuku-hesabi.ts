// Auto-generated from soguk-oda-sogutma-yuku-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SogukOdaSogutmaYukuHesabiInput {
  odaHacmi: number;
  disSicaklik: number;
  odaSicakligi: number;
  yalitimKatsayisi: number;
  duvarAlani: number;
  urunGirisSicakligi: number;
  urunMiktari: number;
  urunOzgulIsisi: number;
  kapiAcmaSayisi: number;
  kapiBoyutu: number;
  kisiSayisi: number;
  aydinlatmaGucu: number;
  ekipmanGucu: number;
  calismaSuresi: number;
}

export const SogukOdaSogutmaYukuHesabiInputSchema = z.object({
  odaHacmi: z.number().min(1).max(100000).default(100),
  disSicaklik: z.number().min(-20).max(50).default(35),
  odaSicakligi: z.number().min(-30).max(20).default(4),
  yalitimKatsayisi: z.number().min(0.1).max(2).default(0.3),
  duvarAlani: z.number().min(0).max(10000).default(200),
  urunGirisSicakligi: z.number().min(-20).max(50).default(25),
  urunMiktari: z.number().min(0).max(1000000).default(1000),
  urunOzgulIsisi: z.number().min(0.5).max(5).default(3.5),
  kapiAcmaSayisi: z.number().min(0).max(500).default(50),
  kapiBoyutu: z.number().min(0.5).max(10).default(2.5),
  kisiSayisi: z.number().min(0).max(50).default(2),
  aydinlatmaGucu: z.number().min(0).max(10000).default(500),
  ekipmanGucu: z.number().min(0).max(50000).default(1000),
  calismaSuresi: z.number().min(0).max(24).default(16),
});

export interface SogukOdaSogutmaYukuHesabiOutput {
  toplamSogutmaYuku: number;
  breakdown: {
    duvarIsiKazanci: number;
    urunIsiYuku: number;
    havaSizintisiYuku: number;
    insanIsiYuku: number;
    aydinlatmaIsiYuku: number;
    ekipmanIsiYuku: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SogukOdaSogutmaYukuHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.duvarIsiKazanci = ((): number => { try { const __v = input.duvarAlani * input.yalitimKatsayisi * (input.disSicaklik - input.odaSicakligi) * 24 * 3600 / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.urunIsiYuku = ((): number => { try { const __v = input.urunMiktari * input.urunOzgulIsisi * (input.urunGirisSicakligi - input.odaSicakligi); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.havaSizintisiYuku = ((): number => { try { const __v = input.kapiAcmaSayisi * input.kapiBoyutu * 0.5 * (input.disSicaklik - input.odaSicakligi) * 1.2 * 1005 * 24 * 3600 / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.insanIsiYuku = ((): number => { try { const __v = input.kisiSayisi * 150 * input.calismaSuresi * 3600 / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aydinlatmaIsiYuku = ((): number => { try { const __v = input.aydinlatmaGucu * input.calismaSuresi * 3600 / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ekipmanIsiYuku = ((): number => { try { const __v = input.ekipmanGucu * input.calismaSuresi * 3600 / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamSogutmaYuku = ((): number => { try { const __v = results.duvarIsiKazanci + results.urunIsiYuku + results.havaSizintisiYuku + results.insanIsiYuku + results.aydinlatmaIsiYuku + results.ekipmanIsiYuku; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSogukOdaSogutmaYukuHesabi(input: SogukOdaSogutmaYukuHesabiInput): SogukOdaSogutmaYukuHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamSogutmaYuku = results.toplamSogutmaYuku ?? 0;
  const breakdown = {
    duvarIsiKazanci: results.duvarIsiKazanci,
    urunIsiYuku: results.urunIsiYuku,
    havaSizintisiYuku: results.havaSizintisiYuku,
    insanIsiYuku: results.insanIsiYuku,
    aydinlatmaIsiYuku: results.aydinlatmaIsiYuku,
    ekipmanIsiYuku: results.ekipmanIsiYuku,
  };

  // rule: odaSicakligi < disSicaklik
  // rule: odaHacmi > 0
  // rule: yalitimKatsayisi > 0
  // rule: urunMiktari >= 0
  // rule: kapiAcmaSayisi >= 0
  // rule: kisiSayisi >= 0
  // rule: calismaSuresi > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 50000 -> 'Yuksek sogutma yuku, sistem kapasitesini kontrol edin'

  const dataConfidenceAdjusted = (() => { try { return results.toplamSogutmaYuku * 1.1; } catch { return toplamSogutmaYuku; } })();

  return {
    toplamSogutmaYuku,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analizi","Karsilastirma","Detayli Rapor"],
  };
}
