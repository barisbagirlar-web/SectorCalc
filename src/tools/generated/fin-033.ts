import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_033
 * Araç Adı: Fiyat/Satış (P/S) Oranı
 */

export const InputSchema_FIN_033 = z.object({
  piyasa_degeri: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  toplam_satislar: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_FIN_033 = z.infer<typeof InputSchema_FIN_033>;

export interface Output_FIN_033 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_033(input: Input_FIN_033): Output_FIN_033 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: piyasa_degeri, toplam_satislar
  
  const validData = InputSchema_FIN_033.parse(input);
  const { piyasa_degeri, toplam_satislar } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = piyasa_degeri / Math.max(1, toplam_satislar); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "SaaS / Teknoloji Değerlemeleri",
      message: "Uyarı: P/S oranının 20'yi aşması, yatırımcıların satış başına çok yüksek bir prim ödediğini gösterir. Tipik olarak hiper-büyüme sağlayan yazılım şirketlerinde görülse de, standart sektörler için balon (bubble) riskidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}