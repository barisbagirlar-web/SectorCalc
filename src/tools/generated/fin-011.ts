import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_011
 * Araç Adı: Bileşik Faiz
 */

export const InputSchema_FIN_011 = z.object({
  anapara: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yil: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  siklik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_011 = z.infer<typeof InputSchema_FIN_011>;

export interface Output_FIN_011 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_011(input: Input_FIN_011): Output_FIN_011 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: anapara, faiz, yil, siklik
  
  const validData = InputSchema_FIN_011.parse(input);
  const { anapara, faiz, yil, siklik } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const effectivePeriods = Math.max(1, siklik);
  const result = anapara * Math.pow(1 + (faiz / 100) / effectivePeriods, effectivePeriods * yil); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Uzun Vade Dinamikleri",
      message: "Uyarı: 30 yılı aşan projeksiyonlarda enflasyon ve piyasa koşullarındaki değişimler, nominal bileşik değerin alım gücünü (reel değeri) ciddi şekilde saptırabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}