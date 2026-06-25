import { z } from "zod";

/**
 * SECTORCALC ENDÜSTRİYEL VALİDASYON KATMANI (RULE ENGINE)
 * Araç ID: MECH_193
 * Araç Adı: Mil Tasarımı (ASME)
 */

export const InputSchema_MECH_193 = z.object({
  moment: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  tork: z.number().min(0, "0 veya negatif olamaz (Sıfıra bölünme riski)"),
  akma_gerilmesi: z.number().min(10000000, "Endüstriyel minimum tolerans: 10000000"),
});

export type Input_MECH_193 = z.infer<typeof InputSchema_MECH_193>;

export interface Output_MECH_193 {
  result: number;
  smartWarnings: Array<{severity: string, source: string, message: string}>;
}

export function execute_MECH_193(input: Input_MECH_193): Output_MECH_193 {
  // ADIM 3 HESAPLAMA İZLEME (Statik İz)
  // Girdi Değişkenleri: moment, tork, akma_gerilmesi
  
  const validData = InputSchema_MECH_193.parse(input);
  const { moment, tork, akma_gerilmesi } = validData as any;
  
  // Formül hesaplamaları entegrasyonu (Endüstri Standardı)
  const result: number = Math.pow(
    (16 / (Math.PI * akma_gerilmesi)) * Math.sqrt(Math.max(0, moment * moment + 0.75 * tork * tork)),
    1 / 3
  ); 
  
  const smartWarnings: Array<{severity: string, source: string, message: string}> = [];
  
  if (true) {
    smartWarnings.push({
      severity: "WARNING",
      source: "ASME Mil Tasarım Kodu",
      message: "Uyarı: Bu formül salt statik yüklemeyi temsil eder. Dönen millerde tam değişken eğilme ve sabit burulma (Fatigue/Yorulma) vardır. Şok (Kt) ve Yorulma (Kf) faktörleri ile Goodman/Soderberg kriterleri dikkate alınmadan mil imal edilemez."
    });
  }
  
  return {
    result,
    smartWarnings
  };
}