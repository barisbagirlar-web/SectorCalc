// Auto-generated from klima-btu-secim-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KlimaBtuSecimHesaplamaInput {
  odaHacmi: number;
  kisiSayisi: number;
  pencereAlani: number;
  pencereYonu: 'Kuzey' | 'Guney' | 'Dogu' | 'Bati';
  yalitimSeviyesi: 'Zayif' | 'Orta' | 'Iyi';
  cihazGucu: number;
  aydinlatmaGucu: number;
  dataConfidence: number;
}

export const KlimaBtuSecimHesaplamaInputSchema = z.object({
  odaHacmi: z.number().min(10).max(10000).default(100),
  kisiSayisi: z.number().min(0).max(100).default(2),
  pencereAlani: z.number().min(0).max(500).default(10),
  pencereYonu: z.enum(['Kuzey', 'Guney', 'Dogu', 'Bati']).default('Guney'),
  yalitimSeviyesi: z.enum(['Zayif', 'Orta', 'Iyi']).default('Orta'),
  cihazGucu: z.number().min(0).max(10000).default(500),
  aydinlatmaGucu: z.number().min(0).max(5000).default(200),
  dataConfidence: z.number().min(0).max(1).default(0.8),
});

export interface KlimaBtuSecimHesaplamaOutput {
  oneriKapasite: number;
  breakdown: {
    isiYukuKisi: number;
    isiYukuPencere: number;
    isiYukuYalitim: number;
    cihazGucu: number;
    aydinlatmaGucu: number;
    toplamIsiYuku: number;
    btuIhtiyaci: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KlimaBtuSecimHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.isiYukuKisi = ((): number => { try { const __v = input.kisiSayisi * 150; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isiYukuPencere = ((): number => { try { const __v = input.pencereAlani * (input.pencereYonu === 'Guney' ? 200 : input.pencereYonu === 'Bati' ? 180 : input.pencereYonu === 'Dogu' ? 150 : 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isiYukuYalitim = ((): number => { try { const __v = input.odaHacmi * (input.yalitimSeviyesi === 'Zayif' ? 30 : input.yalitimSeviyesi === 'Orta' ? 20 : 10); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamIsiYuku = ((): number => { try { const __v = results.isiYukuKisi + results.isiYukuPencere + results.isiYukuYalitim + input.cihazGucu + input.aydinlatmaGucu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.btuIhtiyaci = ((): number => { try { const __v = results.toplamIsiYuku * 3.412; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.oneriKapasite = ((): number => { try { const __v = results.btuIhtiyaci * 1.2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.oneriKapasite * input.dataConfidence; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKlimaBtuSecimHesaplama(input: KlimaBtuSecimHesaplamaInput): KlimaBtuSecimHesaplamaOutput {
  const results = evaluateFormulas(input);
  const oneriKapasite = results.oneriKapasite ?? 0;
  const breakdown = {
    isiYukuKisi: results.isiYukuKisi,
    isiYukuPencere: results.isiYukuPencere,
    isiYukuYalitim: results.isiYukuYalitim,
    cihazGucu: results.cihazGucu,
    aydinlatmaGucu: results.aydinlatmaGucu,
    toplamIsiYuku: results.toplamIsiYuku,
    btuIhtiyaci: results.btuIhtiyaci,
  };

  // rule: odaHacmi >= 10
  // rule: kisiSayisi >= 0
  // rule: pencereAlani >= 0
  // rule: cihazGucu >= 0
  // rule: aydinlatmaGucu >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (toplamIsiYuku > 5000) hiddenLossDrivers.push("Yuksek isi yuku, daha buyuk kapasite gerekebilir");
  if (input.kisiSayisi > 10) hiddenLossDrivers.push("Kalabalik ortam, havalandirma ihtiyaci artar");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return oneriKapasite; } })();

  return {
    oneriKapasite,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison","Detailed Report"],
  };
}
