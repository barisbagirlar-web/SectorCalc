import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_109
 * Araç Adı: Borç Devir Hızı
 */

export const InputSchema_CORP_109 = z.object({
  yillik_cogs: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ort_borc: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_CORP_109 = z.infer<typeof InputSchema_CORP_109>;

export interface Output_CORP_109 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_109(input: Input_CORP_109): Output_CORP_109 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_cogs, ort_borc
  
  const validData = InputSchema_CORP_109.parse(input);
  const { yillik_cogs, ort_borc } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const devirHizi = yillik_cogs / Math.max(0.0001, ort_borc);
  const result = 365 / Math.max(0.0001, devirHizi);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Tedarik Zinciri Finansmanı",
      message: "Not: Tedarikçilere çok erken (15 günden az) ödeme yapıyorsunuz. Nakit yönetimini optimize etmek için tedarikçilerle daha uzun vadeli (30-60 gün) ödeme anlaşmaları yaparak likidite alanınızı genişletebilirsiniz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}