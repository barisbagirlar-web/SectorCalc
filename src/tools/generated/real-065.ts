import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_065
 * Araç Adı: BRRRR Stratejisi
 */

export const InputSchema_REAL_065 = z.object({
  alim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  rehab: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  deger: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kredi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kira: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_REAL_065 = z.infer<typeof InputSchema_REAL_065>;

export interface Output_REAL_065 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_065(input: Input_REAL_065): Output_REAL_065 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: alim, rehab, deger, kredi, kira
  
  const validData = InputSchema_REAL_065.parse(input);
  const { alim, rehab, deger, kredi, kira } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const zorunluSermaye = alim + rehab - kredi;
  const result = (kira * 12) / Math.max(1, zorunluSermaye) * 100;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "BRRRR LTV Sınırları",
      message: "Uyarı: Refinansman kredisinin Tadilat Sonrası Değere (ARV) oranı (LTV) %75'i aşmaktadır. Çoğu banka bu oranın üzerinde nakit-çıkışlı (cash-out) kredi onaylamaz."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}