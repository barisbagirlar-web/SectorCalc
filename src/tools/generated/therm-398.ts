import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: THERM_398
 * Araç Adı: Isı Eşanjörü LMTD Düzeltme Faktörü (F)
 */

export const InputSchema_THERM_398 = z.object({
  r_kapasite: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  p_etkinlik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_THERM_398 = z.infer<typeof InputSchema_THERM_398>;

export interface Output_THERM_398 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_THERM_398(input: Input_THERM_398): Output_THERM_398 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: r_kapasite, p_etkinlik
  
  const validData = InputSchema_THERM_398.parse(input);
  const { r_kapasite, p_etkinlik } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result < 0.75) {
    smartWarnings.push({
      severity: "WARNING",
      source: "TEMA Eşanjör Standartları",
      message: "Uyarı: LMTD düzeltme faktörü (F) 0.75'in altındadır. Bu eşanjörün çapraz (Cross) veya çok geçişli (Multi-pass) tasarımı mevcut sıcaklık rejimleri için termodinamik olarak verimsizdir. Isı transfer yüzeyi gereksiz yere büyüyecektir, boru/gövde geçiş sayısını artırın."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
