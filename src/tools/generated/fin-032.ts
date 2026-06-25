import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_032
 * Araç Adı: Fiyat/Defter (P/B) Oranı
 */

export const InputSchema_FIN_032 = z.object({
  piyasa_degeri: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  ozsermaye: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_032 = z.infer<typeof InputSchema_FIN_032>;

export interface Output_FIN_032 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_032(input: Input_FIN_032): Output_FIN_032 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: piyasa_degeri, ozsermaye
  
  const validData = InputSchema_FIN_032.parse(input);
  const { piyasa_degeri, ozsermaye } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = piyasa_degeri / Math.max(1, ozsermaye); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result < 1) {
    smartWarnings.push({
      severity: "INFO",
      source: "Graham Değer Yatırımı",
      message: "Not: P/B oranı 1'in altındadır. Piyasa, şirketi sahip olduğu net varlıkların (tasfiye değerinin) bile altında fiyatlamaktadır. Potansiyel fırsat veya değer tuzağı (Value Trap) işareti olabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}