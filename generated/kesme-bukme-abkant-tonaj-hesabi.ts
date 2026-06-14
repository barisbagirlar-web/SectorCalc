// Auto-generated from kesme-bukme-abkant-tonaj-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KesmeBukmeAbkantTonajHesabiInput {
  malzemeCinsi: 'St37' | 'St44' | 'St52' | 'Paslanmaz304' | 'Paslanmaz316' | 'Aluminum';
  malzemeKalinlik: number;
  bukmeBoyu: number;
  kalipAcikligi: number;
  bukmeAcisi: number;
  emniyetFaktoru: number;
}

export const KesmeBukmeAbkantTonajHesabiInputSchema = z.object({
  malzemeCinsi: z.enum(['St37', 'St44', 'St52', 'Paslanmaz304', 'Paslanmaz316', 'Aluminum']).default('St37'),
  malzemeKalinlik: z.number().min(0.5).max(25).default(2),
  bukmeBoyu: z.number().min(100).max(6000).default(1000),
  kalipAcikligi: z.number().min(4).max(200).default(16),
  bukmeAcisi: z.number().min(0).max(180).default(90),
  emniyetFaktoru: z.number().min(1).max(2).default(1.1),
});

export interface KesmeBukmeAbkantTonajHesabiOutput {
  toplamTonaj: number;
  breakdown: {
    cekirdekTonaj: number;
    malzemeCinsiKatsayi: number;
    emniyetFaktoru: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KesmeBukmeAbkantTonajHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.malzemeCinsiKatsayi = ((): number => { try { const __v = input.malzemeCinsi === 'St37' ? 45 : input.malzemeCinsi === 'St44' ? 50 : input.malzemeCinsi === 'St52' ? 60 : input.malzemeCinsi === 'Paslanmaz304' ? 70 : input.malzemeCinsi === 'Paslanmaz316' ? 75 : input.malzemeCinsi === 'Aluminum' ? 25 : 45; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cekirdekTonaj = ((): number => { try { const __v = ((1.42 * (results.malzemeCinsiKatsayi * malzemeKalinlik^2) * bukmeBoyu) / (1000 * kalipAcikligi)) * (1 + (bukmeAcisi - 90) / 180); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamTonaj = ((): number => { try { const __v = results.cekirdekTonaj * emniyetFaktoru; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKesmeBukmeAbkantTonajHesabi(input: KesmeBukmeAbkantTonajHesabiInput): KesmeBukmeAbkantTonajHesabiOutput {
  const results = evaluateFormulas(input);
  const toplamTonaj = results.toplamTonaj ?? 0;
  const breakdown = {
    cekirdekTonaj: results.cekirdekTonaj,
    malzemeCinsiKatsayi: results.malzemeCinsiKatsayi,
    emniyetFaktoru: results.emniyetFaktoru,
  };

  // rule: kalipAcikligi >= malzemeKalinlik * 6
  // rule: kalipAcikligi <= malzemeKalinlik * 12
  // rule: bukmeBoyu > 0
  // rule: malzemeKalinlik > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek tonaj, makine kapasitesini kontrol edin
  // threshold skipped (non-JS): Kalip acikligi cok dar, kalip hasari riski
  // threshold skipped (non-JS): Kalip acikligi cok genis, bukme kalitesi dusebilir

  const dataConfidenceAdjusted = (() => { try { return toplamTonaj; } catch { return toplamTonaj; } })();

  return {
    toplamTonaj,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis hesaplamalar)","Karsilastirma (farkli malzeme/kalinlik senaryolari)","Detayli rapor (malzeme sertifikasi, kalip onerisi)"],
  };
}
