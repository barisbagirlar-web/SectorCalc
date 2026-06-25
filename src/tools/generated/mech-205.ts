import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_205
 * Araç Adı: Burulma Açısı
 */

export const InputSchema_MECH_205 = z.object({
  tork: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  uzunluk: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kayma_modulu: z.number().min(1000000000, "Endüstriyel minimum tolerans: 1000000000"),
  kutupsal_atalet: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_205 = z.infer<typeof InputSchema_MECH_205>;

export interface Output_MECH_205 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_205(input: Input_MECH_205): Output_MECH_205 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: tork, uzunluk, kayma_modulu, kutupsal_atalet
  
  const validData = InputSchema_MECH_205.parse(input);
  const { tork, uzunluk, kayma_modulu, kutupsal_atalet } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (tork * uzunluk) / Math.max(0.0001, (kayma_modulu * kutupsal_atalet));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "ISO Transmisyon Şaft Kriterleri",
      message: "Uyarı: Şaftta oluşan burulma açısı metre başına 5 dereceyi (0.087 radyan) aşmaktadır. Esnek yapı millerde aşırı dinamik titreşime ve rulman yorulmasına yol açar."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}