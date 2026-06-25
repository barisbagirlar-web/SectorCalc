import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_051
 * Araç Adı: Fırsat Maliyeti
 */

export const InputSchema_FIN_051 = z.object({
  tercih_edilen_getiri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  vazgecilen_getiri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_051 = z.infer<typeof InputSchema_FIN_051>;

export interface Output_FIN_051 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_051(input: Input_FIN_051): Output_FIN_051 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: tercih_edilen_getiri, vazgecilen_getiri
  
  const validData = InputSchema_FIN_051.parse(input);
  const { tercih_edilen_getiri, vazgecilen_getiri } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = vazgecilen_getiri - tercih_edilen_getiri;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 0) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Rasyonel Seçim Teorisi",
      message: "Uyarı: Fırsat maliyeti pozitiftir. Finansal açıdan vazgeçilen alternatif, seçilen yatırımdan daha fazla net getiri sunmaktadır. Kararınızın sayısal olmayan (risk toleransı, likidite vb.) stratejik gerekçeleri olmalıdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}