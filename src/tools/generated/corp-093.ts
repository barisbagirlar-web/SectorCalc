import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_093
 * Araç Adı: Dönüştürülebilir Not
 */

export const InputSchema_CORP_093 = z.object({
  yatirim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  degerleme: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  iskonto: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  faiz: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CORP_093 = z.infer<typeof InputSchema_CORP_093>;

export interface Output_CORP_093 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_093(input: Input_CORP_093): Output_CORP_093 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yatirim, degerleme, iskonto, faiz
  
  const validData = InputSchema_CORP_093.parse(input);
  const { yatirim, degerleme, iskonto, faiz } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const donusumFiyati = degerleme * (1 - iskonto / 100);
  const result = (yatirim * (1 + faiz / 100)) / Math.max(0.0001, donusumFiyati);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Venture Capital Standartları",
      message: "Uyarı: %30'un üzerindeki iskonto oranları yatırımcının çok yüksek bir risk (Erken Aşama/Ölüm Vadisi) aldığını gösterir. Gelecek turda kurucu mülkiyeti agresif şekilde seyrelecektir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}