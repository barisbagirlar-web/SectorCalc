import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_186
 * Araç Adı: Mohr Çemberi (Asal Gerilmeler)
 */

export const InputSchema_MECH_186 = z.object({
  sigma_x: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  sigma_y: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  tau_xy: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_186 = z.infer<typeof InputSchema_MECH_186>;

export interface Output_MECH_186 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_186(input: Input_MECH_186): Output_MECH_186 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: sigma_x, sigma_y, tau_xy
  
  const validData = InputSchema_MECH_186.parse(input);
  const { sigma_x, sigma_y, tau_xy } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const merkez = (sigma_x + sigma_y) / 2;
  const yaricap = Math.sqrt(Math.max(0, Math.pow((sigma_x - sigma_y) / 2, 2) + Math.pow(tau_xy, 2)));
  const result = merkez;
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 250000000) {
    smartWarnings.push({
      severity: "INFO",
      source: "Von Mises / Tresca Akma Kriteri",
      message: "Not: Çıkan Maksimum Asal Gerilme (Sigma 1) 250 MPa'yı aşmaktadır. Standart yapı çelikleri (örn. S275) bu noktada plastik deformasyona (Akma) uğrar. Eğer kullandığınız malzeme yüksek mukavemetli (Örn: Titanyum, Islah Çeliği) değilse tasarım başarısızdır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}