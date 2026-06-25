import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: CORP_115
 * Araç Adı: Danışmanlık Saat Ücreti
 */

export const InputSchema_CORP_115 = z.object({
  hedef_gelir: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yillik_gider: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faturali_saat: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
});

export type Input_CORP_115 = z.infer<typeof InputSchema_CORP_115>;

export interface Output_CORP_115 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_CORP_115(input: Input_CORP_115): Output_CORP_115 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: hedef_gelir, yillik_gider, faturali_saat
  
  const validData = InputSchema_CORP_115.parse(input);
  const { hedef_gelir, yillik_gider, faturali_saat } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (hedef_gelir + yillik_gider) / Math.max(1, faturali_saat); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "B2B Danışmanlık Standartları",
      message: "Uyarı: Satış, pazarlama, müşteri iletişimi ve muhasebe gibi faturalandırılamayan idari işler (Non-billable) genellikle toplam mesainin %30-40'ını alır. Yıllık 1500 saatin üzerinde müşteri faturası kesmek 'Tükenmişlik (Burnout)' riski taşır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}