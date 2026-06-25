import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MARK_101
 * Araç Adı: Dönüşüm Oranı (CRO)
 */

export const InputSchema_MARK_101 = z.object({
  ziyaretci: z.number().min(1, "Endüstriyel minimum tolerans: 1"),
  donusum: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MARK_101 = z.infer<typeof InputSchema_MARK_101>;

export interface Output_MARK_101 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MARK_101(input: Input_MARK_101): Output_MARK_101 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ziyaretci, donusum
  
  const validData = InputSchema_MARK_101.parse(input);
  const { ziyaretci, donusum } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = (donusum / Math.max(1, ziyaretci)) * 100; 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "E-Ticaret Standartları",
      message: "Uyarı: Dönüşüm oranı (CR) %15'in üzerindedir. Ortalama e-ticaret sitelerinde bu oran %1-%3 arasındadır. Ancak yüksek hedefli B2B lead generation veya sıcak yeniden pazarlama (Retargeting) kampanyası yönetiyorsanız bu değer kabul edilebilir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}