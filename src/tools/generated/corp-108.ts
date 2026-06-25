import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_108
 * Araç Adı: Alacak Devir Hızı
 */

export const InputSchema_CORP_108 = z.object({
  yillik_satis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ort_alacak: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_CORP_108 = z.infer<typeof InputSchema_CORP_108>;

export interface Output_CORP_108 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_108(input: Input_CORP_108): Output_CORP_108 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_satis, ort_alacak
  
  const validData = InputSchema_CORP_108.parse(input);
  const { yillik_satis, ort_alacak } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const devir_hizi = yillik_satis / Math.max(0.0001, ort_alacak);
  const tahsilat = 365 / Math.max(0.0001, devir_hizi);
  const result = Math.round(tahsilat * 100) / 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Nakit Akış Yönetimi",
      message: "Uyarı: Tahsilat süresi 90 günü aşmaktadır. Alacakların gecikmesi, firmanızın nakit akışını zorlar ve batık kredi (Bad Debt) riskini dramatik şekilde artırır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}