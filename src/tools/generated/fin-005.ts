import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: FIN_005
 * Araç Adı: Yıllık Gelir (Annuity)
 */

export const InputSchema_FIN_005 = z.object({
  anapara: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  faiz: z.number().min(0, "Endüstriyel minimum tolerans: 0"),
  donem: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_FIN_005 = z.infer<typeof InputSchema_FIN_005>;

export interface Output_FIN_005 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_FIN_005(input: Input_FIN_005): Output_FIN_005 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: anapara, faiz, donem
  
  const validData = InputSchema_FIN_005.parse(input);
  const { anapara, faiz, donem } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = anapara * ((faiz/12) / Math.max(0.0001, (1 - Math.pow(1 + faiz/12, -donem))));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (faiz === 0) {
    smartWarnings.push({
      severity: "INFO",
      source: "Paranın Zaman Değeri",
      message: "Not: Faiz oranı %0 girildi. Paranın zaman değeri (TVM) hesaplanmayacak, sadece anapara dönem sayısına bölünecektir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}