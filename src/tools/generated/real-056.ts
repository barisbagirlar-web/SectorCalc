import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_056
 * Araç Adı: Mortgage Karşılaştırma
 */

export const InputSchema_REAL_056 = z.object({
  kredi1: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz1: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kredi2: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz2: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vade: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_REAL_056 = z.infer<typeof InputSchema_REAL_056>;

export interface Output_REAL_056 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_056(input: Input_REAL_056): Output_REAL_056 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kredi1, faiz1, kredi2, faiz2, vade
  
  const validData = InputSchema_REAL_056.parse(input);
  const { kredi1, faiz1, kredi2, faiz2, vade } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // PMT = P * [i * (1+i)^n] / [(1+i)^n - 1]
  const monthlyRate1 = faiz1 / 100 / 12;
  const monthlyRate2 = faiz2 / 100 / 12;
  
  const pmt1 = monthlyRate1 === 0 
    ? kredi1 / vade 
    : kredi1 * (monthlyRate1 * Math.pow(1 + monthlyRate1, vade)) / (Math.pow(1 + monthlyRate1, vade) - 1);
    
  const pmt2 = monthlyRate2 === 0 
    ? kredi2 / vade 
    : kredi2 * (monthlyRate2 * Math.pow(1 + monthlyRate2, vade)) / (Math.pow(1 + monthlyRate2, vade) - 1);
  
  const result = pmt1 - pmt2; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result === 0) {
    smartWarnings.push({
      severity: "INFO",
      source: "Mantıksal Eşitlik",
      message: "Not: Her iki kredi teklifi de tamamen aynıdır, bir fark (arbitraj) bulunmamaktadır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}