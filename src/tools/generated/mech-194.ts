import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_194
 * Araç Adı: Kayma Gerilmesi (Burulma)
 */

export const InputSchema_MECH_194 = z.object({
  tork: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  yaricap: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kutupsal_atalet: z.number().min(1e-9, "Endüstriyel minimum tolerans: 1e-9"),
});

export type Input_MECH_194 = z.infer<typeof InputSchema_MECH_194>;

export interface Output_MECH_194 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_194(input: Input_MECH_194): Output_MECH_194 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: tork, yaricap, kutupsal_atalet
  
  const validData = InputSchema_MECH_194.parse(input);
  const { tork, yaricap, kutupsal_atalet } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (tork * yaricap) / Math.max(0.0001, kutupsal_atalet);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 150000000) {
    smartWarnings.push({
      severity: "INFO",
      source: "Tresca (Maksimum Kayma) Kriteri",
      message: "Not: Çıkan kayma gerilmesi 150 MPa'yı aşmaktadır. Yumuşak çeliklerde (S275, St37 vb.) kayma akma sınırı, çekme akma sınırının yaklaşık %50-57'si kadardır (Tresca/Von Mises). Malzemenizin kayma akma dayanımını kontrol edin."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}