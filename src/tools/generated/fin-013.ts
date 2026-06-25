import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_013
 * Araç Adı: Sürekli Bileşik Faiz
 */

export const InputSchema_FIN_013 = z.object({
  anapara: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yil: z.number().min(0.1, "Endüstriyel minimum tolerans: 0.1"),
});

export type Input_FIN_013 = z.infer<typeof InputSchema_FIN_013>;

export interface Output_FIN_013 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_013(input: Input_FIN_013): Output_FIN_013 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: anapara, faiz, yil
  
  const validData = InputSchema_FIN_013.parse(input);
  const { anapara, faiz, yil } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = anapara * Math.exp((faiz / 100) * yil);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Teorik Limit",
      message: "Bilgi: Sürekli bileşik faiz (Euler sayısı e tabanlı) teorik maksimum getiriyi ifade eder; gerçek dünyada (kripto DeFi hariç) bankacılık sistemlerinde doğrudan uygulanmaz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}