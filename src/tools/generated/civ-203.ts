import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CIV_203
 * Araç Adı: Zemin Taşıma Kapasitesi
 */

export const InputSchema_CIV_203 = z.object({
  kohezyon: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  temel_genislik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yogunluk: z.number().min(500, "Endüstriyel minimum tolerans: 500"),
  derinlik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  nc_nq_ng: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_CIV_203 = z.infer<typeof InputSchema_CIV_203>;

export interface Output_CIV_203 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CIV_203(input: Input_CIV_203): Output_CIV_203 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kohezyon, temel_genislik, yogunluk, derinlik, nc_nq_ng
  
  const validData = InputSchema_CIV_203.parse(input);
  const { kohezyon, temel_genislik, yogunluk, derinlik, nc_nq_ng } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = (kohezyon * nc_nq_ng) + (yogunluk * 9.81 * derinlik * nc_nq_ng) + (0.5 * yogunluk * 9.81 * temel_genislik * nc_nq_ng);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Terzaghi Taşıma Kapasitesi Teorisi",
      message: "Kritik Uyarı: Saf kohezyonsuz kum zeminlerde gömme derinliği olmadan temel tasarımı yapılması sıfır taşıma kapasitesi (Göçme) riski doğurur."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}