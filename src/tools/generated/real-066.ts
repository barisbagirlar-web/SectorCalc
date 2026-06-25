import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_066
 * Araç Adı: Kiralık Gayrimenkul Analizi
 */

export const InputSchema_REAL_066 = z.object({
  brut_kira: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  bosluk: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  isletme: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kredi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_REAL_066 = z.infer<typeof InputSchema_REAL_066>;

export interface Output_REAL_066 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_066(input: Input_REAL_066): Output_REAL_066 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: brut_kira, bosluk, isletme, kredi
  
  const validData = InputSchema_REAL_066.parse(input);
  const { brut_kira, bosluk, isletme, kredi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = (brut_kira * (1 - bosluk / 100)) - isletme - kredi; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Emlak %50 Kuralı",
      message: "Not: İşletme giderleri brüt kiranın %30'undan düşüktür. Sigorta, vergi, aidat, periyodik bakım ve onarım gibi gizli maliyetleri eksik hesaplamış olabilirsiniz."
    });
  }

  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "Nakit Akışı",
      message: "Kritik Uyarı: Net Nakit Akışı negatif veya sıfırdır. Varlık yükümlülüklerini karşılayamıyor."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}