import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_035
 * Araç Adı: ROIC (Yatırım Getirisi)
 */

export const InputSchema_FIN_035 = z.object({
  nopat: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yatirilan_sermaye: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_FIN_035 = z.infer<typeof InputSchema_FIN_035>;

export interface Output_FIN_035 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_035(input: Input_FIN_035): Output_FIN_035 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: nopat, yatirilan_sermaye
  
  const validData = InputSchema_FIN_035.parse(input);
  const { nopat, yatirilan_sermaye } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = (nopat / Math.max(1, yatirilan_sermaye)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Kurumsal Finans",
      message: "Bilgi: Çıkan ROIC sonucunun, şirketin Ağırlıklı Sermaye Maliyeti (WACC) ile karşılaştırılması gerekir. ROIC > WACC ise şirket değer yaratıyordur."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}