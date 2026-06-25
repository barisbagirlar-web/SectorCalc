import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: IND_150
 * Araç Adı: Gage R&R (Ölçüm Sistemi Analizi)
 */

export const InputSchema_IND_150 = z.object({
  parca_varyans: z.number().min(0.0001, "Endüstriyel minimum tolerans: 0.0001"),
  olcum_varyans: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_IND_150 = z.infer<typeof InputSchema_IND_150>;

export interface Output_IND_150 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_IND_150(input: Input_IND_150): Output_IND_150 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: parca_varyans, olcum_varyans
  
  const validData = InputSchema_IND_150.parse(input);
  const { parca_varyans, olcum_varyans } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const toplamVaryans = parca_varyans + olcum_varyans;
  const result = (olcum_varyans / Math.max(0.0001, toplamVaryans)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 30) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "AIAG MSA Kılavuzu",
      message: "Kritik Uyarı: %GR&R oranınız %30'un üzerindedir. Ölçüm sisteminiz (cihaz veya operatör) REDDEDİLMİŞTİR. Karşılaştığınız kalite hatalarının sebebi üründen ziyade ölçüm cihazının hassasiyetsizliği veya operatörün yanlış kullanımıdır."
    });
  }

  if (result < 10) {
    smartWarnings.push({
      severity: "INFO",
      source: "AIAG MSA Kılavuzu",
      message: "Bilgi: %GR&R oranınız %10'un altındadır. Ölçüm sisteminiz mükemmel düzeydedir ve güvenle kullanılabilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}