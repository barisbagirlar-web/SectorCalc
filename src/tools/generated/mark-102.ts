import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MARK_102
 * Araç Adı: Tıklama Oranı (CTR)
 */

export const InputSchema_MARK_102 = z.object({
  tiklama: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  gosterim: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_MARK_102 = z.infer<typeof InputSchema_MARK_102>;

export interface Output_MARK_102 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MARK_102(input: Input_MARK_102): Output_MARK_102 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: tiklama, gosterim
  
  const validData = InputSchema_MARK_102.parse(input);
  const { tiklama, gosterim } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = (tiklama / Math.max(1, gosterim)) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Dijital Reklam Standartları",
      message: "Uyarı: Tıklama oranı %25'in üzerinde. Standart display veya arama ağı reklamları için bu oran şüpheli derecede yüksektir; bot trafiği (Click Fraud) veya yanlış sayım yapıyor olabilirsiniz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}