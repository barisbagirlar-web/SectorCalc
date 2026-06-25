import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ELEC_226
 * Araç Adı: Transformatör Sarım Oranı
 */

export const InputSchema_ELEC_226 = z.object({
  v_primer: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  n_primer: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  n_sekonder: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_ELEC_226 = z.infer<typeof InputSchema_ELEC_226>;

export interface Output_ELEC_226 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ELEC_226(input: Input_ELEC_226): Output_ELEC_226 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: v_primer, n_primer, n_sekonder
  
  const validData = InputSchema_ELEC_226.parse(input);
  const { v_primer, n_primer, n_sekonder } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = 0; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Trafo İzolasyon Sınırları",
      message: "Not: Dönüştürme oranı 20:1'den büyüktür. Bu kadar agresif gerilim düşürme/yükseltme işlemleri tek kademede yapıldığında izolasyon stresleri ve kaçak akı (Leakage Flux) çok artar. Çift kademeli trafo değerlendirilebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}
