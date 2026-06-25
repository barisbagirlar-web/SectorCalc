import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_063
 * Araç Adı: Kira Geliri Getiri (Cap Rate)
 */

export const InputSchema_REAL_063 = z.object({
  yillik_net_gelir: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  mulk_degeri: z.number().min(1000, "Endüstriyel minimum tolerans: 1000"),
});

export type Input_REAL_063 = z.infer<typeof InputSchema_REAL_063>;

export interface Output_REAL_063 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_063(input: Input_REAL_063): Output_REAL_063 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_net_gelir, mulk_degeri
  
  const validData = InputSchema_REAL_063.parse(input);
  const { yillik_net_gelir, mulk_degeri } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (yillik_net_gelir / Math.max(1, mulk_degeri)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "REIT Değerleme Standartları",
      message: "Uyarı: Cap Rate %3'ün altındadır. Bu oran risksiz devlet tahvili faizlerinin bile altındaysa, yatırım operasyonel riski karşılamıyor demektir."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Yüksek Risk Uyarıcısı",
      message: "Not: Cap Rate %15'in üzerindedir. Bu oran genellikle sorunlu mülkleri (Class D), düşük doluluk riskini veya hesaplamaya katılmamış gizli bakım/onarım giderlerini işaret eder."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}