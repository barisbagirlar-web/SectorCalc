// Auto-generated from is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInput {
  calisanSayisi: number;
  gunlukKullanimSuresi: number;
  kkdTuru: 'isElbisesi' | 'eldiven' | 'gozluk' | 'maske' | 'baret' | 'kulaklik';
  birimFiyat: number;
  omur: number;
  calismaGunuAy: number;
  fireOrani: number;
}

export const IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInputSchema = z.object({
  calisanSayisi: z.number().min(1).max(10000).default(10),
  gunlukKullanimSuresi: z.number().min(1).max(24).default(8),
  kkdTuru: z.enum(['isElbisesi', 'eldiven', 'gozluk', 'maske', 'baret', 'kulaklik']).default('isElbisesi'),
  birimFiyat: z.number().min(0).max(10000).default(50),
  omur: z.number().min(1).max(1000).default(30),
  calismaGunuAy: z.number().min(1).max(31).default(22),
  fireOrani: z.number().min(0).max(100).default(5),
});

export interface IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiOutput {
  yillikSarfiyat: number;
  breakdown: {
    aylikSarfiyat: number;
    gerekliKKDSayisi: number;
    fireDahilKKDSayisi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.aylikKullanimSayisi = ((): number => { try { const __v = input.calisanSayisi * input.calismaGunuAy; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamAylikKullanim = ((): number => { try { const __v = results.aylikKullanimSayisi * input.gunlukKullanimSuresi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerekliKKDSayisi = ((): number => { try { const __v = Math.ceil(results.toplamAylikKullanim / input.omur); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fireDahilKKDSayisi = ((): number => { try { const __v = results.gerekliKKDSayisi * (1 + input.fireOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikSarfiyat = ((): number => { try { const __v = results.fireDahilKKDSayisi * input.birimFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikSarfiyat = ((): number => { try { const __v = results.aylikSarfiyat * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIsElbisesiKkdKisiselKoruyucuDonanimSarfiyati(input: IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiInput): IsElbisesiKkdKisiselKoruyucuDonanimSarfiyatiOutput {
  const results = evaluateFormulas(input);
  const yillikSarfiyat = results.yillikSarfiyat ?? 0;
  const breakdown = {
    aylikSarfiyat: results.aylikSarfiyat,
    gerekliKKDSayisi: results.gerekliKKDSayisi,
    fireDahilKKDSayisi: results.fireDahilKKDSayisi,
  };

  // rule: calisanSayisi > 0
  // rule: gunlukKullanimSuresi > 0
  // rule: birimFiyat >= 0
  // rule: omur > 0
  // rule: calismaGunuAy > 0
  // rule: fireOrani >= 0 && fireOrani <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Fire orani %10'un uzerinde, surec iyilestirme onerilir.
  // threshold skipped (non-JS): Birim fiyat yuksek, alternatif tedarikciler degerlendirilmeli.

  const dataConfidenceAdjusted = (() => { try { return dataConfidenceAdjusted; } catch { return yillikSarfiyat; } })();

  return {
    yillikSarfiyat,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (farkli KKD turleri)","Detayli rapor"],
  };
}
