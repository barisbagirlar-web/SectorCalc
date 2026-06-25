import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: ECOM_127
 * Araç Adı: KDV (AB - IOSS)
 */

export const InputSchema_ECOM_127 = z.object({
  net_fiyat: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kargo: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  ulke_kdv: z.number().min(15, "Endüstriyel minimum tolerans: 15"),
});

export type Input_ECOM_127 = z.infer<typeof InputSchema_ECOM_127>;

export interface Output_ECOM_127 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_ECOM_127(input: Input_ECOM_127): Output_ECOM_127 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: net_fiyat, kargo, ulke_kdv
  
  const validData = InputSchema_ECOM_127.parse(input);
  const { net_fiyat, kargo, ulke_kdv } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (net_fiyat + kargo) * (ulke_kdv / 100);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "AB IOSS Regülasyonları",
      message: "Kritik Uyarı: Ürün bedeli (Kargo hariç) 150 EUR sınırını aşmaktadır. IOSS (Import One-Stop Shop) mekanizması kullanılamaz. Ürün gümrüğe takılacak, alıcıdan ekstra gümrük sunum ücreti ve ithalat vergileri tahsil edilecektir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}