import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_198
 * Araç Adı: Statik Basınç (Akışkan)
 */

export const InputSchema_MECH_198 = z.object({
  yogunluk: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  derinlik: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
});

export type Input_MECH_198 = z.infer<typeof InputSchema_MECH_198>;

export interface Output_MECH_198 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_198(input: Input_MECH_198): Output_MECH_198 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: yogunluk, derinlik
  
  const validData = InputSchema_MECH_198.parse(input);
  const { yogunluk, derinlik } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = yogunluk * 9.81 * derinlik;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 1000000) {
    smartWarnings.push({
      severity: "INFO",
      source: "Basınçlı Ekipmanlar",
      message: "Not: Hidrostatik basınç 1 MPa'nın (10 Bar) üzerindedir. Derin tank veya kuyu dibi uygulamalarında tank cidar kalınlığının ve taban flanşlarının bu basınca göre (ASME Boiler and Pressure Vessel Code) boyutlandırılması zorunludur."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}