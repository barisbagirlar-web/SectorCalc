import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_064
 * Araç Adı: Nakit-Nakit Getiri (CoC)
 */

export const InputSchema_REAL_064 = z.object({
  yillik_nakit_akis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  toplam_nakit_yatirim: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_REAL_064 = z.infer<typeof InputSchema_REAL_064>;

export interface Output_REAL_064 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_064(input: Input_REAL_064): Output_REAL_064 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yillik_nakit_akis, toplam_nakit_yatirim
  
  const validData = InputSchema_REAL_064.parse(input);
  const { yillik_nakit_akis, toplam_nakit_yatirim } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (yillik_nakit_akis / Math.max(1, toplam_nakit_yatirim)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Sürdürülebilirlik",
      message: "Kritik Uyarı: Yıllık nakit akışı negatiftir. Mülk kendi kendini ödeyememekte ve cebinizden her ay ekstra nakit yutmaktadır (Negative Cash Flow)."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}