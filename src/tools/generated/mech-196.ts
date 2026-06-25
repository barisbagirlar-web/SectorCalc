import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_196
 * Araç Adı: Yay-Kütle Sistemi
 */

export const InputSchema_MECH_196 = z.object({
  kutle: z.number().min(0.001, "Endüstriyel minimum tolerans: 0.001"),
  yay_katsayisi: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_196 = z.infer<typeof InputSchema_MECH_196>;

export interface Output_MECH_196 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_196(input: Input_MECH_196): Output_MECH_196 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: kutle, yay_katsayisi
  
  const validData = InputSchema_MECH_196.parse(input);
  const { kutle, yay_katsayisi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = Math.sqrt(Math.max(0, yay_katsayisi / Math.max(0.0001, kutle)));
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Sönümsüz Titreşim Teorisi",
      message: "Uyarı: Formül sönüm (Damping - c) faktörünü yoksayar. Rezonans durumunda, sönümsüz sistemlerin genliği teorik olarak sonsuza ıraksar. Pratik uygulamalarda viskoz veya yapısal sönüm katsayısı eklenmelidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}