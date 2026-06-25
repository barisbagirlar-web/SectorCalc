import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_199
 * Araç Adı: Çelik Kiriş (Eğilme)
 */

export const InputSchema_MECH_199 = z.object({
  moment: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  kesit_modulu: z.number().min(1e-9, "Endüstriyel minimum tolerans: 1e-9"),
});

export type Input_MECH_199 = z.infer<typeof InputSchema_MECH_199>;

export interface Output_MECH_199 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_199(input: Input_MECH_199): Output_MECH_199 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: moment, kesit_modulu
  
  const validData = InputSchema_MECH_199.parse(input);
  const { moment, kesit_modulu } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = moment / Math.max(0.0001, kesit_modulu);
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 235000000) {
    smartWarnings.push({
      severity: "WARNING",
      source: "AISC Çelik Yapılar",
      message: "Uyarı: Dış liflerdeki eğilme gerilmesi (Bending Stress) 235 MPa'yı aşmaktadır. Standart yapı çeliklerinde (S235JR) plastik mafsal oluşumu (Yielding) başlar. Kiriş kesiti (IPE/HEA) büyütülmelidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}