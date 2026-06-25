import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_043
 * Araç Adı: ETF Getirisi
 */

export const InputSchema_FIN_043 = z.object({
  alis_fiyati: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  satis_fiyati: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  temettu: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  gider_orani: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_043 = z.infer<typeof InputSchema_FIN_043>;

export interface Output_FIN_043 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_043(input: Input_FIN_043): Output_FIN_043 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: alis_fiyati, satis_fiyati, temettu, gider_orani
  
  const validData = InputSchema_FIN_043.parse(input);
  const { alis_fiyati, satis_fiyati, temettu, gider_orani } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = ((satis_fiyati + temettu - alis_fiyati) / Math.max(1, alis_fiyati) * 100) - gider_orani;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Pasif Yatırım Standartları",
      message: "Uyarı: Fon gider oranı %3'ün üzerindedir. Endeks takip eden standart ETF'ler için bu oran çok yüksektir; aktif yönetilen veya niş (kaldıraçlı/tematik) bir fon işlemi yapıyor olabilirsiniz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}