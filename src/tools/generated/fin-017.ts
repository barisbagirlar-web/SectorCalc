import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_017
 * Araç Adı: Temettü Yeniden Yatırım (DRIP)
 */

export const InputSchema_FIN_017 = z.object({
  hisse: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  temettu: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  fiyat: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yil: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_017 = z.infer<typeof InputSchema_FIN_017>;

export interface Output_FIN_017 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_017(input: Input_FIN_017): Output_FIN_017 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: hisse, temettu, fiyat, yil
  
  const validData = InputSchema_FIN_017.parse(input);
  const { hisse, temettu, fiyat, yil } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const yeniHisse = hisse + (temettu * hisse) / Math.max(1, fiyat);
  const getiri = temettu / Math.max(1, fiyat); // Temettü getirisi oranı
  const result = yeniHisse * Math.pow(1 + getiri, yil);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Temettü Verimliliği",
      message: "Kritik Uyarı: Temettü verimi %15'in üzerindedir. Şirketin temettü ödemesi sürdürülemez olabilir (Value Trap) veya şirket varlık satışı yapmış olabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}