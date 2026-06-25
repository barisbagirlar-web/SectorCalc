import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_201
 * Araç Adı: Gerilme (Stress)
 */

export const InputSchema_MECH_201 = z.object({
  kuvvet: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  alan: z.number().min(1e-7, "Endüstriyel minimum tolerans: 1e-7"),
});

export type Input_MECH_201 = z.infer<typeof InputSchema_MECH_201>;

export interface Output_MECH_201 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_201(input: Input_MECH_201): Output_MECH_201 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kuvvet, alan
  
  const validData = InputSchema_MECH_201.parse(input);
  const { kuvvet, alan } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = kuvvet / Math.max(0.0001, alan); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Mühendislik vs Gerçek Gerilme",
      message: "Uyarı: Bu formül 'Mühendislik Gerilmesi'ni (Engineering Stress) verir. Yüksek çekme yüklerinde malzeme uzarken kesit alanı daralır (Boyun Verme/Necking). Doğru hasar analizi için anlık kesit alanını kullanan 'Gerçek Gerilme' (True Stress) hesaplanmalıdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}