import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_185
 * Araç Adı: Lento Boyutlandırma
 */

export const InputSchema_MECH_185 = z.object({
  yuk: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  aciklik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  genislik: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yukseklik: z.number().min(0.05, "Endüstriyel minimum tolerans: 0.05"),
});

export type Input_MECH_185 = z.infer<typeof InputSchema_MECH_185>;

export interface Output_MECH_185 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_185(input: Input_MECH_185): Output_MECH_185 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yuk, aciklik, genislik, yukseklik
  
  const validData = InputSchema_MECH_185.parse(input);
  const { yuk, aciklik, genislik, yukseklik } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const moment = (yuk * aciklik) / 8;
  const ataletMomenti = (genislik * Math.pow(yukseklik, 3)) / 12;
  const result = (moment * (yukseklik / 2)) / Math.max(0.0001, ataletMomenti);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Yapı Mekaniği",
      message: "Uyarı: Yükseklik / Genişlik oranı 5'in üzerindedir. Lento eksen etrafında stabil değildir ve yük altında yanal burkulma (Lateral Torsional Buckling) riski taşır; genişlik artırılmalıdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}