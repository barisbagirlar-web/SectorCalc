// Auto-generated from kumlama-raspa-kum-sarfiyati-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KumlamaRaspaKumSarfiyatiHesabiInput {
  yuzeyAlani: number;
  kumCinsi: 'silika' | 'garnet' | 'celik grit' | 'aluminyum oksit' | 'cam boncuk';
  yuzeyPuruzlulugu: 'dusuk (25-50)' | 'orta (50-85)' | 'yuksek (85-115)';
  kumGeriKazanimOrani: number;
  isciSayisi: number;
  saatlikIsGucuMaliyeti: number;
  kumBirimFiyati: number;
  ekipmanSaatlikMaliyeti: number;
  uretimHizi: number;
  kumSarfiyatOrani: number;
}

export const KumlamaRaspaKumSarfiyatiHesabiInputSchema = z.object({
  yuzeyAlani: z.number().min(0).default(100),
  kumCinsi: z.enum(['silika', 'garnet', 'celik grit', 'aluminyum oksit', 'cam boncuk']).default('silika'),
  yuzeyPuruzlulugu: z.enum(['dusuk (25-50)', 'orta (50-85)', 'yuksek (85-115)']).default('orta'),
  kumGeriKazanimOrani: z.number().min(0).max(100).default(70),
  isciSayisi: z.number().min(1).default(2),
  saatlikIsGucuMaliyeti: z.number().min(0).default(50),
  kumBirimFiyati: z.number().min(0).default(0.5),
  ekipmanSaatlikMaliyeti: z.number().min(0).default(100),
  uretimHizi: z.number().min(0).default(10),
  kumSarfiyatOrani: z.number().min(0).default(2.5),
});

export interface KumlamaRaspaKumSarfiyatiHesabiOutput {
  toplamMaliyet: number;
  breakdown: {
    toplamKumMaliyeti: number;
    toplamIsGucuMaliyeti: number;
    toplamEkipmanMaliyeti: number;
    birimAlanMaliyeti: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KumlamaRaspaKumSarfiyatiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.toplamKumIhtiyaci = ((): number => { try { const __v = input.yuzeyAlani * input.kumSarfiyatOrani; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netKumTuketimi = ((): number => { try { const __v = results.toplamKumIhtiyaci * (1 - input.kumGeriKazanimOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamKumMaliyeti = ((): number => { try { const __v = results.netKumTuketimi * input.kumBirimFiyati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamIsGucuMaliyeti = ((): number => { try { const __v = (input.yuzeyAlani / input.uretimHizi) * input.isciSayisi * input.saatlikIsGucuMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamEkipmanMaliyeti = ((): number => { try { const __v = (input.yuzeyAlani / input.uretimHizi) * input.ekipmanSaatlikMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMaliyet = ((): number => { try { const __v = results.toplamKumMaliyeti + results.toplamIsGucuMaliyeti + results.toplamEkipmanMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimAlanMaliyeti = ((): number => { try { const __v = results.toplamMaliyet / input.yuzeyAlani; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKumlamaRaspaKumSarfiyatiHesabi(input: KumlamaRaspaKumSarfiyatiHesabiInput): KumlamaRaspaKumSarfiyatiHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamMaliyet = results.toplamMaliyet ?? 0;
  const breakdown = {
    toplamKumMaliyeti: results.toplamKumMaliyeti,
    toplamIsGucuMaliyeti: results.toplamIsGucuMaliyeti,
    toplamEkipmanMaliyeti: results.toplamEkipmanMaliyeti,
    birimAlanMaliyeti: results.birimAlanMaliyeti,
  };

  // rule: yuzeyAlani > 0
  // rule: kumGeriKazanimOrani >= 0 && kumGeriKazanimOrani <= 100
  // rule: isciSayisi >= 1
  // rule: saatlikIsGucuMaliyeti >= 0
  // rule: kumBirimFiyati >= 0
  // rule: ekipmanSaatlikMaliyeti >= 0
  // rule: uretimHizi > 0
  // rule: kumSarfiyatOrani > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk geri kazanim orani, kum maliyetini artirir.
  // threshold skipped (non-JS): Yuksek kum sarfiyati, verimlilik dusuklugu gostergesi.

  const dataConfidenceAdjusted = (() => { try { return results.toplamMaliyet * (1 - (1 - dataConfidence) * 0.1); } catch { return toplamMaliyet; } })();

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
