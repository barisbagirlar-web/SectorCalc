import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_014
 * Araç Adı: Nominal ve Efektif Faiz
 */

export const InputSchema_FIN_014 = z.object({
  nominal: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  siklik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_014 = z.infer<typeof InputSchema_FIN_014>;

export interface Output_FIN_014 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_014(input: Input_FIN_014): Output_FIN_014 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: nominal, siklik
  
  const validData = InputSchema_FIN_014.parse(input);
  const { nominal, siklik } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const frequency = Math.max(1, siklik);
  const result: number = ((1 + (nominal / 100) / frequency) ** frequency - 1) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Matematiksel Eşitlik",
      message: "Not: Bileşim sıklığı 1 (Yıllık) olduğunda, efektif faiz nominal faize eşittir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}