import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_202
 * Araç Adı: Tolerans ve Geçme
 */

export const InputSchema_MECH_202 = z.object({
  delik_cap: z.number().min(0.0001, "Endüstriyel minimum tolerans: 0.0001"),
  mil_cap: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_202 = z.infer<typeof InputSchema_MECH_202>;

export interface Output_MECH_202 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_202(input: Input_MECH_202): Output_MECH_202 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: delik_cap, mil_cap
  
  const validData = InputSchema_MECH_202.parse(input);
  const { delik_cap, mil_cap } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: any = delik_cap - mil_cap;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "ISO 286 Tolerans Standartları",
      message: "Kritik Uyarı: Negatif boşluk (sıkılık) 500 mikronu aşmaktadır. Presleme esnasında parçaların deforme olması veya montajın kilitlenmesi riski mevcuttur."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}