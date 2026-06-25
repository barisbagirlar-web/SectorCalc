import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_053
 * Araç Adı: Emlak Vergisi
 */

export const InputSchema_FIN_053 = z.object({
  rayic_bedel: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  vergi_orani: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_053 = z.infer<typeof InputSchema_FIN_053>;

export interface Output_FIN_053 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_053(input: Input_FIN_053): Output_FIN_053 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: rayic_bedel, vergi_orani
  
  const validData = InputSchema_FIN_053.parse(input);
  const { rayic_bedel, vergi_orani } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = rayic_bedel * (vergi_orani / 1000);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (vergi_orani > 10) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Yerel Yönetim Standartları",
      message: "Uyarı: Vergi oranı binde 10'un (Yüzde 1) üzerindedir. Genellikle konutlar için bu oran binde 1-2, işyerleri/arsalar için binde 2-6 arasındadır. Oranı teyit edin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}