import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_084
 * Araç Adı: Borç Konsolidasyon
 */

export const InputSchema_FIN_084 = z.object({
  toplam_borc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ort_eski_faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yeni_faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_084 = z.infer<typeof InputSchema_FIN_084>;

export interface Output_FIN_084 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_084(input: Input_FIN_084): Output_FIN_084 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: toplam_borc, ort_eski_faiz, yeni_faiz, vade
  
  const validData = InputSchema_FIN_084.parse(input);
  const { toplam_borc, ort_eski_faiz, yeni_faiz, vade } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const monthlyRate = yeni_faiz / 100 / 12;
  const compoundFactor = Math.pow(1 + monthlyRate, vade);
  const result: number = monthlyRate === 0
    ? toplam_borc / vade
    : (toplam_borc * monthlyRate * compoundFactor) / (compoundFactor - 1);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Uzun Vade İllüzyonu",
      message: "Not: Vadeyi çok uzun tuttuğunuz için aylık taksitleriniz düşebilir, ancak toplam ödeyeceğiniz faiz tutarı eski borcunuzdaki faiz tutarını aşabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}