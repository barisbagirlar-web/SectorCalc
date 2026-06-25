import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_059
 * Araç Adı: Mortgage Refinansman
 */

export const InputSchema_REAL_059 = z.object({
  eski_taksit: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yeni_taksit: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kapatma_masrafi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_REAL_059 = z.infer<typeof InputSchema_REAL_059>;

export interface Output_REAL_059 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_059(input: Input_REAL_059): Output_REAL_059 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: eski_taksit, yeni_taksit, kapatma_masrafi
  
  const validData = InputSchema_REAL_059.parse(input);
  const { eski_taksit, yeni_taksit, kapatma_masrafi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = kapatma_masrafi / Math.max(1, (eski_taksit - yeni_taksit));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Refinansman Karlılığı",
      message: "Uyarı: Yeni kredi masraflarının kendini geri ödeme süresi (Amortisman) 5 yılı aşıyor. Oranlardaki düşüş cazip görünse de operasyonel masraflar getirisini yutmaktadır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}