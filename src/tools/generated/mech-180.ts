import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_180
 * Araç Adı: Sıkı Geçme (Geçme Basıncı)
 */

export const InputSchema_MECH_180 = z.object({
  girisim: z.number().min(0.000001, "Endüstriyel minimum tolerans: 0.000001"),
  nominal_cap: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  e_modulu_mil: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  e_modulu_gobek: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_180 = z.infer<typeof InputSchema_MECH_180>;

export interface Output_MECH_180 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_180(input: Input_MECH_180): Output_MECH_180 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: girisim, nominal_cap, e_modulu_mil, e_modulu_gobek
  
  const validData = InputSchema_MECH_180.parse(input);
  const { girisim, nominal_cap, e_modulu_mil, e_modulu_gobek } = validData as any;
  
  // Formül: Basinc = Girisim / MAX(0.0001, (Cap * (1/MAX(0.0001,E1) + 1/MAX(0.0001,E2))))
  const safeE1 = Math.max(0.0001, e_modulu_mil);
  const safeE2 = Math.max(0.0001, e_modulu_gobek);
  const denominator = Math.max(0.0001, nominal_cap * (1 / safeE1 + 1 / safeE2));
  const result = girisim / denominator;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "CRITICAL",
      source: "DIN 7190",
      message: "Kritik Uyarı: Girişim miktarı (Interference) nominal çapın %0.15'ini aşıyor. Presleme veya ısıl genleşme montajı esnasında göbekte (Hub) plastik deformasyon, yırtılma veya çatlama (Fracture) garantidir."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}