// Auto-generated from aydinlatma-armatur-sayisi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AydinlatmaArmaturSayisiHesaplamaInput {
  odaUzunlugu: number;
  odaGenisligi: number;
  odaYuksekligi: number;
  calismaDuzlemiYuksekligi: number;
  istenenAydinlatmaSeviyesi: number;
  armaturIsikAkisi: number;
  bakimFaktoru: number;
  kullanimFaktoru: number;
  odaIndeksi: number;
}

export const AydinlatmaArmaturSayisiHesaplamaInputSchema = z.object({
  odaUzunlugu: z.number().min(1).max(100).default(10),
  odaGenisligi: z.number().min(1).max(100).default(8),
  odaYuksekligi: z.number().min(2).max(10).default(3),
  calismaDuzlemiYuksekligi: z.number().min(0).max(2).default(0.85),
  istenenAydinlatmaSeviyesi: z.number().min(50).max(2000).default(500),
  armaturIsikAkisi: z.number().min(500).max(10000).default(3000),
  bakimFaktoru: z.number().min(0.5).max(1).default(0.8),
  kullanimFaktoru: z.number().min(0.3).max(0.9).default(0.6),
  odaIndeksi: z.number().min(0.5).max(5).default(2.5),
});

export interface AydinlatmaArmaturSayisiHesaplamaOutput {
  armaturSayisi: number;
  breakdown: {
    toplamIsikAkisiIhtiyaci: number;
    gercekOrtalamaAydinlatma: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AydinlatmaArmaturSayisiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.toplamIsikAkisiIhtiyaci = (() => { try { return input.istenenAydinlatmaSeviyesi * input.odaUzunlugu * input.odaGenisligi / (input.bakimFaktoru * input.kullanimFaktoru); } catch { return 0; } })();
  results.armaturSayisi = (() => { try { return Math.Math.ceil(results.toplamIsikAkisiIhtiyaci / input.armaturIsikAkisi); } catch { return 0; } })();
  results.gercekOrtalamaAydinlatma = (() => { try { return (results.armaturSayisi * input.armaturIsikAkisi * input.bakimFaktoru * input.kullanimFaktoru) / (input.odaUzunlugu * input.odaGenisligi); } catch { return 0; } })();
  return results;
}

export function calculateAydinlatmaArmaturSayisiHesaplama(input: AydinlatmaArmaturSayisiHesaplamaInput): AydinlatmaArmaturSayisiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const armaturSayisi = results.armaturSayisi ?? 0;
  const breakdown = {
    toplamIsikAkisiIhtiyaci: results.toplamIsikAkisiIhtiyaci,
    gercekOrtalamaAydinlatma: results.gercekOrtalamaAydinlatma,
  };

  // rule: calismaDuzlemiYuksekligi < odaYuksekligi
  // rule: istenenAydinlatmaSeviyesi > 0
  // rule: armaturIsikAkisi > 0
  // rule: bakimFaktoru > 0 && bakimFaktoru <= 1
  // rule: kullanimFaktoru > 0 && kullanimFaktoru <= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek aydinlatma seviyesi, enerji tuketimini artirabilir.
  // threshold skipped (non-JS): Dusuk bakim faktoru, sik temizlik veya lamba degisimi gerekebilir.
  // threshold skipped (non-JS): Dusuk kullanim faktoru, armatur secimi veya yerlesimi optimize edilmeli.

  const dataConfidenceAdjusted = (() => { try { return results.armaturSayisi; } catch { return armaturSayisi; } })();

  return {
    armaturSayisi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli armatur senaryolari)","Detayli rapor (oda indeksi, kullanim faktoru tablolari)"],
  };
}
