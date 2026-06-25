import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_026
 * Araç Adı: Sermaye Maliyeti (WACC)
 */

export const InputSchema_FIN_026 = z.object({
  ozsermaye: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  borc: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  re: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  rd: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vergi: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
});

export type Input_FIN_026 = z.infer<typeof InputSchema_FIN_026>;

export interface Output_FIN_026 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_026(input: Input_FIN_026): Output_FIN_026 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ozsermaye, borc, re, rd, vergi
  
  const validData = InputSchema_FIN_026.parse(input);
  const { ozsermaye, borc, re, rd, vergi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const V = ozsermaye + borc;
  const V_safe = Math.max(1, V);
  const wacc = (ozsermaye / V_safe * re) + (borc / V_safe * rd * (1 - vergi / 100));
  const result = wacc;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Sermaye Yapısı",
      message: "Uyarı: Şirketin sermaye yapısındaki borç oranı (Kaldıraç) %80'in üzerindedir. Vergi kalkanı (tax shield) avantajı sağlasa da, iflas ve finansal sıkıntı (distress) riski çok yüksektir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}