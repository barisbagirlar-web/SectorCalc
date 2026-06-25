import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_020
 * Araç Adı: Bileşik Yıllık Büyüme (CAGR)
 */

export const InputSchema_FIN_020 = z.object({
  ilk_deger: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  son_deger: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yil: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_020 = z.infer<typeof InputSchema_FIN_020>;

export interface Output_FIN_020 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_020(input: Input_FIN_020): Output_FIN_020 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ilk_deger, son_deger, yil
  
  const validData = InputSchema_FIN_020.parse(input);
  const { ilk_deger, son_deger, yil } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = ((son_deger / Math.max(1, ilk_deger)) ** (1 / Math.max(1, yil)) - 1) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Yatırım Analitiği",
      message: "Uyarı: CAGR, yılları pürüzsüzleştirerek ortalama bir oran verir. 3 yıldan kısa vadelerde aradaki yüksek volatiliteyi (düşüşleri ve çıkışları) gizleyebileceği için riski eksik gösterir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}