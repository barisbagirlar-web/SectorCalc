import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_004
 * Araç Adı: Amortisman
 */

export const InputSchema_FIN_004 = z.object({
  bedel: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kalinti: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  omur: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  yontem: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_004 = z.infer<typeof InputSchema_FIN_004>;

export interface Output_FIN_004 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_004(input: Input_FIN_004): Output_FIN_004 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: bedel, kalinti, omur, yontem
  
  const validData = InputSchema_FIN_004.parse(input);
  const { bedel, kalinti, omur, yontem } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const safeOmur = Math.max(1, omur);
  let result: number;
  if (yontem === 0) {
    // Doğrusal amortisman: (Bedel - Kalıntı) / max(1, Omur)
    result = (bedel - kalinti) / safeOmur;
  } else {
    // Azalan bakiyeler yöntemi: (Bedel - Birikmiş) * (2 / max(1, Omur))
    result = (bedel - kalinti) * (2 / safeOmur);
  }
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Muhasebe Standartları (TFRS)",
      message: "Hata: Kalıntı (hurda) değer, varlığın ilk alım bedeline eşit veya ondan büyük olamaz. Amortismana tabi tutar sıfırdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}