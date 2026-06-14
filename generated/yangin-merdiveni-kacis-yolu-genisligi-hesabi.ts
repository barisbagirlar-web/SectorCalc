// Auto-generated from yangin-merdiveni-kacis-yolu-genisligi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YanginMerdiveniKacisYoluGenisligiHesabiInput {
  kullaniciSayisi: number;
  kacisYoluTipi: 'yatay' | 'dikey';
  birimGenislik: number;
  katsayi: number;
}

export const YanginMerdiveniKacisYoluGenisligiHesabiInputSchema = z.object({
  kullaniciSayisi: z.number().min(1).max(10000).default(100),
  kacisYoluTipi: z.enum(['yatay', 'dikey']).default('yatay'),
  birimGenislik: z.number().min(0.004).max(0.01).default(0.006),
  katsayi: z.number().min(1).max(2).default(1.5),
});

export interface YanginMerdiveniKacisYoluGenisligiHesabiOutput {
  sonuc: number;
  breakdown: {
    gerekliGenislik: number;
    minimumGenislik: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YanginMerdiveniKacisYoluGenisligiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.gerekliGenislik = ((): number => { try { const __v = input.kullaniciSayisi * input.birimGenislik * input.katsayi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sonuc = ((): number => { try { const __v = Math.Math.max(results.gerekliGenislik, 0.80); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYanginMerdiveniKacisYoluGenisligiHesabi(input: YanginMerdiveniKacisYoluGenisligiHesabiInput): YanginMerdiveniKacisYoluGenisligiHesabiOutput {
  const results = evaluateFormulas(input);
  const sonuc = results.sonuc ?? 0;
  const breakdown = {
    gerekliGenislik: results.gerekliGenislik,
    minimumGenislik: results.minimumGenislik,
  };

  // rule: kullaniciSayisi > 0
  // rule: birimGenislik >= 0.004 && birimGenislik <= 0.01
  // rule: katsayi >= 1.0 && katsayi <= 2.0
  // rule: if (kacisYoluTipi == 'dikey') then birimGenislik >= 0.008
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.80
  // threshold skipped (non-JS): 2.40

  const dataConfidenceAdjusted = (() => { try { return results.sonuc * (1 - 0.05); } catch { return sonuc; } })();

  return {
    sonuc,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV raporu","Trend analizi (gecmis hesaplamalar)","Karsilastirma (farkli senaryolar)","Detayli rapor (bina tipi, yangin senaryosu)"],
  };
}
