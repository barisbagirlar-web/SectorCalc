import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_022
 * Araç Adı: Net Bugünkü Değer (NPV)
 */

export const InputSchema_FIN_022 = z.object({
  iskonto: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  yatirim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  nakitAkislari: z.array(z.number()).min(1, "En az bir nakit akışı gereklidir"),
});

export type Input_FIN_022 = z.infer<typeof InputSchema_FIN_022>;

export interface Output_FIN_022 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_022(input: Input_FIN_022): Output_FIN_022 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: iskonto, yatirim, nakitAkislari
  
  const validData = InputSchema_FIN_022.parse(input);
  const { iskonto, yatirim, nakitAkislari } = validData;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // NPV = SUM(NakitAkislari / (1+Iskonto/100)^t) - Yatirim
  const result: number = nakitAkislari.reduce((sum, cf, t) => {
    return sum + cf / Math.pow(1 + iskonto / 100, t + 1);
  }, 0) - yatirim; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result < 0) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Sermaye Bütçelemesi",
      message: "Kritik Karar: NPV sıfırın altındadır. Proje, yatırılan sermayenin maliyetini (iskonto oranını) karşılayamamaktadır; finansal olarak reddedilmesi önerilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}