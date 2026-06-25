import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_042
 * Araç Adı: Yatırım Fonu Getirisi
 */

export const InputSchema_FIN_042 = z.object({
  baslangic_nav: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  bitis_nav: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  dagitim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_042 = z.infer<typeof InputSchema_FIN_042>;

export interface Output_FIN_042 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_042(input: Input_FIN_042): Output_FIN_042 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: baslangic_nav, bitis_nav, dagitim
  
  const validData = InputSchema_FIN_042.parse(input);
  const { baslangic_nav, bitis_nav, dagitim } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = ((bitis_nav + dagitim - baslangic_nav) / Math.max(1, baslangic_nav)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result < 0) {
    smartWarnings.push({
      severity: "INFO",
      source: "Fon Analizi",
      message: "Not: Fon dönemsel olarak değer kaybetmiştir. Dağıtılan kâr payları anapara kaybını telafi etmeye yetmemiştir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}