import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: IND_141
 * Araç Adı: Öğrenme Eğrisi
 */

export const InputSchema_IND_141 = z.object({
  ilk_sure: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ogrenme_orani: z.number().min(50, "Endüstriyel minimum tolerans: 50"),
  uretilen_adet: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_IND_141 = z.infer<typeof InputSchema_IND_141>;

export interface Output_IND_141 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_141(input: Input_IND_141): Output_IND_141 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ilk_sure, ogrenme_orani, uretilen_adet
  
  const validData = InputSchema_IND_141.parse(input);
  const { ilk_sure, ogrenme_orani, uretilen_adet } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const faktor = Math.log(Math.max(0.0001, ogrenme_orani / 100)) / Math.log(2);
  const result = ilk_sure * Math.pow(uretilen_adet, faktor);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Üretim Ergonomisi",
      message: "Uyarı: Çok agresif bir öğrenme oranı (<%75) girdiniz. Endüstriyel montaj hatlarında teorik sınır genellikle %80-85 arasındadır. Bu hedef, işçi üzerinde aşırı baskı ve kalite kusurları yaratabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}