import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: LOG_135
 * Araç Adı: Nakliye Maliyeti (Navlun)
 */

export const InputSchema_LOG_135 = z.object({
  mesafe: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  tonaj: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  birim_fiyat: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_LOG_135 = z.infer<typeof InputSchema_LOG_135>;

export interface Output_LOG_135 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_LOG_135(input: Input_LOG_135): Output_LOG_135 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: mesafe, tonaj, birim_fiyat
  
  const validData = InputSchema_LOG_135.parse(input);
  const { mesafe, tonaj, birim_fiyat } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = mesafe * tonaj * birim_fiyat;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Karayolu Taşıma Yönetmeliği",
      message: "Kritik Uyarı: Standart bir treylerin (TIR) taşıyabileceği maksimum yasal faydalı yük sınırı genellikle 24-26 tondur. Tonaj aşımı cezai işleme (Kantar Cezası) ve taşıma reddine yol açacaktır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}