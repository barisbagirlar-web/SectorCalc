import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_070
 * Araç Adı: PMI (Özel Mortgage Sigortası)
 */

export const InputSchema_REAL_070 = z.object({
  kredi_tutari: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  pmi_orani: z.number().min(0.1, "Endüstriyel minimum tolerans: 0.1"),
});

export type Input_REAL_070 = z.infer<typeof InputSchema_REAL_070>;

export interface Output_REAL_070 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_070(input: Input_REAL_070): Output_REAL_070 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kredi_tutari, pmi_orani
  
  const validData = InputSchema_REAL_070.parse(input);
  const { kredi_tutari, pmi_orani } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // AylikPMI = (KrediTutari * PMIOrani/100) / 12
  const result: number = (kredi_tutari * (pmi_orani / 100)) / 12;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Bankacılık Standartları",
      message: "Bilgi: Çoğu standart kredi sözleşmesinde, ödenen anapara ile mülkteki özsermaye (Equity) oranı %20'ye ulaştığında (LTV %80'in altına düştüğünde) PMI ödemesinin yasal olarak iptal edilmesi talep edilebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}