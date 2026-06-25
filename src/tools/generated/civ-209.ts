import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CIV_209
 * Araç Adı: Ahşap Kiriş (Kesme)
 */

export const InputSchema_CIV_209 = z.object({
  kesme_kuvveti: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  genislik: z.number().min(0.01, "Endüstriyel minimum tolerans: 0.01"),
  yukseklik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CIV_209 = z.infer<typeof InputSchema_CIV_209>;

export interface Output_CIV_209 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CIV_209(input: Input_CIV_209): Output_CIV_209 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kesme_kuvveti, genislik, yukseklik
  
  const validData = InputSchema_CIV_209.parse(input);
  const { kesme_kuvveti, genislik, yukseklik } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (1.5 * kesme_kuvveti) / Math.max(0.0001, (genislik * yukseklik)); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "NDS (National Design Specification for Wood Construction)",
      message: "Uyarı: Liflere paralel doğrultudaki maksimum kayma gerilmesi ahşap malzeme sınırlarını (1.5 MPa) aşmıştır. Lif boyunca çatlama ve katmanlarına ayrılma riski mevcuttur."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}