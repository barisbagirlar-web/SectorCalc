// Auto-generated from lpg-benzin-tasarruf-karsilastirma-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LpgBenzinTasarrufKarsilastirmaInput {
  benzinFiyat: number;
  lpgFiyat: number;
  benzinTuketim: number;
  lpgTuketim: number;
  yillikKm: number;
  lpgDonusumMaliyeti: number;
  lpgBakimFarki: number;
}

export const LpgBenzinTasarrufKarsilastirmaInputSchema = z.object({
  benzinFiyat: z.number().min(0).max(100).default(30),
  lpgFiyat: z.number().min(0).max(50).default(15),
  benzinTuketim: z.number().min(0).max(30).default(8),
  lpgTuketim: z.number().min(0).max(40).default(10),
  yillikKm: z.number().min(0).max(100000).default(15000),
  lpgDonusumMaliyeti: z.number().min(0).max(20000).default(5000),
  lpgBakimFarki: z.number().min(0).max(5000).default(500),
});

export interface LpgBenzinTasarrufKarsilastirmaOutput {
  yillikTasarruf: number;
  breakdown: {
    benzinYillikMaliyet: number;
    lpgYillikMaliyet: number;
    tasarrufYuzde: number;
    geriOdemeYili: number;
    besYillikTasarruf: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LpgBenzinTasarrufKarsilastirmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.benzinYillikMaliyet = ((): number => { try { const __v = input.benzinFiyat * input.benzinTuketim / 100 * input.yillikKm; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lpgYillikMaliyet = ((): number => { try { const __v = input.lpgFiyat * input.lpgTuketim / 100 * input.yillikKm + input.lpgBakimFarki; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikTasarruf = ((): number => { try { const __v = results.benzinYillikMaliyet - results.lpgYillikMaliyet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tasarrufYuzde = ((): number => { try { const __v = (results.yillikTasarruf / results.benzinYillikMaliyet) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.geriOdemeYili = ((): number => { try { const __v = input.lpgDonusumMaliyeti / results.yillikTasarruf; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.besYillikTasarruf = ((): number => { try { const __v = results.yillikTasarruf * 5 - input.lpgDonusumMaliyeti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLpgBenzinTasarrufKarsilastirma(input: LpgBenzinTasarrufKarsilastirmaInput): LpgBenzinTasarrufKarsilastirmaOutput {
  const results = evaluateFormulas(input);
  const yillikTasarruf = results.yillikTasarruf ?? 0;
  const breakdown = {
    benzinYillikMaliyet: results.benzinYillikMaliyet,
    lpgYillikMaliyet: results.lpgYillikMaliyet,
    tasarrufYuzde: results.tasarrufYuzde,
    geriOdemeYili: results.geriOdemeYili,
    besYillikTasarruf: results.besYillikTasarruf,
  };

  // rule: benzinFiyat > 0
  // rule: lpgFiyat > 0
  // rule: benzinTuketim > 0
  // rule: lpgTuketim > 0
  // rule: yillikKm > 0
  // rule: lpgDonusumMaliyeti >= 0
  // rule: lpgBakimFarki >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Eger tasarrufYuzde < 0 ise LPG karli degil
  // threshold skipped (non-JS): Eger geriOdemeYili > 5 ise donusum uzun vadede karli olmayabilir

  const dataConfidenceAdjusted = (() => { try { return results.yillikTasarruf; } catch { return yillikTasarruf; } })();

  return {
    yillikTasarruf,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis verilerle)","Karsilastirma (farkli araclar/senaryolar)","Detayli rapor (grafiklerle)"],
  };
}
