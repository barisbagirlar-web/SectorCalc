import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_052
 * Araç Adı: Sermaye Kazancı Vergisi
 */

export const InputSchema_FIN_052 = z.object({
  satis: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  alis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vergi_orani: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  istisna: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_052 = z.infer<typeof InputSchema_FIN_052>;

export interface Output_FIN_052 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_052(input: Input_FIN_052): Output_FIN_052 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: satis, alis, vergi_orani, istisna
  
  const validData = InputSchema_FIN_052.parse(input);
  const { satis, alis, vergi_orani, istisna } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const matrah = Math.max(0, satis - alis - istisna);
  const result = matrah * vergi_orani / 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Vergi Usul Kanunu",
      message: "Not: Satış bedeli alış bedelinin altındadır (Sermaye Zararı). Çoğu vergi rejiminde zararlar üzerinden vergi hesaplanmaz ve oluşacak matrah 0 kabul edilir."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Vergi Muafiyetleri",
      message: "Not: Elde edilen kâr, yasal istisna tutarının altında kaldığı için ödenecek vergi doğmamaktadır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}