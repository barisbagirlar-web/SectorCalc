import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_207
 * Araç Adı: Von Mises Gerilmesi
 */

export const InputSchema_MECH_207 = z.object({
  sigma_x: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  sigma_y: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  tau_xy: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
});

export type Input_MECH_207 = z.infer<typeof InputSchema_MECH_207>;

export interface Output_MECH_207 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_207(input: Input_MECH_207): Output_MECH_207 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: sigma_x, sigma_y, tau_xy
  
  const validData = InputSchema_MECH_207.parse(input);
  const { sigma_x, sigma_y, tau_xy } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result = Math.sqrt(Math.max(0, sigma_x * sigma_x - sigma_x * sigma_y + sigma_y * sigma_y + 3 * tau_xy * tau_xy)); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (result > 355000000) {
    smartWarnings.push({
      severity: "WARNING",
      source: "Von Mises Distorsiyon Enerjisi Teorisi",
      message: "Uyarı: Eşdeğer gerilme üst yapı çeliklerinin akma sınırını (355 MPa) aşmıştır. Çok eksenli yükleme altında parça kalıcı plastik deformasyona uğrayacaktır."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}