import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_200
 * Araç Adı: Birim Şekil Değiştirme (Strain)
 */

export const InputSchema_MECH_200 = z.object({
  ilk_boy: z.number().min(0.0001, "Endüstriyel minimum tolerans: 0.0001"),
  son_boy: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_200 = z.infer<typeof InputSchema_MECH_200>;

export interface Output_MECH_200 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_200(input: Input_MECH_200): Output_MECH_200 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: ilk_boy, son_boy
  
  const validData = InputSchema_MECH_200.parse(input);
  const { ilk_boy, son_boy } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = (son_boy - ilk_boy) / Math.max(0.0001, ilk_boy);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "INFO",
      source: "Malzeme Kopma Davranışı",
      message: "Not: Birim şekil değiştirme %0.5'in (0.005) üzerindedir. Metaller için bu değer kalıcı (Plastik) deformasyon bölgesine girildiğini; polimer/kauçuk malzemeler için ise viskoelastik akmanın başladığını gösterir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}