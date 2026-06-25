import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_012
 * Araç Adı: Günlük/Aylık/Yıllık Bileşik Faiz
 */

export const InputSchema_FIN_012 = z.object({
  anapara: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  gun: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_FIN_012 = z.infer<typeof InputSchema_FIN_012>;

export interface Output_FIN_012 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_012(input: Input_FIN_012): Output_FIN_012 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: anapara, faiz, gun
  
  const validData = InputSchema_FIN_012.parse(input);
  const { anapara, faiz, gun } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Günlük = Anapara * (1 + Faiz/36500)^Gun
  const result: number = anapara * Math.pow((1 + faiz / 36500), gun);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Bankacılık Uygulamaları",
      message: "Not: 30 günden kısa vadelerde, çoğu ticari kurum bileşik faiz yerine basit faiz işletmeyi tercih eder. Sözleşme şartlarınızı kontrol edin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}