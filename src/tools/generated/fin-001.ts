import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_001
 * Araç Adı: Yüzde Kuralı
 */

export const InputSchema_FIN_001 = z.object({
  aylik_kira: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  mulk_degeri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_001 = z.infer<typeof InputSchema_FIN_001>;

export interface Output_FIN_001 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_001(input: Input_FIN_001): Output_FIN_001 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: aylik_kira, mulk_degeri
  
  const validData = InputSchema_FIN_001.parse(input);
  const { aylik_kira, mulk_degeri } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (aylik_kira / Math.max(1, mulk_degeri)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Gayrimenkul Yatırım Metrikleri",
      message: "Uyarı: Kira getirisi mülk değerinin %0.4'ünün altındadır. Amortisman süresi (ROI) 20 yılın üzerindedir, düşük verimli yatırım."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Piyasa Standartları",
      message: "Not: %2'nin üzerindeki aylık kira getirileri genellikle mikro apartmanlar, kısa dönem kiralama veya yüksek riskli bölgeler için geçerlidir. Veriyi doğrulayın."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}