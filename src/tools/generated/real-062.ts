import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_062
 * Araç Adı: Kira vs Satın Alma
 */

export const InputSchema_REAL_062 = z.object({
  ev_fiyati: z.number().min(1000, "Endüstriyel minimum tolerans: 1000"),
  yillik_kira: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yillik_gider: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_REAL_062 = z.infer<typeof InputSchema_REAL_062>;

export interface Output_REAL_062 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_062(input: Input_REAL_062): Output_REAL_062 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ev_fiyati, yillik_kira, yillik_gider
  
  const validData = InputSchema_REAL_062.parse(input);
  const { ev_fiyati, yillik_kira, yillik_gider } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const oran = ev_fiyati / Math.max(1, yillik_kira);
  const result: number = oran > 20 ? 1 : 0;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (oran > 20) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Price-to-Rent Ratio",
      message: "Uyarı: Fiyat/Kira oranı 20'nin üzerindedir. Finansal matematik açısından bu mülkü satın almak yerine kiralamak çok daha rasyoneldir; mülk fiyatında balon (bubble) riski olabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}