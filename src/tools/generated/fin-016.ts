import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_016
 * Araç Adı: Temettü Vergisi
 */

export const InputSchema_FIN_016 = z.object({
  temettu: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  stopaj: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
});

export type Input_FIN_016 = z.infer<typeof InputSchema_FIN_016>;

export interface Output_FIN_016 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_016(input: Input_FIN_016): Output_FIN_016 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: temettu, stopaj
  
  const validData = InputSchema_FIN_016.parse(input);
  const { temettu, stopaj } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = temettu * (1 - stopaj / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Vergi Mevzuatı",
      message: "Uyarı: Türkiye'de (BİST) standart temettü stopajı %10'dur. %20 ve üzeri stopajlar genellikle yurtdışı hisse senedi (Örn: ABD) temettüleri için geçerlidir ve çifte vergilendirme (W-8BEN formu) durumunu incelemeyi gerektirir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}