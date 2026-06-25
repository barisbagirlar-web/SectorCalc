import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ECOM_119
 * Araç Adı: Etsy Ücreti
 */

export const InputSchema_ECOM_119 = z.object({
  satis: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  listeleme: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  islem: z.number().min(5, "Endüstriyel minimum tolerans: 5"),
  odeme: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_ECOM_119 = z.infer<typeof InputSchema_ECOM_119>;

export interface Output_ECOM_119 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ECOM_119(input: Input_ECOM_119): Output_ECOM_119 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: satis, listeleme, islem, odeme
  
  const validData = InputSchema_ECOM_119.parse(input);
  const { satis, listeleme, islem, odeme } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  // Kesinti = Listeleme + (Satis * Islem / 100) + (Satis * Odeme / 100)
  const result = listeleme + (satis * islem / 100) + (satis * odeme / 100); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Etsy Offsite Ads",
      message: "Uyarı: Eğer mağazanızın yıllık cirosu 10,000$ üzerindeyse, Etsy sizi zorunlu 'Offsite Ads' (Site Dışı Reklamlar) programına dahil eder ve bu satışlardan otomatik olarak %12 ek komisyon keser."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}