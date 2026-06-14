// Auto-generated from baca-havalandirma-kanali-cap-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BacaHavalandirmaKanaliCapHesabiInput {
  havaDebisi: number;
  hizSiniri: number;
  kanalTipi: 'yuvarlak' | 'dikdortgen';
  enBoyOrani: number;
}

export const BacaHavalandirmaKanaliCapHesabiInputSchema = z.object({
  havaDebisi: z.number().min(0).max(100000).default(1000),
  hizSiniri: z.number().min(2).max(15).default(8),
  kanalTipi: z.enum(['yuvarlak', 'dikdortgen']).default('yuvarlak'),
  enBoyOrani: z.number().min(1).max(5).default(1),
});

export interface BacaHavalandirmaKanaliCapHesabiOutput {
  oneriCap: number;
  breakdown: {
    kesitAlani: number;
    cap: number;
    boy: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BacaHavalandirmaKanaliCapHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kesitAlani = input.havaDebisi / (input.hizSiniri * 3600);
  results.cap = input.kanalTipi === 'yuvarlak' ? Math.sqrt(4 * results.kesitAlani / Math.PI) : Math.sqrt(results.kesitAlani / input.enBoyOrani);
  results.boy = input.kanalTipi === 'dikdortgen' ? results.cap * input.enBoyOrani : null;
  results.oneriCap = Math.ceil(results.cap * 1000) / 1000;
  return results;
}

export function calculateBacaHavalandirmaKanaliCapHesabi(input: BacaHavalandirmaKanaliCapHesabiInput): BacaHavalandirmaKanaliCapHesabiOutput {
  const results = evaluateFormulas(input);
  const oneriCap = results.oneriCap;
  const breakdown = {
    kesitAlani: results.kesitAlani,
    cap: results.cap,
    boy: results.boy,
  };

  // rule: havaDebisi > 0
  // rule: hizSiniri >= 2 && hizSiniri <= 15
  // rule: kanalTipi 'yuvarlak' veya 'dikdortgen' olmalı
  // rule: kanalTipi 'dikdortgen' ise enBoyOrani >= 1 && enBoyOrani <= 5
  // threshold hizSiniri > 10: Yüksek hız: gürültü ve basınç kaybı artabilir, susturucu gerekebilir.
  // threshold enBoyOrani > 3: Yüksek en/boy oranı: sürtünme kaybı artar, temizlik zorlaşır.
  const hiddenLossDrivers: string[] = ["hizSiniri > 10 ? 'Yüksek hız kaynaklı gürültü ve basınç kaybı' : null","enBoyOrani > 3 ? 'Yüksek en/boy oranı sürtünmeyi artırır' : null"];
  const suggestedActions: string[] = ["Hız sınırını düşürerek kanal çapını büyütüp gürültüyü azaltın.","Dikdörtgen kanalda en/boy oranını 3'ün altında tutun.","Hava debisini doğrulamak için mahal havalandırma hesabı yapın."];
  const dataConfidenceAdjusted = dataConfidence input'u yok, bu çıktı kullanılmaz.;

  return {
    oneriCap,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV raporu","Basınç kaybı ve fan seçimi detaylı hesaplama","Farklı senaryoların karşılaştırması","TS 3419 ve ASHRAE standartlarına uygunluk raporu"],
  };
}
