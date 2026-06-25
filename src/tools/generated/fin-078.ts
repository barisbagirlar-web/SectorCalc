import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_078
 * Araç Adı: Öğrenci Kredisi
 */

export const InputSchema_FIN_078 = z.object({
  tutar: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  grace_period: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
});

export type Input_FIN_078 = z.infer<typeof InputSchema_FIN_078>;

export interface Output_FIN_078 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_078(input: Input_FIN_078): Output_FIN_078 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: tutar, faiz, vade, grace_period
  
  const validData = InputSchema_FIN_078.parse(input);
  const { tutar, faiz, vade, grace_period } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const monthlyRate = faiz / 100 / 12;
  const effectivePeriods = vade - grace_period;
  const result = effectivePeriods <= 0
    ? tutar
    : (tutar * monthlyRate * Math.pow(1 + monthlyRate, effectivePeriods)) /
      (Math.pow(1 + monthlyRate, effectivePeriods) - 1);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Bileşik Faiz Riski",
      message: "Uyarı: Ödemesiz dönem (Grace Period) sırasında faiz genellikle tahakkuk etmeye devam eder ve anaparaya eklenir (Kapitalizasyon). Mezun olduğunuzda ödemeye başlayacağınız anapara, çektiğiniz tutardan çok daha yüksek olacaktır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}