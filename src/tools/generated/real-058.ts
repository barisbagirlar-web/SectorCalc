import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_058
 * Araç Adı: Mortgage Puanları (Points)
 */

export const InputSchema_REAL_058 = z.object({
  kredi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  puan_orani: z.number().min(0.1, "Endüstriyel minimum tolerans: 0.1"),
  aylik_tasarruf: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_REAL_058 = z.infer<typeof InputSchema_REAL_058>;

export interface Output_REAL_058 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_058(input: Input_REAL_058): Output_REAL_058 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kredi, puan_orani, aylik_tasarruf
  
  const validData = InputSchema_REAL_058.parse(input);
  const { kredi, puan_orani, aylik_tasarruf } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const maliyet = kredi * puan_orani / 100;
  const gerekiDonus = maliyet / Math.max(1, aylik_tasarruf);
  const result = gerekiDonus; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 84) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Break-Even Analizi",
      message: "Uyarı: Peşin ödenen puan masrafının kendini amorti etmesi 7 yılı (84 ay) aşıyor. Eğer bu evde 7 yıldan daha kısa süre oturmayı planlıyorsanız puan satın almak net zarar yaratacaktır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}