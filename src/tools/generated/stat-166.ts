import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: STAT_166
 * Araç Adı: Standart Sapma ve Varyans
 */

export const InputSchema_STAT_166 = z.object({
  veri_seti: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_STAT_166 = z.infer<typeof InputSchema_STAT_166>;

export interface Output_STAT_166 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_STAT_166(input: Input_STAT_166): Output_STAT_166 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: veri_seti
  
  const validData = InputSchema_STAT_166.parse(input);
  const { veri_seti } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const data = veri_seti as number[];
  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / Math.max(1, n - 1);
  const result = Math.sqrt(Math.max(0, variance));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > result) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Varyasyon Katsayısı (CV)",
      message: "Uyarı: Standart sapma ortalamadan büyük (Varyasyon Katsayısı > 1). Sisteminizde/sürecinizde olağanüstü bir volatilite ve istikrarsızlık var. Endüstriyel üretimde bu durum kalitenin kontrolden çıktığını gösterir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}