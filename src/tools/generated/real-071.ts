import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: REAL_071
 * Araç Adı: FHA Kredisi
 */

export const InputSchema_REAL_071 = z.object({
  kredi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  pesin_prim: z.number().min(0.1, "Endüstriyel minimum tolerans: 0.1"),
  yillik_prim: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_REAL_071 = z.infer<typeof InputSchema_REAL_071>;

export interface Output_REAL_071 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_REAL_071(input: Input_REAL_071): Output_REAL_071 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kredi, pesin_prim, yillik_prim
  
  const validData = InputSchema_REAL_071.parse(input);
  const { kredi, pesin_prim, yillik_prim } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const pesin = kredi * (pesin_prim / 100);
  const aylik = (kredi * (yillik_prim / 100)) / 12;
  const result: number = pesin + aylik;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "FHA Düzenlemeleri",
      message: "Uyarı: FHA kuralları gereği, eğer asgari peşinatla (%3.5) kredi kullandıysanız, Yıllık MIP (Mortgage Insurance Premium) kredinin tüm ömrü boyunca (30 yıl) ödenmek zorundadır, LTV %80'in altına düşse bile iptal edilemez."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}