// Auto-generated from dizel-benzin-maliyet-karsilastirma-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DizelBenzinMaliyetKarsilastirmaInput {
  yillikKm: number;
  dizelYakitTuketimi: number;
  benzinYakitTuketimi: number;
  dizelFiyat: number;
  benzinFiyat: number;
  dizelBakimMaliyeti: number;
  benzinBakimMaliyeti: number;
  dizelVergi: number;
  benzinVergi: number;
  dizelSigorta: number;
  benzinSigorta: number;
  dizelDegerKaybi: number;
  benzinDegerKaybi: number;
}

export const DizelBenzinMaliyetKarsilastirmaInputSchema = z.object({
  yillikKm: z.number().min(0).max(100000).default(15000),
  dizelYakitTuketimi: z.number().min(2).max(15).default(5.5),
  benzinYakitTuketimi: z.number().min(3).max(20).default(7),
  dizelFiyat: z.number().min(0).max(100).default(25),
  benzinFiyat: z.number().min(0).max(100).default(28),
  dizelBakimMaliyeti: z.number().min(0).max(20000).default(3000),
  benzinBakimMaliyeti: z.number().min(0).max(20000).default(2500),
  dizelVergi: z.number().min(0).max(10000).default(2000),
  benzinVergi: z.number().min(0).max(10000).default(1800),
  dizelSigorta: z.number().min(0).max(20000).default(4000),
  benzinSigorta: z.number().min(0).max(20000).default(3800),
  dizelDegerKaybi: z.number().min(0).max(50000).default(10000),
  benzinDegerKaybi: z.number().min(0).max(50000).default(9000),
});

export interface DizelBenzinMaliyetKarsilastirmaOutput {
  tasarruf: number;
  breakdown: {
    dizelYillikYakitMaliyeti: number;
    benzinYillikYakitMaliyeti: number;
    dizelToplamYillikMaliyet: number;
    benzinToplamYillikMaliyet: number;
    tasarrufYuzde: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DizelBenzinMaliyetKarsilastirmaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dizelYillikYakitMaliyeti = ((): number => { try { const __v = input.yillikKm / 100 * input.dizelYakitTuketimi * input.dizelFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.benzinYillikYakitMaliyeti = ((): number => { try { const __v = input.yillikKm / 100 * input.benzinYakitTuketimi * input.benzinFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dizelToplamYillikMaliyet = ((): number => { try { const __v = results.dizelYillikYakitMaliyeti + input.dizelBakimMaliyeti + input.dizelVergi + input.dizelSigorta + input.dizelDegerKaybi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.benzinToplamYillikMaliyet = ((): number => { try { const __v = results.benzinYillikYakitMaliyeti + input.benzinBakimMaliyeti + input.benzinVergi + input.benzinSigorta + input.benzinDegerKaybi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tasarruf = ((): number => { try { const __v = results.benzinToplamYillikMaliyet - results.dizelToplamYillikMaliyet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tasarrufYuzde = ((): number => { try { const __v = results.tasarruf / results.benzinToplamYillikMaliyet * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateDizelBenzinMaliyetKarsilastirma(input: DizelBenzinMaliyetKarsilastirmaInput): DizelBenzinMaliyetKarsilastirmaOutput {
  const results = evaluateFormulas(input);
  const tasarruf = results.tasarruf ?? 0;
  const breakdown = {
    dizelYillikYakitMaliyeti: results.dizelYillikYakitMaliyeti,
    benzinYillikYakitMaliyeti: results.benzinYillikYakitMaliyeti,
    dizelToplamYillikMaliyet: results.dizelToplamYillikMaliyet,
    benzinToplamYillikMaliyet: results.benzinToplamYillikMaliyet,
    tasarrufYuzde: results.tasarrufYuzde,
  };

  // rule: yillikKm > 0
  // rule: dizelYakitTuketimi > 0
  // rule: benzinYakitTuketimi > 0
  // rule: dizelFiyat > 0
  // rule: benzinFiyat > 0
  // rule: dizelBakimMaliyeti >= 0
  // rule: benzinBakimMaliyeti >= 0
  // rule: dizelVergi >= 0
  // rule: benzinVergi >= 0
  // rule: dizelSigorta >= 0
  // rule: benzinSigorta >= 0
  // rule: dizelDegerKaybi >= 0
  // rule: benzinDegerKaybi >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if yillikKm > 50000 then 'Yuksek kilometre: bakim maliyetleri artabilir'
  // threshold skipped (non-JS): if dizelYakitTuketimi > 10 then 'Dizel tuketimi yuksek: arac verimliligi dusuk olabilir'
  // threshold skipped (non-JS): if benzinYakitTuketimi > 12 then 'Benzin tuketimi yuksek: arac verimliligi dusuk olabilir'

  const dataConfidenceAdjusted = (() => { try { return results.tasarruf; } catch { return tasarruf; } })();

  return {
    tasarruf,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (yillik maliyet degisimi)","Karsilastirma (farkli arac modelleri)","Detayli rapor (bilesen bazinda grafikler)"],
  };
}
